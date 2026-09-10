'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import type { CameraState } from '../types';

interface UseSahayakCameraOptions {
  externalVideoRef?: React.RefObject<HTMLVideoElement | null>;
}

export function useSahayakCamera(options?: UseSahayakCameraOptions) {
  const [cameraState, setCameraState] = useState<CameraState>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = (options?.externalVideoRef as React.RefObject<HTMLVideoElement>) ?? internalVideoRef;
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  // Attach stream to video and play
  const attachAndPlay = useCallback(async (mediaStream: MediaStream) => {
    const video = videoRef.current;
    if (!video) return false;
    try {
      video.srcObject = mediaStream;
      await video.play();
      setCameraState('running');
      return true;
    } catch {
      // Autoplay blocked — user must click "Go Live"
      setCameraState('ready');
      return false;
    }
  }, [videoRef]);

  // Request camera permission and get stream (does NOT auto-play)
  const requestCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported');
      return;
    }
    setCameraState('requesting');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 }, frameRate: { ideal: 30, max: 30 } },
        audio: false,
      });
      setStream(mediaStream);
      streamRef.current = mediaStream;
      // Try to attach — if autoplay blocked, state stays 'ready'
      const attached = await attachAndPlay(mediaStream);
      if (!attached) {
        setCameraState('ready');
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setCameraState('denied');
      } else {
        setCameraState('error');
      }
    }
  }, [attachAndPlay]);

  // Manually start camera (user clicked "Go Live")
  const startCamera = useCallback(async () => {
    const currentStream = streamRef.current;
    if (!currentStream) return;
    const video = videoRef.current;
    if (!video) return;
    try {
      video.srcObject = currentStream;
      await video.play();
      setCameraState('running');
    } catch {
      setCameraState('error');
    }
  }, [videoRef]);

  const stopCamera = useCallback(() => {
    const currentStream = streamRef.current ?? videoRef.current?.srcObject as MediaStream | null;
    if (currentStream) {
      currentStream.getTracks().forEach(t => t.stop());
    }
    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
      try { video.pause(); } catch {}
    }
    streamRef.current = null;
    setStream(null);
    setCameraState('idle');
  }, [videoRef]);

  const pauseCamera = useCallback(() => {
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
      setCameraState('paused');
    }
  }, [videoRef]);

  const resumeCamera = useCallback(async () => {
    const video = videoRef.current;
    if (video && video.paused) {
      try {
        await video.play();
        setCameraState('running');
      } catch {}
    }
  }, [videoRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const s = streamRef.current;
      if (s) s.getTracks().forEach(t => t.stop());
      const v = videoRef.current;
      if (v) v.srcObject = null;
    };
  }, [videoRef]);

  // Re-attach when video becomes ready (if stream exists but video has no srcObject)
  useEffect(() => {
    if (cameraState === 'ready' && streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraState, videoRef]);

  return {
    cameraState,
    stream,
    videoRef,
    requestCamera,
    startCamera,
    stopCamera,
    pauseCamera,
    resumeCamera,
  };
}
