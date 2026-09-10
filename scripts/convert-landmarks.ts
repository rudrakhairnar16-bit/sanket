/**
 * Convert an external landmark export into SANKET's browser-import format.
 *
 * Input JSON can be either:
 *   [{ signId, landmarks: number[] }, ...]
 * or { samples: [{ signId, landmarks: number[] }, ...] }
 *
 * The landmarks must already be 42-D (21 x/y points) in SANKET's normalized
 * coordinate convention. This script intentionally does not pretend to extract
 * landmarks from RGB videos; that extraction should be done with MediaPipe or
 * the upstream dataset's official pose pipeline.
 */
import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2];
const output = process.argv[3] ?? 'sanket-landmarks.json';
if (!input) {
  console.error('Usage: npx tsx scripts/convert-landmarks.ts <input.json> [output.json]');
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(input, 'utf8'));
const source = Array.isArray(raw) ? raw : raw?.samples;
if (!Array.isArray(source)) throw new Error('Expected an array or {samples: []}.');

const samples = source.filter((s) =>
  s && typeof s.signId === 'string' && Array.isArray(s.landmarks) && s.landmarks.length === 42 && s.landmarks.every((n: unknown) => typeof n === 'number' && Number.isFinite(n))
).map((s) => ({ signId: s.signId, landmarks: s.landmarks }));

if (!samples.length) throw new Error('No valid 42-D landmark samples found.');
fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
fs.writeFileSync(path.resolve(output), JSON.stringify({ version: 1, source: path.basename(input), samples }, null, 2));
console.log(`Wrote ${samples.length} valid SANKET landmark samples to ${output}`);
