import React from 'react';
import { 
  Monitor, 
  Smartphone, 
  Wifi, 
  Usb, 
  Sparkles, 
  Settings, 
  Maximize2, 
  Minimize2, 
  Columns, 
  Layers, 
  Plus, 
  ChevronDown,
  Cast
} from 'lucide-react';
import { DeviceInfo, DeviceDisplay, ViewLayoutMode } from '../types/vysor';

interface HeaderBarProps {
  device: DeviceInfo;
  devices: DeviceInfo[];
  selectedDevice: (device: DeviceInfo) => void;
  displays: DeviceDisplay[];
  activeDisplayId: number;
  onSelectDisplay: (id: number) => void;
  layoutMode: ViewLayoutMode;
  onSetLayoutMode: (mode: ViewLayoutMode) => void;
  onOpenDisplayManager: () => void;
  onOpenSettings: () => void;
  onOpenDeviceManager: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onStartScreenShare: () => void;
  isSharingRealScreen: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  device,
  displays,
  activeDisplayId,
  onSelectDisplay,
  layoutMode,
  onSetLayoutMode,
  onOpenDisplayManager,
  onOpenSettings,
  onOpenDeviceManager,
  isFullscreen,
  onToggleFullscreen,
  onStartScreenShare,
  isSharingRealScreen
}) => {
  const [showDisplayDropdown, setShowDisplayDropdown] = React.useState(false);
  const activeDisplay = displays.find(d => d.id === activeDisplayId) || displays[0];

  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & All Features Free Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-200">
                VYSO
              </span>
              <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-emerald-300" />
                ALL FEATURES FREE
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 -mt-0.5 font-mono">
              v4.8 • Unlimited Mirroring & Multi-Display
            </p>
          </div>
        </div>

        {/* Device Status Tag */}
        <button 
          onClick={onOpenDeviceManager}
          className="ml-2 hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 transition-colors text-xs text-neutral-200 group"
        >
          {device.connectionType === 'wifi' ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Usb className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span className="font-medium group-hover:text-white">{device.name}</span>
          <span className="text-[10px] px-1 py-0.2 bg-neutral-700/60 rounded text-neutral-400 font-mono">
            {device.batteryLevel}%
          </span>
          <ChevronDown className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300" />
        </button>
      </div>

      {/* Center: DISPLAY SELECTOR (Highlighted feature) */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowDisplayDropdown(!showDisplayDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 text-xs text-cyan-100 font-medium transition-all shadow-sm shadow-cyan-950/50"
            title="Switch Active Display"
          >
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 text-[11px]">Display:</span>
              <span className="text-cyan-200 font-semibold">{activeDisplay?.name || 'Primary'}</span>
              <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-900/40 px-1 rounded">
                #{activeDisplayId}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 ml-1" />
          </button>

          {/* Dropdown Menu */}
          {showDisplayDropdown && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl py-2 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowDisplayDropdown(false)}
            >
              <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-1">
                <span>Available Displays ({displays.length})</span>
                <span className="text-emerald-400 text-[9px] font-mono">PRO UNLOCKED</span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-0.5 px-1">
                {displays.map((disp) => {
                  const isSelected = disp.id === activeDisplayId;
                  return (
                    <button
                      key={disp.id}
                      onClick={() => {
                        onSelectDisplay(disp.id);
                        setShowDisplayDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isSelected 
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30' 
                          : 'hover:bg-neutral-800/80 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Monitor className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-neutral-500'}`} />
                        <div>
                          <div className="font-medium text-xs flex items-center gap-1.5">
                            {disp.name}
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {disp.width}×{disp.height} • {disp.refreshRate}Hz • {disp.type}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        Disp #{disp.id}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-1.5 mt-1 border-t border-neutral-800 px-2">
                <button
                  onClick={() => {
                    setShowDisplayDropdown(false);
                    onOpenDisplayManager();
                  }}
                  className="w-full py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700/80 text-cyan-300 text-xs flex items-center justify-center gap-1.5 font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Virtual / Custom Display
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Layout Selector (Single, Dual Split, PiP) */}
        <div className="hidden md:flex items-center bg-neutral-800/80 border border-neutral-700/60 rounded-lg p-0.5 text-xs text-neutral-300">
          <button
            onClick={() => onSetLayoutMode('single')}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
              layoutMode === 'single' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'hover:text-white'
            }`}
            title="Single Screen Focus"
          >
            <Monitor className="w-3 h-3" />
            <span className="text-[11px]">Single</span>
          </button>
          <button
            onClick={() => onSetLayoutMode('split-dual')}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
              layoutMode === 'split-dual' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'hover:text-white'
            }`}
            title="Dual Displays Side-by-Side"
          >
            <Columns className="w-3 h-3" />
            <span className="text-[11px]">Dual Split</span>
          </button>
          <button
            onClick={() => onSetLayoutMode('pip')}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
              layoutMode === 'pip' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'hover:text-white'
            }`}
            title="Picture-in-Picture Secondary Display"
          >
            <Layers className="w-3 h-3" />
            <span className="text-[11px]">PiP</span>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5">
        {/* Real Screen Mirror Trigger */}
        <button
          onClick={onStartScreenShare}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isSharingRealScreen 
              ? 'bg-red-500/20 border-red-500/50 text-red-200' 
              : 'bg-neutral-800/70 border-neutral-700/60 hover:bg-neutral-800 text-neutral-300'
          }`}
          title="Stream your real screen or phone via browser screen capture"
        >
          <Cast className={`w-3.5 h-3.5 ${isSharingRealScreen ? 'text-red-400 animate-pulse' : 'text-neutral-400'}`} />
          <span className="hidden sm:inline">
            {isSharingRealScreen ? 'Live Mirroring' : 'Cast Real Screen'}
          </span>
        </button>

        {/* Pro Settings (Unlocked) */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 transition-colors"
          title="Video, Audio & Pro Settings (All Free)"
        >
          <Settings className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Display (Pro feature free)'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
