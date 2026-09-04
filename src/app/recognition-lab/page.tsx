'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { municipalSigns } from '@/data/signs/municipal-signs';
import { useSahayakCamera } from '@/features/sahayak/hooks/useSahayakCamera';
import { addRealSample, addUnknownSample, clearRealSamples, clearUnknownSamples, loadRealSamples, loadUnknownSamples, realSampleCounts, REAL_SAMPLE_TARGET_RECOMMENDED, REAL_SAMPLE_TARGET_MIN, REAL_SAMPLE_TARGET_MAX, saveCalibration } from '@/lib/recognition/dataset';
import { captureFeatures, closeCaptureLandmarker, getCaptureLandmarker } from '@/lib/recognition/capture';
import { evaluateDataset, type EvaluationResult } from '@/lib/recognition/evaluation';
import { importExternalLandmarkBundle, validateExternalBundle } from '@/lib/recognition/external-dataset';

const captureIntervalMs = 280;

export default function RecognitionLabPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const camera = useSahayakCamera({ externalVideoRef: videoRef });
  const [selectedSign, setSelectedSign] = useState(municipalSigns[0]?.id ?? '');
  const [target, setTarget] = useState(REAL_SAMPLE_TARGET_RECOMMENDED);
  const [capturedForSign, setCapturedForSign] = useState(0);
  const [landmarkerReady, setLandmarkerReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [message, setMessage] = useState('Start the camera, choose a sign, then hold the sign naturally in frame.');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [unknownCount, setUnknownCount] = useState(0);
  const importInputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = useMemo(() => municipalSigns.find((s) => s.id === selectedSign)?.name ?? selectedSign, [selectedSign]);

  const importExternal = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const bundle = JSON.parse(await file.text());
      if (!validateExternalBundle(bundle)) { setMessage('Invalid landmark bundle. Expected 42-D normalized SANKET samples.'); return; }
      const imported = importExternalLandmarkBundle(bundle);
      setMessage(`Imported ${imported} external landmark samples. Recalculate and then reload Sahayak.`);
      refresh();
    } catch { setMessage('Could not import dataset JSON.'); }
  };

  const refresh = useCallback(() => {
    const next = realSampleCounts(loadRealSamples());
    setCounts(next);
    setCapturedForSign(next[selectedSign] ?? 0);
    setUnknownCount(loadUnknownSamples().length);
    setEvaluation(evaluateDataset());
  }, [selectedSign]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => () => {
    if (captureTimer.current) clearInterval(captureTimer.current);
    camera.stopCamera();
    closeCaptureLandmarker();
  }, []);

  const startLab = async () => {
    try {
      await getCaptureLandmarker();
      setLandmarkerReady(true);
      await camera.requestCamera();
      setMessage('Camera ready. Put the selected sign in the square and hold it steady.');
    } catch {
      setMessage('Could not load the local hand model. Check the network once, then retry.');
    }
  };

  const captureOne = useCallback(() => {
    if (!videoRef.current || camera.cameraState !== 'running' || capturedForSign >= REAL_SAMPLE_TARGET_MAX) return;
    const features = captureFeatures(videoRef.current);
    if (!features) {
      setMessage('No clean hand frame yet — move your hand fully inside the square and hold steady.');
      return;
    }
    addRealSample({ signId: selectedSign, landmarks: features, capturedAt: new Date().toISOString(), source: 'camera' });
    const next = (counts[selectedSign] ?? 0) + 1;
    setCounts((prev) => ({ ...prev, [selectedSign]: next }));
    setCapturedForSign(next);
    setMessage(next >= REAL_SAMPLE_TARGET_MIN ? `Good — ${next} real samples captured for ${selectedLabel}. You can continue to ${target}.` : `${next}/${target} captured. Keep changing distance/position slightly between captures.`);
  }, [camera.cameraState, capturedForSign, counts, selectedLabel, selectedSign, target]);

  useEffect(() => {
    if (!capturing) return;
    captureTimer.current = setInterval(captureOne, captureIntervalMs);
    return () => { if (captureTimer.current) clearInterval(captureTimer.current); };
  }, [captureOne, capturing]);

  const captureUnknown = useCallback(() => {
    if (!videoRef.current || camera.cameraState !== 'running' || unknownCount >= REAL_SAMPLE_TARGET_MAX) return;
    const features = captureFeatures(videoRef.current);
    if (!features) { setMessage('No clean hand frame yet.'); return; }
    addUnknownSample({ landmarks: features, capturedAt: new Date().toISOString(), source: 'camera' });
    const next = unknownCount + 1;
    setUnknownCount(next);
    setMessage(`${next} unknown/negative frames captured. Use natural non-target poses or other unsupported signs.`);
  }, [camera.cameraState, unknownCount]);

  const exportDataset = useCallback(() => {
    const payload = { version: 1, exportedAt: new Date().toISOString(), realSamples: loadRealSamples(), unknownSamples: loadUnknownSamples() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sanket-recognition-dataset.json'; a.click();
    URL.revokeObjectURL(url);
  }, []);

  const applyCalibration = useCallback(() => {
    if (!evaluation) return;
    saveCalibration({ distance: evaluation.recommendedDistance, margin: evaluation.recommendedMargin, calibratedAt: new Date().toISOString(), validationPrecision: evaluation.validation.precision, validationCoverage: evaluation.validation.coverage, openSetFalseAcceptRate: evaluation.openSet.falseAcceptRate });
    setMessage(`Calibration saved: distance ${evaluation.recommendedDistance}, margin ${evaluation.recommendedMargin}. Reload Sahayak to use it.`);
  }, [evaluation]);

  const stopCapture = () => {
    setCapturing(false);
    if (captureTimer.current) clearInterval(captureTimer.current);
    refresh();
  };

  const clearCurrent = () => {
    clearRealSamples(selectedSign);
    refresh();
    setMessage(`Cleared real samples for ${selectedLabel}.`);
  };

  const clearAll = () => {
    clearRealSamples();
    refresh();
    setMessage('Cleared all locally captured real samples.');
  };

  const matrixRows = evaluation?.labels ?? [];

  return (
    <main className="min-h-screen bg-navy-900 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Sanket Recognition Lab</p>
            <h1 className="text-3xl font-bold md:text-4xl">Real Camera Dataset + Calibration</h1>
            <p className="mt-2 max-w-3xl text-sm text-white/60">Developer calibration tool. Samples stay in this browser&apos;s localStorage until exported/cleared. This is not a claim of production accuracy.</p>
          </div>
          <a href="/assist" className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/5">← Back to Sahayak</a>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Camera capture</h2>
                <p className="text-xs text-white/50">Target: {REAL_SAMPLE_TARGET_MIN} minimum · {REAL_SAMPLE_TARGET_RECOMMENDED} recommended · {REAL_SAMPLE_TARGET_MAX} maximum / sign</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${landmarkerReady ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-white/50'}`}>{landmarkerReady ? 'Hand model ready' : 'Model not loaded'}</span>
            </div>

            <div className="mx-auto max-w-[560px]">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/15 bg-black">
                <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover -scale-x-100" />
                <div className="pointer-events-none absolute inset-[12%] rounded-2xl border-2 border-dashed border-gold-400/50" />
                <div className="absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1 text-xs">{selectedLabel}</div>
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/65 px-3 py-2 text-xs text-white/80">{message}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button onClick={startLab} className="rounded-xl bg-gold-400 px-4 py-3 font-bold text-navy-900">Start Camera + Model</button>
              {!capturing ? (
                <button disabled={camera.cameraState !== 'running' || !landmarkerReady || capturedForSign >= REAL_SAMPLE_TARGET_MAX} onClick={() => setCapturing(true)} className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 font-bold text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40">Start Capture</button>
              ) : (
                <button onClick={stopCapture} className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 font-bold text-red-200">Stop Capture</button>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 font-semibold">1. Select sign</h2>
              <select value={selectedSign} onChange={(e) => setSelectedSign(e.target.value)} className="w-full rounded-xl border border-white/15 bg-navy-800 px-3 py-3 text-sm text-white">
                {municipalSigns.map((sign) => <option key={sign.id} value={sign.id}>{sign.name}</option>)}
              </select>
              <div className="mt-4 rounded-xl bg-white/5 p-4">
                <div className="flex justify-between text-sm"><span>Real samples</span><strong>{capturedForSign}/{target}</strong></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold-400" style={{ width: `${Math.min(100, (capturedForSign / target) * 100)}%` }} /></div>
              </div>
              <label className="mt-4 block text-xs text-white/50">Target samples</label>
              <input type="range" min={REAL_SAMPLE_TARGET_MIN} max={REAL_SAMPLE_TARGET_MAX} value={target} onChange={(e) => setTarget(Number(e.target.value))} className="mt-2 w-full" />
              <p className="mt-1 text-right text-xs text-white/50">{target}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-3 font-semibold">Capture protocol</h2>
              <ul className="space-y-2 text-sm text-white/65">
                <li>• Keep the whole hand inside the guide.</li>
                <li>• Capture at different distances and small positions.</li>
                <li>• Use natural lighting; avoid extreme blur.</li>
                <li>• Do not deliberately make the sign wrong.</li>
                <li>• For dynamic signs, this recorder is only a static-frame baseline.</li>
              </ul>
              <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={captureUnknown} disabled={camera.cameraState !== 'running' || unknownCount >= REAL_SAMPLE_TARGET_MAX} className="rounded-lg border border-blue-400/20 px-3 py-2 text-xs text-blue-200 disabled:opacity-40">Capture negative ({unknownCount})</button><button onClick={exportDataset} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Export dataset</button><button onClick={() => importInputRef.current?.click()} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Import landmarks</button><input ref={importInputRef} type="file" accept="application/json,.json" onChange={importExternal} className="hidden" /><button onClick={() => { clearUnknownSamples(); setUnknownCount(0); setMessage('Cleared negative samples.'); }} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Clear negatives</button><button onClick={clearCurrent} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Clear current</button><button onClick={clearAll} className="rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-200">Clear all</button><button onClick={applyCalibration} disabled={!evaluation} className="rounded-lg border border-emerald-400/20 px-3 py-2 text-xs text-emerald-200 disabled:opacity-40">Apply calibration</button></div>
            </div>
          </aside>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="font-semibold">Holdout diagnostic</h2><p className="text-xs text-white/50">Useful for spotting confusing sign pairs. Uses a deterministic 70/15/15 holdout; real samples are tracked separately in counts.</p></div>
            <button onClick={() => setEvaluation(evaluateDataset())} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold">Recalculate</button>
          </div>
          {evaluation && <div className="grid gap-4 md:grid-cols-4">
            <Metric label="Diagnostic accuracy" value={`${(evaluation.accuracy * 100).toFixed(1)}%`} />
            <Metric label="Test samples" value={String(evaluation.total)} />
            <Metric label="Train / Val" value={`${evaluation.split.train} / ${evaluation.split.validation}`} />
            <Metric label="Unknown rate" value={`${(evaluation.rejectionRate * 100).toFixed(1)}%`} />
            <Metric label="Val precision" value={`${(evaluation.validation.precision * 100).toFixed(1)}%`} />
            <Metric label="Suggested distance / margin" value={`${evaluation.recommendedDistance} / ${evaluation.recommendedMargin}`} />
          </div>}

          {evaluation && (evaluation.difficultPairs.length > 0 || evaluation.openSet.samples > 0) && (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                <h3 className="font-semibold">Difficult sign pairs</h3>
                <p className="mt-1 text-xs text-white/40">Highest off-diagonal test errors. Collect extra real samples for these pairs first.</p>
                <div className="mt-3 space-y-2">{evaluation.difficultPairs.slice(0,6).map((pair) => <div key={`${pair.actual}-${pair.predicted}`} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs"><span>{pair.actual} → {pair.predicted}</span><span className="text-red-300">{pair.errors} errors</span></div>)}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                <h3 className="font-semibold">Open-set safety</h3>
                <p className="mt-1 text-xs text-white/40">Negative frames test whether the model rejects unsupported poses instead of forcing a known label.</p>
                <div className="mt-3 grid grid-cols-3 gap-2"><Metric label="Negative frames" value={String(evaluation.openSet.samples)} /><Metric label="False accepts" value={String(evaluation.openSet.falseAccepts)} /><Metric label="False accept rate" value={`${(evaluation.openSet.falseAcceptRate*100).toFixed(1)}%`} /></div>
              </div>
            </div>
          )}

          {evaluation && matrixRows.length > 0 && <div className="mt-6 overflow-auto rounded-xl border border-white/10">
            <table className="min-w-full text-[10px]">
              <thead><tr><th className="sticky left-0 bg-navy-900 p-2 text-left">Actual ↓ / Predicted →</th>{matrixRows.map((l) => <th key={l} className="p-2 font-medium text-white/60">{l}</th>)}</tr></thead>
              <tbody>{matrixRows.map((row, r) => <tr key={row} className="border-t border-white/5"><th className="sticky left-0 bg-navy-900 p-2 text-left font-medium">{row}</th>{matrixRows.map((col, c) => <td key={col} className={`p-2 text-center ${r === c && evaluation.matrix[r][c] ? 'text-emerald-300' : evaluation.matrix[r][c] ? 'text-red-300' : 'text-white/20'}`}>{evaluation.matrix[r][c] || '·'}</td>)}</tr>)}</tbody>
            </table>
          </div>}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-white/45">{label}</p><p className="mt-1 text-lg font-bold">{value}</p></div>;
}
