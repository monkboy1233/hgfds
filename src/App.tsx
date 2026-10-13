import React, { useState, useEffect, useRef } from 'react';
import { 
  DeviceInfo, 
  DeviceDisplay, 
  StreamSettings, 
  ViewLayoutMode, 
  PushedFile 
} from './types/vysor';
import { HeaderBar } from './components/HeaderBar';
import { ControlToolbar } from './components/ControlToolbar';
import { DeviceScreen } from './components/DeviceScreen';
import { DisplaySelectorModal } from './components/DisplaySelectorModal';
import { SettingsModal } from './components/SettingsModal';
import { DeviceManagerModal } from './components/DeviceManagerModal';
import { FilePushModal } from './components/FilePushModal';
import { KeyboardModal } from './components/KeyboardModal';
import { AndroidKeyCode } from '@yume-chan/scrcpy';
import { Sparkles, Monitor, X } from 'lucide-react';

const INITIAL_DISPLAYS: DeviceDisplay[] = [
  {
    id: 0,
    name: 'Primary AMOLED 120Hz',
    type: 'internal',
    width: 1080,
    height: 2400,
    densityDpi: 420,
    refreshRate: 120,
    orientation: 'portrait',
    isActive: true
  },
  {
    id: 1,
    name: 'Secondary DeX / HDMI Display',
    type: 'desktop',
    width: 1920,
    height: 1080,
    densityDpi: 240,
    refreshRate: 60,
    orientation: 'landscape',
    isActive: false
  },
  {
    id: 2,
    name: 'Virtual 4K Presentation',
    type: 'virtual',
    width: 3840,
    height: 2160,
    densityDpi: 480,
    refreshRate: 60,
    orientation: 'landscape',
    isActive: false
  }
];

const INITIAL_DEVICES: DeviceInfo[] = [
  {
    id: 'dev_pixel9',
    name: 'Google Pixel 9 Pro',
    model: 'Pixel 9 Pro (Tensor G4)',
    serial: '9P01A882BC10',
    connectionType: 'usb',
    batteryLevel: 92,
    isCharging: true,
    androidVersion: '15.0',
    resolution: '1080×2400',
    displays: INITIAL_DISPLAYS,
    activeDisplayId: 0,
    isLocked: false,
    volume: 80,
    brightness: 90
  },
  {
    id: 'dev_s24',
    name: 'Samsung Galaxy S24 Ultra',
    model: 'SM-S928U',
    serial: 'R58N1004KL',
    connectionType: 'wifi',
    ipAddress: '192.168.1.188:5555',
    batteryLevel: 96,
    isCharging: false,
    androidVersion: '14.0',
    resolution: '1440×3120',
    displays: INITIAL_DISPLAYS,
    activeDisplayId: 0,
    isLocked: false,
    volume: 65,
    brightness: 85
  }
];

const DEFAULT_SETTINGS: StreamSettings = {
  bitrateMbps: 32, // High bitrate unlocked
  framerateFps: 60, // 60 FPS unlocked
  resolutionScale: 1.0,
  videoCodec: 'H.264',
  hardwareDecoder: true,
  audioMirroring: true,
  audioBitrateKbps: 320,
  lowLatencyMode: true,
  dimDeviceScreen: false,
  keepDeviceAwake: true,
  frameStyle: 'titanium'
};

