import React, { useState } from 'react';
import { 
  Power, 
  Volume2, 
  VolumeX, 
  Volume1, 
  RotateCw, 
  Camera, 
  Video, 
  StopCircle, 
  FolderUp, 
  Keyboard, 
  Headphones, 
  Sliders, 
  Monitor, 
  ArrowLeft, 
  Circle, 
  Square,
  Sparkles,
  Download
} from 'lucide-react';
import { DeviceInfo, StreamSettings } from '../types/vysor';

interface ControlToolbarProps {
  device: DeviceInfo;
  settings: StreamSettings;
  onUpdateSettings: (newSettings: Partial<StreamSettings>) => void;
  onTogglePower: () => void;
  onVolumeChange: (delta: number) => void;
  onRotate: () => void;
  onTakeScreenshot: () => void;
  isRecording: boolean;
  recordingSeconds: number;
  onToggleRecording: () => void;
  onOpenFilePush: () => void;
  onOpenKeyboardInput: () => void;
  onOpenDisplayManager: () => void;
  onTriggerBack: () => void;
  onTriggerHome: () => void;
  onTriggerRecents: () => void;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  device,
  settings,
  onUpdateSettings,
  onTogglePower,
  onVolumeChange,
  onRotate,
  onTakeScreenshot,
  isRecording,
  recordingSeconds,
  onToggleRecording,
  onOpenFilePush,
  onOpenKeyboardInput,
  onOpenDisplayManager,
  onTriggerBack,
  onTriggerHome,
  onTriggerRecents
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <aside className="w-14 sm:w-16 bg-neutral-900/90 border-r border-neutral-800/80 backdrop-blur-md flex flex-col items-center justify-between py-3 z-20 select-none shadow-xl">
      {/* Top Section: Android Nav Quick Action */}
      <div className="flex flex-col items-center gap-1.5 w-full px-2">
        <button
          onClick={onTriggerBack}
          className="w-10 h-10 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-300 hover:text-white flex items-center justify-center transition-all group"
          title="Back (ESC / Backspace)"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={onTriggerHome}
          className="w-10 h-10 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-300 hover:text-white flex items-center justify-center transition-all group"
          title="Home (Home Key)"
        >
          <Circle className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={onTriggerRecents}
          className="w-10 h-10 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-300 hover:text-white flex items-center justify-center transition-all group"
          title="Recent Apps (App Switcher)"
        >
          <Square className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
        </button>

        <div className="w-8 h-px bg-neutral-800 my-1"></div>

        {/* Display Manager Trigger */}
        <button
          onClick={onOpenDisplayManager}
          className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-100 flex items-center justify-center transition-all shadow-sm"
          title="Select / Configure Displays"
        >
          <Monitor className="w-4 h-4" />
        </button>

        {/* Rotate Device */}
        <button
          onClick={onRotate}
          className="w-10 h-10 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-300 hover:text-white flex items-center justify-center transition-all group"
          title="Rotate Display Orientation"
        >
          <RotateCw className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* Middle: UNLOCKED PRO TOOLS (Screenshots, Recording, Files, Audio) */}
      <div className="flex flex-col items-center gap-1.5 w-full px-2">
        <div className="text-[8px] font-mono font-bold uppercase text-emerald-400/80 tracking-widest text-center">
          PRO FREE
        </div>

        {/* Screenshot */}
        <button
          onClick={onTakeScreenshot}
          className="w-10 h-10 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-300 hover:text-white flex items-center justify-center transition-all relative group"
          title="High-Res Screenshot (Pro feature free)"
        >
          <Camera className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Screen Record */}
        <button
          onClick={onToggleRecording}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative group ${
            isRecording 
              ? 'bg-red-500/30 border border-red-500 text-red-400 animate-pulse' 
              : 'bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-300 hover:text-white'
          }`}
          title={isRecording ? 'Stop Recording' : 'Screen Recorder (Pro feature free)'}
        >
          {isRecording ? (
            <StopCircle className="w-4 h-4 text-red-500" />
          ) : (
            <Video className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          )}
          {isRecording && (
            <span className="absolute -bottom-2 text-[8px] font-mono font-bold bg-red-600 text-white px-1 rounded-sm">
              {formatTime(recordingSeconds)}
            </span>
          )}
        </button>

        {/* Audio Mirroring Toggle */}
        <button
          onClick={() => onUpdateSettings({ audioMirroring: !settings.audioMirroring })}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            settings.audioMirroring 
              ? 'bg-purple-900/40 border border-purple-500/50 text-purple-300' 
              : 'bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-400 hover:text-white'
          }`}
          title={settings.audioMirroring ? 'Mute Audio Mirroring' : 'Audio Mirroring (Pro feature free)'}
        >
          <Headphones className="w-4 h-4" />
        </button>

        {/* File Push / Drag-Drop */}
        <button
          onClick={onOpenFilePush}
          className="w-10 h-10 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-300 hover:text-white flex items-center justify-center transition-all group"
          title="Push File or APK to Device (Pro feature free)"
        >
          <FolderUp className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Virtual Keyboard Input */}
        <button
          onClick={onOpenKeyboardInput}
          className="w-10 h-10 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-300 hover:text-white flex items-center justify-center transition-all group"
          title="Direct Keyboard & Clipboard Sync"
        >
          <Keyboard className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Bottom Section: Hardware & Power */}
      <div className="flex flex-col items-center gap-1.5 w-full px-2">
        {/* Volume controls */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onVolumeChange(10)}
            className="w-10 h-7 rounded-lg bg-neutral-800/50 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-xs transition-colors"
            title="Volume Up"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onVolumeChange(-10)}
            className="w-10 h-7 rounded-lg bg-neutral-800/50 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-xs transition-colors"
            title="Volume Down"
          >
            <Volume1 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Screen Lock / Power */}
        <button
          onClick={onTogglePower}
          className="w-10 h-10 rounded-xl bg-red-950/30 border border-red-500/20 hover:border-red-500/50 text-red-400 hover:text-red-300 flex items-center justify-center transition-all group"
          title="Wake / Sleep Device"
        >
          <Power className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </aside>
  );
};
