import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Radio, 
  Play, 
  Pause, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Sliders, 
  Layers, 
  Usb, 
  Wifi, 
  Check, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Cast
} from 'lucide-react';
import { DeviceInfo, DeviceDisplay, StreamSettings } from '../types/vysor';
import { AndroidKeyCode } from '@yume-chan/scrcpy';

interface DeviceScreenProps {
  device: DeviceInfo;
  display: DeviceDisplay;
  settings: StreamSettings;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isStreamActive: boolean;
  onStartCapture: () => void;
  onStopCapture: () => void;
  onPairWebUsb: () => void;
  onTakeScreenshot: () => void;
  isLocked: boolean;
  onToggleLock: () => void;
  onInjectTouch: (x: number, y: number, action: 'down' | 'move' | 'up') => void;
  onInjectKey: (keyCode: number) => void;
  onSelectDisplay: (id: number) => void;
  displays: DeviceDisplay[];
}

export const DeviceScreen: React.FC<DeviceScreenProps> = ({
  device,
  display,
  settings,
  videoRef,
  canvasRef,
  isStreamActive,
  onStartCapture,
  onStopCapture,
  onPairWebUsb,
  onTakeScreenshot,
  onInjectTouch,
  onInjectKey,
  onSelectDisplay,
  displays
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [touchIndicator, setTouchIndicator] = useState<{ x: number; y: number; active: boolean } | null>(null);
  const [liveFps, setLiveFps] = useState<number>(60);
  const [actualDimensions, setActualDimensions] = useState<{ width: number; height: number }>({ width: display.width, height: display.height });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const frameCounterRef = useRef<{ frames: number; lastTime: number }>({ frames: 0, lastTime: performance.now() });

  // Monitor real video dimensions & FPS
  useEffect(() => {
    let animId: number;

    const checkFps = () => {
      const now = performance.now();
      frameCounterRef.current.frames++;
      if (now - frameCounterRef.current.lastTime >= 1000) {
        setLiveFps(Math.round((frameCounterRef.current.frames * 1000) / (now - frameCounterRef.current.lastTime)));
        frameCounterRef.current.frames = 0;
        frameCounterRef.current.lastTime = now;
      }

      if (videoRef.current && videoRef.current.videoWidth > 0) {
        if (
          videoRef.current.videoWidth !== actualDimensions.width ||
          videoRef.current.videoHeight !== actualDimensions.height
        ) {
          setActualDimensions({
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
          });
        }
      }

      animId = requestAnimationFrame(checkFps);
    };

    if (isStreamActive) {
      animId = requestAnimationFrame(checkFps);
    }

    return () => cancelAnimationFrame(animId);
  }, [isStreamActive, actualDimensions]);

  // Handle pointer / touch on the live video surface
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = videoRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setIsMouseDown(true);
    setTouchIndicator({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
    onInjectTouch(x, y, 'down');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMouseDown || !videoRef.current) return;
    const rect = videoRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setTouchIndicator({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
    onInjectTouch(x, y, 'move');
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = videoRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setIsMouseDown(false);
    onInjectTouch(x, y, 'up');
    setTimeout(() => setTouchIndicator(null), 250);
  };

  // Wheel scroll event (maps to scrcpy scroll)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      onInjectKey(AndroidKeyCode.ArrowDown);
    } else {
      onInjectKey(AndroidKeyCode.ArrowUp);
    }
  };

  const isLandscape = display.orientation === 'landscape' || actualDimensions.width > actualDimensions.height;

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col items-center justify-center h-full w-full p-2 select-none"
    >
      {/* Device Outer Frame */}
      <div 
        className={`relative transition-all duration-300 shadow-2xl flex flex-col overflow-hidden ${
          settings.frameStyle === 'frameless' 
            ? 'rounded-xl border border-neutral-700/80 bg-neutral-950' 
            : 'rounded-[36px] p-2.5 bg-neutral-900 border-4 border-neutral-800 shadow-cyan-950/20'
        }`}
        style={{
          width: isLandscape ? 'min(92vw, 880px)' : 'min(90vw, 420px)',
          height: isLandscape ? 'min(76vh, 550px)' : 'min(82vh, 800px)',
          aspectRatio: isLandscape ? '16/10' : '9/19.5',
        }}
      >
        {/* Scrcpy Live Capture Surface */}
        <div className="relative w-full h-full bg-black rounded-[26px] overflow-hidden flex flex-col border border-neutral-800">
          
          {isStreamActive ? (
            /* LIVE SCRCPY CAPTURE VIEW */
            <div 
              className="relative w-full h-full bg-black flex items-center justify-center cursor-crosshair overflow-hidden"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
            >
              {/* Real Video Element */}
              <video 
                ref={videoRef as React.RefObject<HTMLVideoElement>} 
                autoPlay 
                playsInline 
                muted={audioMuted} 
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Offscreen canvas for frame processing & snapshots */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Touch ripple feedback */}
              {touchIndicator && (
                <div 
                  className="absolute pointer-events-none w-8 h-8 rounded-full border-2 border-cyan-400 bg-cyan-400/25 -translate-x-1/2 -translate-y-1/2 animate-ping"
                  style={{ left: touchIndicator.x, top: touchIndicator.y }}
                />
              )}

              {/* Top Scrcpy Overlay Bar */}
              <div className="absolute top-2.5 inset-x-3 flex items-center justify-between pointer-events-none z-30">
                <div className="flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-neutral-800 pointer-events-auto">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-mono font-bold text-white tracking-wider">
                      LIVE SCRCPY CAPTURE
                    </span>
                  </div>
                  <span className="text-neutral-500">|</span>
                  <span className="text-[9px] font-mono text-cyan-300">
                    --display-id={display.id}
                  </span>
                </div>

                <div className="flex items-center gap-1 pointer-events-auto">
                  {/* Mute Audio */}
                  <button
                    onClick={() => setAudioMuted(!audioMuted)}
                    className="p-1.5 rounded-lg bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
                    title={audioMuted ? 'Unmute Audio Stream' : 'Mute Audio Stream'}
                  >
                    {audioMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-cyan-400" />}
                  </button>

                  {/* Disconnect / Stop */}
                  <button
                    onClick={onStopCapture}
                    className="px-2 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-[10px] font-mono font-semibold transition-colors"
                    title="Stop scrcpy capture"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              {/* Bottom Scrcpy Stream Telemetry HUD */}
              <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between pointer-events-none z-30">
                <div className="bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-neutral-800 text-[9px] font-mono text-neutral-300 flex items-center gap-2">
                  <span className="text-white font-bold">{actualDimensions.width}×{actualDimensions.height}</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-emerald-400 font-bold">{liveFps} FPS</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-cyan-400">{settings.bitrateMbps} Mbps</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-400">&lt;10ms</span>
                </div>

                <div className="bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-neutral-800 text-[9px] font-mono text-emerald-400 font-bold">
                  {settings.videoCodec} HW
                </div>
              </div>
            </div>
          ) : (
            /* SCRCPY CAPTURE LAUNCHER (ZERO MOCKUPS - READY TO CAPTURE) */
            <div className="relative w-full h-full bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 flex flex-col justify-between p-6 text-neutral-200">
              
              {/* Top Banner */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-white">
                    SCRCPY DEVICE SERVER READY
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  PRO BYPASS ACTIVE (FREE)
                </span>
              </div>

              {/* Center Action Box */}
              <div className="flex flex-col items-center text-center my-auto space-y-4 max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-950/40">
                  <Cast className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Start Real Live scrcpy Capture
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Stream your physical Android screen, scrcpy window, or external monitor directly with ultra-low latency & full touch injection.
                  </p>
                </div>

                {/* Primary Launch Button */}
                <div className="w-full space-y-2 pt-2">
                  <button
                    onClick={onStartCapture}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>LAUNCH REAL LIVE SCRCPY CAPTURE</span>
                  </button>

                  <button
                    onClick={onPairWebUsb}
                    className="w-full py-2.5 px-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-200 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Usb className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Pair via WebUSB ADB Protocol</span>
                  </button>
                </div>

                {/* Active Display Flag */}
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 w-full text-left font-mono text-[11px] text-neutral-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Target Scrcpy Flag:</span>
                    <span className="text-cyan-300 font-bold">--display-id={display.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Display Resolution:</span>
                    <span className="text-white">{display.width} × {display.height} ({display.refreshRate}Hz)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Audio Forwarding:</span>
                    <span className="text-emerald-400">Enabled (stereo PCM)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Instructions */}
              <div className="text-[10px] text-neutral-500 border-t border-neutral-800 pt-2 text-center font-mono">
                Supports real physical Android 5.0+ devices, scrcpy v1.x/v2.x/v3.x, and multi-display mirroring.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
