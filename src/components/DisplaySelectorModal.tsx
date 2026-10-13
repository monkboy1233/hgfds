import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  Plus, 
  Check, 
  Trash2, 
  Sliders, 
  Sparkles, 
  Tv, 
  Smartphone, 
  Layers,
  Columns,
  RefreshCw
} from 'lucide-react';
import { DeviceDisplay, ViewLayoutMode } from '../types/vysor';

interface DisplaySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  displays: DeviceDisplay[];
  activeDisplayId: number;
  onSelectDisplay: (id: number) => void;
  onAddVirtualDisplay: (display: Omit<DeviceDisplay, 'id'>) => void;
  onRemoveDisplay: (id: number) => void;
  layoutMode: ViewLayoutMode;
  onSetLayoutMode: (mode: ViewLayoutMode) => void;
}

export const DisplaySelectorModal: React.FC<DisplaySelectorModalProps> = ({
  isOpen,
  onClose,
  displays,
  activeDisplayId,
  onSelectDisplay,
  onAddVirtualDisplay,
  onRemoveDisplay,
  layoutMode,
  onSetLayoutMode
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('Virtual Workspace Display');
  const [newWidth, setNewWidth] = useState(1920);
  const [newHeight, setNewHeight] = useState(1080);
  const [newDpi, setNewDpi] = useState(320);
  const [newFps, setNewFps] = useState(60);
  const [newType, setNewType] = useState<'virtual' | 'desktop'>('virtual');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVirtualDisplay({
      name: newName,
      type: newType,
      width: Number(newWidth),
      height: Number(newHeight),
      densityDpi: Number(newDpi),
      refreshRate: Number(newFps),
      orientation: newWidth >= newHeight ? 'landscape' : 'portrait',
      isActive: true
    });
    setShowAddForm(false);
  };

  const applyPreset = (name: string, w: number, h: number, dpi: number, fps: number, type: 'virtual' | 'desktop') => {
    setNewName(name);
    setNewWidth(w);
    setNewHeight(h);
    setNewDpi(dpi);
    setNewFps(fps);
    setNewType(type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Multi-Display Selector</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  PRO FEATURE UNLOCKED (FREE)
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Switch between device screens, create virtual monitors, or view displays in dual-split mode.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Layout Mode Switcher */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
              Viewing Mode
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => onSetLayoutMode('single')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  layoutMode === 'single'
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-100 shadow-sm'
                    : 'bg-neutral-800/40 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <Monitor className="w-5 h-5 mb-2 text-cyan-400" />
                <div>
                  <div className="font-bold text-xs">Single Display</div>
                  <div className="text-[10px] text-neutral-400">Full focus on chosen display</div>
                </div>
              </button>

              <button
                onClick={() => onSetLayoutMode('split-dual')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  layoutMode === 'split-dual'
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-100 shadow-sm'
                    : 'bg-neutral-800/40 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <Columns className="w-5 h-5 mb-2 text-indigo-400" />
                <div>
                  <div className="font-bold text-xs">Dual Screen Split</div>
                  <div className="text-[10px] text-neutral-400">Display 0 & 1 side by side</div>
                </div>
              </button>

              <button
                onClick={() => onSetLayoutMode('pip')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  layoutMode === 'pip'
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-100 shadow-sm'
                    : 'bg-neutral-800/40 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <Layers className="w-5 h-5 mb-2 text-emerald-400" />
                <div>
                  <div className="font-bold text-xs">Picture-in-Picture</div>
                  <div className="text-[10px] text-neutral-400">Mini secondary floating overlay</div>
                </div>
              </button>
            </div>
          </div>

          {/* Connected Displays List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Attached Displays ({displays.length})
              </label>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Virtual Display
                </button>
              )}
            </div>

            <div className="space-y-2">
              {displays.map((disp) => {
                const isSelected = disp.id === activeDisplayId;
                return (
                  <div
                    key={disp.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-500/50 text-white shadow-sm'
                        : 'bg-neutral-800/50 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-neutral-800 text-neutral-400'}`}>
                        {disp.type === 'desktop' ? (
                          <Tv className="w-5 h-5" />
                        ) : disp.type === 'internal' ? (
                          <Smartphone className="w-5 h-5" />
                        ) : (
                          <Monitor className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-2">
                          <span>{disp.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                            ID #{disp.id}
                          </span>
                          {isSelected && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500 text-neutral-950">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 font-mono flex items-center gap-2 mt-0.5">
                          <span>{disp.width} × {disp.height}</span>
                          <span>•</span>
                          <span>{disp.densityDpi} DPI</span>
                          <span>•</span>
                          <span>{disp.refreshRate} Hz</span>
                          <span>•</span>
                          <span className="capitalize text-neutral-500">{disp.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectDisplay(disp.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                          isSelected
                            ? 'bg-cyan-500 text-neutral-950'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                        {isSelected ? 'Active' : 'Select'}
                      </button>

                      {disp.id > 1 && (
                        <button
                          onClick={() => onRemoveDisplay(disp.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-neutral-500 hover:text-red-400 transition-colors"
                          title="Remove Virtual Display"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Virtual Display Form */}
          {showAddForm && (
            <form onSubmit={handleCreate} className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Create Virtual Display</span>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="text-neutral-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Presets */}
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1.5">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    type="button" 
                    onClick={() => applyPreset('1080p FHD Monitor', 1920, 1080, 240, 60, 'virtual')}
                    className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 font-mono"
                  >
                    1080p (1920×1080)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => applyPreset('1440p QHD Workstation', 2560, 1440, 320, 60, 'desktop')}
                    className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 font-mono"
                  >
                    1440p (2560×1440)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => applyPreset('4K UHD Presentation', 3840, 2160, 480, 60, 'virtual')}
                    className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 font-mono"
                  >
                    4K (3840×2160)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => applyPreset('Ultrawide 21:9', 3440, 1440, 320, 120, 'desktop')}
                    className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 font-mono"
                  >
                    Ultrawide 120Hz
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Display Label</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="w-full bg-neutral-800 rounded-lg px-2.5 py-1.5 border border-neutral-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Mode Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-neutral-800 rounded-lg px-2.5 py-1.5 border border-neutral-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="virtual">Virtual Display (ADB Emulated)</option>
                    <option value="desktop">Desktop / DeX Workspace</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Resolution (Width × Height)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={newWidth}
                      onChange={(e) => setNewWidth(Number(e.target.value))}
                      className="w-full bg-neutral-800 rounded-lg px-2.5 py-1.5 border border-neutral-700 text-white font-mono"
                    />
                    <span className="text-neutral-500">×</span>
                    <input
                      type="number"
                      value={newHeight}
                      onChange={(e) => setNewHeight(Number(e.target.value))}
                      className="w-full bg-neutral-800 rounded-lg px-2.5 py-1.5 border border-neutral-700 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Density (DPI) & Refresh Rate</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newDpi}
                      onChange={(e) => setNewDpi(Number(e.target.value))}
                      className="w-1/2 bg-neutral-800 rounded-lg px-2.5 py-1.5 border border-neutral-700 text-white font-mono"
                      placeholder="DPI"
                    />
                    <select
                      value={newFps}
                      onChange={(e) => setNewFps(Number(e.target.value))}
                      className="w-1/2 bg-neutral-800 rounded-lg px-2.5 py-1.5 border border-neutral-700 text-white font-mono"
                    >
                      <option value="30">30 Hz</option>
                      <option value="60">60 Hz</option>
                      <option value="90">90 Hz</option>
                      <option value="120">120 Hz</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs"
                >
                  Create & Activate Display
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
