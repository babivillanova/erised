'use client';

import { useEffect, useRef, useState } from 'react';
import LoadingSpinner from '@/common/loadingSpinner';

type NormalizedLandmark = {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
};

declare global {
  interface Window {
    Hands: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
    HAND_CONNECTIONS: any;
  }
}

export default function HandDetectionCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const giftImageRef = useRef<HTMLImageElement | null>(null);
  const previousHandCountRef = useRef<number>(0);
  const noHandsFrameCountRef = useRef<number>(0);
  const canLoadNewGiftRef = useRef<boolean>(true);
  const giftStateRef = useRef({
    visible: false,
    x: 0,
    y: 0,
    scale: 1,
    openFrames: 0,
    closedFrames: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hands: any = null;
    let camera: any = null;
    const scripts: HTMLScriptElement[] = [];
    let isCancelled = false;

    function loadScript(src: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
        if (existing) {
          if (existing.hasAttribute('data-loaded')) {
            resolve();
            return;
          }
          existing.addEventListener('load', () => resolve(), { once: true });
          existing.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)), {
            once: true,
          });
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.onload = () => {
          script.setAttribute('data-loaded', 'true');
          resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
        scripts.push(script);
      });
    }

    function loadGiftImage() {
      const img = new Image();
      // Randomly choose between available gift images
      const variants = ['gift1.png', 'gift2.png','gift3.png', 'g1.png', 'g2.png', 'g3.png', 'g4.png', 'g5.png', 'g6.png', 'g7.png', 'g8.png', 'g9.png', 'g10.png', 'g11.png', 'g12.png', 'g13.png'];
      const choice = variants[Math.floor(Math.random() * variants.length)];
      img.src = `/images/${choice}`;
      img.onload = () => {
        giftImageRef.current = img;
      };
      img.onerror = () => {
        const fallbackPng = new Image();
        fallbackPng.src = '/images/gift2.png';
        fallbackPng.onload = () => {
          giftImageRef.current = fallbackPng;
        };
        fallbackPng.onerror = () => {
          // Try SVG as final fallback
          const svgImg = new Image();
          svgImg.src = '/images/gift.svg';
          svgImg.onload = () => {
            giftImageRef.current = svgImg;
          };
          svgImg.onerror = () => {
            console.warn('Gift image not found, will draw a simple gift box');
          };
        };
      };
    }

    function isHandOpen(keypoints: { x: number; y: number }[]): boolean {
      if (keypoints.length < 21) return false;

      const wrist = keypoints[0];
      const indexTip = keypoints[8];
      const middleTip = keypoints[12];
      const ringTip = keypoints[16];
      const pinkyTip = keypoints[20];

      const indexMCP = keypoints[5]; // Index finger knuckle
      const middleMCP = keypoints[9]; // Middle finger knuckle
      const ringMCP = keypoints[13]; // Ring finger knuckle
      const pinkyMCP = keypoints[17]; // Pinky finger knuckle

      const indexExtended = Math.abs(indexTip.y - wrist.y) > Math.abs(indexMCP.y - wrist.y) * 1.2;
      const middleExtended = Math.abs(middleTip.y - wrist.y) > Math.abs(middleMCP.y - wrist.y) * 1.2;
      const ringExtended = Math.abs(ringTip.y - wrist.y) > Math.abs(ringMCP.y - wrist.y) * 1.2;
      const pinkyExtended = Math.abs(pinkyTip.y - wrist.y) > Math.abs(pinkyMCP.y - wrist.y) * 1.2;

      const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;
      return extendedCount >= 3;
    }

    function calculatePalmCenter(keypoints: { x: number; y: number }[]): { x: number; y: number } {
      const wrist = keypoints[0];
      const indexMCP = keypoints[5];
      const pinkyMCP = keypoints[17];

      return {
        x: (wrist.x + indexMCP.x + pinkyMCP.x) / 3,
        y: (wrist.y + indexMCP.y + pinkyMCP.y) / 3,
      };
    }

    function drawGift(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      scale: number = 1
    ) {
      const size = 480 * scale;
      const offsetY = size * 0.3; // lift gift slightly above palm center

      if (giftImageRef.current) {
        ctx.drawImage(
          giftImageRef.current,
          x - size / 2,
          y - size / 2 - offsetY,
          size,
          size
        );
      } else {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x - size / 2, y - size / 3 - offsetY, size, size * 0.66);

        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(x - size / 2, y - size / 12 - offsetY, size, size / 6);

        ctx.fillRect(x - size / 12, y - size / 3 - offsetY, size / 6, size * 0.66);

        ctx.beginPath();
        ctx.arc(x - size / 6, y - size / 3 - offsetY, size / 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size / 6, y - size / 3 - offsetY, size / 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.8;
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 * i) / 5 + Date.now() / 1000;
          const sparkleX = x + Math.cos(angle) * size * 0.7;
          const sparkleY = y + Math.sin(angle) * size * 0.5;
          ctx.beginPath();
          ctx.arc(sparkleX, sparkleY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }

    async function initialize() {
      try {
        setIsLoading(true);

        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');

        if (!videoRef.current || !canvasRef.current || isCancelled) return;

        hands = new window.Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.5,
        });

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setError('Unable to initialize drawing context.');
          return;
        }

        hands.onResults((results: any) => {
          if (!canvasRef.current || !videoRef.current) return;

          const canvasEl = canvasRef.current;
          const context = canvasEl.getContext('2d');
          if (!context) return;

          const video = videoRef.current;
          canvasEl.width = video.videoWidth || canvasEl.clientWidth;
          canvasEl.height = video.videoHeight || canvasEl.clientHeight;

          context.save();
          context.clearRect(0, 0, canvasEl.width, canvasEl.height);

          context.drawImage(
            results.image,
            0,
            0,
            canvasEl.width,
            canvasEl.height
          );

          const currentHandCount = results.multiHandLandmarks?.length || 0;
          const previousHandCount = previousHandCountRef.current;

          // Track when no hands are detected to reset gift loading ability
          const NO_HANDS_THRESHOLD = 10; // Need 10 frames without hands to reset
          
          if (currentHandCount === 0) {
            noHandsFrameCountRef.current += 1;
            if (noHandsFrameCountRef.current >= NO_HANDS_THRESHOLD) {
              canLoadNewGiftRef.current = true;
            }
          } else {
            noHandsFrameCountRef.current = 0;
          }

          // Load new gift only when hand count increases AND we're allowed to
          if (currentHandCount > previousHandCount && canLoadNewGiftRef.current) {
            loadGiftImage();
            canLoadNewGiftRef.current = false;
          }
          
          previousHandCountRef.current = currentHandCount;

          const state = giftStateRef.current;

          let bestPalmCenter: { x: number; y: number } | null = null;
          let bestScale = 1;
          let anyOpenHand = false;

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            // Choose the "largest" open hand (so we don't jump between hands)
            let bestHandSize = 0;

            for (const landmarks of results.multiHandLandmarks as NormalizedLandmark[][]) {
              const scaled = landmarks.map((lm) => ({
                x: lm.x * canvasEl.width,
                y: lm.y * canvasEl.height,
              }));

              const wrist = scaled[0];
              const middleTip = scaled[12];
              const handSize = Math.sqrt(
                Math.pow(middleTip.x - wrist.x, 2) +
                Math.pow(middleTip.y - wrist.y, 2)
              );

              const open = isHandOpen(scaled);

              if (open && handSize > bestHandSize) {
                bestHandSize = handSize;
                bestPalmCenter = calculatePalmCenter(scaled);
                bestScale = handSize / 150;
                anyOpenHand = true;
              }
            }
          }

          // Hysteresis: need several frames open/closed to change visibility
          const OPEN_THRESHOLD = 3;   // frames
          const CLOSE_THRESHOLD = 5;  // frames

          if (anyOpenHand && bestPalmCenter) {
            state.openFrames += 1;
            state.closedFrames = 0;

            if (state.openFrames >= OPEN_THRESHOLD) {
              state.visible = true;

              // Smooth position and scale (low-pass filter)
              const SMOOTHING = 0.7; // closer to 1 = more smoothing
              const isInitialState = state.x === 0 && state.y === 0;
              state.x = isInitialState
                ? bestPalmCenter.x
                : state.x * SMOOTHING + bestPalmCenter.x * (1 - SMOOTHING);
              state.y = isInitialState
                ? bestPalmCenter.y
                : state.y * SMOOTHING + bestPalmCenter.y * (1 - SMOOTHING);
              state.scale = state.scale * SMOOTHING + bestScale * (1 - SMOOTHING);
            }
          } else {
            state.closedFrames += 1;
            state.openFrames = 0;

            if (state.closedFrames >= CLOSE_THRESHOLD) {
              state.visible = false;
            }
          }

          // Actually draw the gift once per frame using the smoothed state
          if (state.visible) {
            drawGift(context, state.x, state.y, state.scale);
          }

          context.restore();
        });

        const Camera = window.Camera;
        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (!hands || !videoRef.current) return;
            await hands.send({ image: videoRef.current });
          },
          width: 1920,
          height: 1080,
        });

        loadGiftImage();

        await camera.start();
        if (!isCancelled) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error initializing hand detection:', err);
        if (!isCancelled) {
          setError('Unable to initialize hand detection. Please refresh and try again.');
          setIsLoading(false);
        }
      }
    }

    initialize();

    return () => {
      isCancelled = true;
      if (camera && camera.stop) {
        camera.stop();
      }
      if (hands && hands.close) {
        hands.close();
      }
      scripts.forEach((script) => {
        if (script.parentNode && !script.hasAttribute('data-loaded')) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
        playsInline
        muted
      />

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Vinheta preta suave */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.8) 80%,rgba(0, 0, 0, 0.8) 80%, rgba(0, 0, 0, 1) 100%)'
        }}
      />

      {/* Segunda vinheta - mais escura nas bordas extremas */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0.9) 95%, rgba(0, 0, 0, 1) 100%)'
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-red-900 to-green-900 text-white z-10">
          <LoadingSpinner />
          <p className="mt-6 text-xl font-semibold">Loading Christmas Magic...</p>
          <p className="mt-2 text-sm opacity-80">Setting up camera and hand detection</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900 text-white z-10">
          <div className="text-6xl mb-4">🎄</div>
          <p className="text-xl font-semibold mb-2">Oops!</p>
          <p className="text-center px-6">{error}</p>
        </div>
      )}

    
  
    </div>
  );
}