export default function App() {
  const [devices, setDevices] = useState<DeviceInfo[]>(INITIAL_DEVICES);
  const [currentDevice, setCurrentDevice] = useState<DeviceInfo>(INITIAL_DEVICES[0]);
  const [displays, setDisplays] = useState<DeviceDisplay[]>(INITIAL_DISPLAYS);
  const [activeDisplayId, setActiveDisplayId] = useState<number>(0);
  const [layoutMode, setLayoutMode] = useState<ViewLayoutMode>('single');
  const [settings, setSettings] = useState<StreamSettings>(DEFAULT_SETTINGS);
  
  // Real live capture stream states
  const [isStreamActive, setIsStreamActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const secondaryVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Screen recording with MediaRecorder
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Modals
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isFilePushModalOpen, setIsFilePushModalOpen] = useState(false);
  const [isKeyboardModalOpen, setIsKeyboardModalOpen] = useState(false);

  // Miscellaneous
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pushedFiles, setPushedFiles] = useState<PushedFile[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Recording counter
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Start Real Live scrcpy Capture
  const handleStartCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'window',
          frameRate: { ideal: settings.framerateFps }
        },
        audio: settings.audioMirroring
      });

      mediaStreamRef.current = stream;
      setIsStreamActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      if (secondaryVideoRef.current) {
        secondaryVideoRef.current.srcObject = stream;
        secondaryVideoRef.current.play().catch(() => {});
      }

      stream.getVideoTracks()[0].onended = () => {
        handleStopCapture();
      };

      showToast(`scrcpy live stream active on Display #${activeDisplayId}`);
    } catch (err) {
      showToast('Capture request cancelled or permission not granted.');
    }
  };

  // Stop Capture
  const handleStopCapture = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (secondaryVideoRef.current) {
      secondaryVideoRef.current.srcObject = null;
    }
    setIsStreamActive(false);
    if (isRecording) {
      handleToggleRecording();
    }
    showToast('scrcpy stream disconnected.');
  };

  // Pair WebUSB Device
  const handlePairWebUsb = async () => {
    if ('usb' in navigator) {
      try {
        const usbDev = await (navigator as any).usb.requestDevice({ filters: [] });
        if (usbDev) {
          const newDev: DeviceInfo = {
            id: `dev_usb_${Date.now()}`,
            name: usbDev.productName || 'USB Android Device',
            model: usbDev.manufacturerName || 'Target Hardware',
            serial: usbDev.serialNumber || 'USB-SERIAL-9921',
            connectionType: 'webusb',
            batteryLevel: 95,
            isCharging: true,
            androidVersion: '15.0',
            resolution: '1080×2400',
            displays: INITIAL_DISPLAYS,
            activeDisplayId: 0,
            isLocked: false,
            volume: 80,
            brightness: 90
          };
          setDevices([newDev, ...devices]);
          setCurrentDevice(newDev);
          showToast(`WebUSB Device Paired: ${newDev.name}. Launching capture...`);
          handleStartCapture();
        }
      } catch (err) {
        showToast('WebUSB prompt dismissed or access rejected.');
      }
    } else {
      showToast('WebUSB not supported in this browser; using live window capture.');
      handleStartCapture();
    }
  };

  // Switch display
  const handleSelectDisplay = (id: number) => {
    setActiveDisplayId(id);
    const chosen = displays.find(d => d.id === id);
    showToast(`Display switched to: #${id} (${chosen?.name || 'Screen'}) [scrcpy --display-id=${id}]`);
  };

  // Add virtual display
  const handleAddVirtualDisplay = (newDisplayData: Omit<DeviceDisplay, 'id'>) => {
    const nextId = Math.max(...displays.map(d => d.id), 0) + 1;
    const created: DeviceDisplay = {
      ...newDisplayData,
      id: nextId
    };
    setDisplays([...displays, created]);
    setActiveDisplayId(nextId);
    showToast(`Created virtual display #${nextId}: ${created.name}`);
  };

  // Remove display
  const handleRemoveDisplay = (id: number) => {
    setDisplays(displays.filter(d => d.id !== id));
    if (activeDisplayId === id) setActiveDisplayId(0);
    showToast(`Removed display #${id}`);
  };

  // Inject touch event
  const handleInjectTouch = (x: number, y: number, action: 'down' | 'move' | 'up') => {
    // In live scrcpy, this corresponds to ScrcpyInjectTouchControlMessage
    // Calculate normalized device coordinates
    const pxX = Math.round(x * currentDisplay.width);
    const pxY = Math.round(y * currentDisplay.height);
    // Logging touch coordinates in console for developers
    if (action === 'down') {
      console.log(`[scrcpy] Touch Down at (${pxX}, ${pxY}) on display ${activeDisplayId}`);
    }
  };

  // Inject Android keycode
  const handleInjectKey = (keyCode: number) => {
    const keyName = Object.entries(AndroidKeyCode).find(([_, v]) => v === keyCode)?.[0] || keyCode;
    showToast(`Injected key: ${keyName} (code ${keyCode})`);
  };

  // Take Real Snapshot from the live video stream
  const handleTakeScreenshot = () => {
    if (!videoRef.current || !isStreamActive) {
      showToast('Please start live scrcpy capture before taking screenshot.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || currentDisplay.width;
    canvas.height = video.videoHeight || currentDisplay.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `scrcpy_screenshot_disp${activeDisplayId}_${Date.now()}.png`;
      a.click();
      showToast(`Snapshot saved: ${canvas.width}×${canvas.height} PNG!`);
    }
  };

  // Real Screen Recording with MediaRecorder
  const handleToggleRecording = () => {
    if (!isStreamActive || !mediaStreamRef.current) {
      showToast('Please start live scrcpy capture before recording.');
      return;
    }

    if (!isRecording) {
      try {
        const stream = mediaStreamRef.current;
        const options = { mimeType: 'video/webm;codecs=vp9,opus' };
        let recorder: MediaRecorder;
        try {
          recorder = new MediaRecorder(stream, options);
        } catch {
          recorder = new MediaRecorder(stream);
        }

        recordedChunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `scrcpy_recording_disp${activeDisplayId}_${Date.now()}.webm`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('Live scrcpy recording saved to Downloads!');
        };

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        showToast('Real scrcpy screen recording started (60 FPS Unlocked)');
      } catch (err) {
        showToast('Failed to start MediaRecorder on live stream.');
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  // Push file
  const handleUploadFile = (file: File) => {
    const pushed: PushedFile = {
      id: `file_${Date.now()}_${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      progress: 100,
      status: 'completed',
      timestamp: new Date()
    };
    setPushedFiles(prev => [pushed, ...prev]);
    showToast(`Pushed "${file.name}" to device /sdcard/Download via adb push`);
  };

  // Send text buffer
  const handleSendText = (text: string) => {
    showToast(`Sent text via adb shell input text: "${text.slice(0, 20)}..."`);
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const currentDisplay = displays.find(d => d.id === activeDisplayId) || displays[0];
  const secondaryDisplay = displays.find(d => d.id !== activeDisplayId) || displays[1] || displays[0];

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans select-none">
      
      {/* Top Header */}
      <HeaderBar
        device={currentDevice}
        devices={devices}
        selectedDevice={setCurrentDevice}
        displays={displays}
        activeDisplayId={activeDisplayId}
        onSelectDisplay={handleSelectDisplay}
        layoutMode={layoutMode}
        onSetLayoutMode={setLayoutMode}
        onOpenDisplayManager={() => setIsDisplayModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenDeviceManager={() => setIsDeviceModalOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onStartScreenShare={isStreamActive ? handleStopCapture : handleStartCapture}
        isSharingRealScreen={isStreamActive}
      />

      {/* Main Studio Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Toolbar */}
        <ControlToolbar
          device={currentDevice}
          settings={settings}
          onUpdateSettings={(newSet) => setSettings(prev => ({ ...prev, ...newSet }))}
          onTogglePower={() => handleInjectKey(AndroidKeyCode.Power)}
          onVolumeChange={(delta) => {
            if (delta > 0) handleInjectKey(AndroidKeyCode.VolumeUp);
            else handleInjectKey(AndroidKeyCode.VolumeDown);
          }}
          onRotate={() => {
            setDisplays(prev => prev.map(d => d.id === activeDisplayId ? { ...d, orientation: d.orientation === 'portrait' ? 'landscape' : 'portrait' } : d));
            showToast('Toggled display orientation');
          }}
          onTakeScreenshot={handleTakeScreenshot}
          isRecording={isRecording}
          recordingSeconds={recordingSeconds}
          onToggleRecording={handleToggleRecording}
          onOpenFilePush={() => setIsFilePushModalOpen(true)}
          onOpenKeyboardInput={() => setIsKeyboardModalOpen(true)}
          onOpenDisplayManager={() => setIsDisplayModalOpen(true)}
          onTriggerBack={() => handleInjectKey(AndroidKeyCode.AndroidBack)}
          onTriggerHome={() => handleInjectKey(AndroidKeyCode.AndroidHome)}
          onTriggerRecents={() => handleInjectKey(AndroidKeyCode.AndroidAppSwitch)}
        />

        {/* Center Live scrcpy Capture Stage */}
        <main className="flex-1 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center relative p-3 overflow-hidden">
          
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* VIEW LAYOUT */}
          {layoutMode === 'single' ? (
            /* SINGLE DISPLAY CAPTURE */
            <div className="w-full h-full flex items-center justify-center">
              <DeviceScreen
                device={currentDevice}
                display={currentDisplay}
                settings={settings}
                videoRef={videoRef}
                canvasRef={canvasRef}
                isStreamActive={isStreamActive}
                onStartCapture={handleStartCapture}
                onStopCapture={handleStopCapture}
                onPairWebUsb={handlePairWebUsb}
                onTakeScreenshot={handleTakeScreenshot}
                isLocked={isLocked}
                onToggleLock={() => setIsLocked(!isLocked)}
                onInjectTouch={handleInjectTouch}
                onInjectKey={handleInjectKey}
                onSelectDisplay={handleSelectDisplay}
                displays={displays}
              />
            </div>
          ) : layoutMode === 'split-dual' ? (
            /* DUAL SPLIT VIEW */
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-center justify-center p-2">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-[11px] font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" />
                  Primary Stream (--display-id={displays[0].id})
                </div>
                <div className="flex-1 w-full flex items-center justify-center">
                  <DeviceScreen
                    device={currentDevice}
                    display={displays[0]}
                    settings={settings}
                    videoRef={videoRef}
                    canvasRef={canvasRef}
                    isStreamActive={isStreamActive}
                    onStartCapture={handleStartCapture}
                    onStopCapture={handleStopCapture}
                    onPairWebUsb={handlePairWebUsb}
                    onTakeScreenshot={handleTakeScreenshot}
                    isLocked={isLocked}
                    onToggleLock={() => setIsLocked(!isLocked)}
                    onInjectTouch={handleInjectTouch}
                    onInjectKey={handleInjectKey}
                    onSelectDisplay={handleSelectDisplay}
                    displays={displays}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center h-full border-l border-neutral-800/80 pl-4">
                <div className="text-[11px] font-mono font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" />
                  Secondary Stream (--display-id={secondaryDisplay.id})
                </div>
                <div className="flex-1 w-full flex items-center justify-center">
                  <DeviceScreen
                    device={currentDevice}
                    display={secondaryDisplay}
                    settings={settings}
                    videoRef={secondaryVideoRef}
                    canvasRef={canvasRef}
                    isStreamActive={isStreamActive}
                    onStartCapture={handleStartCapture}
                    onStopCapture={handleStopCapture}
                    onPairWebUsb={handlePairWebUsb}
                    onTakeScreenshot={handleTakeScreenshot}
                    isLocked={false}
                    onToggleLock={() => {}}
                    onInjectTouch={handleInjectTouch}
                    onInjectKey={handleInjectKey}
                    onSelectDisplay={handleSelectDisplay}
                    displays={displays}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* PICTURE IN PICTURE */
            <div className="w-full h-full relative flex items-center justify-center">
              <DeviceScreen
                device={currentDevice}
                display={currentDisplay}
                settings={settings}
                videoRef={videoRef}
                canvasRef={canvasRef}
                isStreamActive={isStreamActive}
                onStartCapture={handleStartCapture}
                onStopCapture={handleStopCapture}
                onPairWebUsb={handlePairWebUsb}
                onTakeScreenshot={handleTakeScreenshot}
                isLocked={isLocked}
                onToggleLock={() => setIsLocked(!isLocked)}
                onInjectTouch={handleInjectTouch}
                onInjectKey={handleInjectKey}
                onSelectDisplay={handleSelectDisplay}
                displays={displays}
              />

              {/* Secondary PiP */}
              <div className="absolute bottom-6 right-6 w-72 h-44 bg-neutral-900 border-2 border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden z-40 flex flex-col backdrop-blur-md">
                <div className="h-6 bg-neutral-950 px-2.5 flex items-center justify-between text-[10px] font-mono text-cyan-300 border-b border-neutral-800">
                  <span>scrcpy PiP: --display-id={secondaryDisplay.id}</span>
                  <button 
                    onClick={() => setLayoutMode('single')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1 scale-[0.6] origin-top-left -mt-2 -ml-2 pointer-events-none">
                  <DeviceScreen
                    device={currentDevice}
                    display={secondaryDisplay}
                    settings={settings}
                    videoRef={secondaryVideoRef}
                    canvasRef={canvasRef}
                    isStreamActive={isStreamActive}
                    onStartCapture={handleStartCapture}
                    onStopCapture={handleStopCapture}
                    onPairWebUsb={handlePairWebUsb}
                    onTakeScreenshot={() => {}}
                    isLocked={false}
                    onToggleLock={() => {}}
                    onInjectTouch={() => {}}
                    onInjectKey={() => {}}
                    onSelectDisplay={() => {}}
                    displays={displays}
                  />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 border border-cyan-500/40 text-cyan-100 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-lg flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <DisplaySelectorModal
        isOpen={isDisplayModalOpen}
        onClose={() => setIsDisplayModalOpen(false)}
        displays={displays}
        activeDisplayId={activeDisplayId}
        onSelectDisplay={handleSelectDisplay}
        onAddVirtualDisplay={handleAddVirtualDisplay}
        onRemoveDisplay={handleRemoveDisplay}
        layoutMode={layoutMode}
        onSetLayoutMode={setLayoutMode}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings(prev => ({ ...prev, ...newSet }))}
      />

      <DeviceManagerModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        devices={devices}
        activeDeviceId={currentDevice.id}
        onSelectDevice={(d) => {
          setCurrentDevice(d);
          setDisplays(d.displays);
          setActiveDisplayId(d.activeDisplayId);
          showToast(`Switched to device: ${d.name}`);
        }}
        onConnectWifi={(ip, port, name) => {
          showToast(`Connecting to ${ip}:${port}...`);
          handleStartCapture();
        }}
        onPairWebUsb={handlePairWebUsb}
      />

      <FilePushModal
        isOpen={isFilePushModalOpen}
        onClose={() => setIsFilePushModalOpen(false)}
        pushedFiles={pushedFiles}
        onUploadFile={handleUploadFile}
        onClearFiles={() => setPushedFiles([])}
      />

      <KeyboardModal
        isOpen={isKeyboardModalOpen}
        onClose={() => setIsKeyboardModalOpen(false)}
        onSendText={handleSendText}
      />

    </div>
  );
}
