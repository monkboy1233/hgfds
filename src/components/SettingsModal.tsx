import React from 'react';
import { 
  X, 
  Sparkles, 
  Video, 
  Cpu, 
  Headphones, 
  Zap, 
  Sliders, 
  ShieldCheck, 
  Smartphone,
  EyeOff,
  Flame,
  Check
} from 'lucide-react';
import { StreamSettings } from '../types/vysor';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StreamSettings;
  onUpdateSettings: (newSettings: Partial<StreamSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Stream & Engine Settings</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  ALL FEATURES UNLOCKED FREE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Premium restrictions and licensing checks permanently bypassed.
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

        {/* Settings Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Video Stream Quality (Formerly Pro) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bitrate (Video Quality)</span>
              </label>
              <span className="font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                {settings.bitrateMbps} Mbps (Ultra High)
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[4, 8, 16, 32, 48].map((bitrate) => (
                <button
                  key={bitrate}
                  onClick={() => onUpdateSettings({ bitrateMbps: bitrate })}
                  className={`py-2 px-1 rounded-lg border text-center font-mono font-bold transition-all ${
                    settings.bitrateMbps === bitrate
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                      : 'bg-neutral-800/40 border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  {bitrate} Mbps
                </button>
              ))}
            </div>
            <p className="text-[10px] text-neutral-500">
              Free users were previously locked to 2 Mbps. Now set up to 48 Mbps for uncompressed visual clarity.
            </p>
          </div>

          <div className="w-full h-px bg-neutral-800"></div>

          {/* Framerate & Refresh Rate (Formerly Pro) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Framerate (FPS)</span>
              </label>
              <span className="font-mono text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                {settings.framerateFps} FPS
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[30, 60, 90, 120].map((fps) => (
                <button
                  key={fps}
                  onClick={() => onUpdateSettings({ framerateFps: fps })}
                  className={`py-2 px-1 rounded-lg border text-center font-mono font-bold transition-all ${
                    settings.framerateFps === fps
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                      : 'bg-neutral-800/40 border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  {fps} FPS
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-neutral-800"></div>

          {/* Video Codec & Hardware Acceleration */}
          <div className="space-y-3">
            <label className="font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Video Decoder & Hardware Acceleration</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {(['H.264', 'H.265 / HEVC', 'AV1', 'VP9'] as const).map((codec) => (
                <button
                  key={codec}
                  onClick={() => onUpdateSettings({ videoCodec: codec })}
                  className={`p-2.5 rounded-lg border text-left font-mono transition-all flex items-center justify-between ${
                    settings.videoCodec === codec
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                      : 'bg-neutral-800/40 border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>{codec}</span>
                  {settings.videoCodec === codec && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/40 border border-neutral-800 cursor-pointer hover:bg-neutral-800/60 transition-colors">
              <div>
                <div className="font-semibold text-white">GPU Hardware Acceleration</div>
                <div className="text-[10px] text-neutral-400">Uses WebCodecs & GPU decoders for &lt;15ms latency</div>
              </div>
              <input
                type="checkbox"
                checked={settings.hardwareDecoder}
                onChange={(e) => onUpdateSettings({ hardwareDecoder: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 bg-neutral-700 border-neutral-600 focus:ring-0"
              />
            </label>
          </div>

          <div className="w-full h-px bg-neutral-800"></div>

          {/* Audio Mirroring & Screen Dimming */}
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/40 border border-neutral-800 cursor-pointer hover:bg-neutral-800/60 transition-colors">
              <div className="flex items-center gap-2.5">
                <Headphones className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="font-semibold text-white">Audio Mirroring</div>
                  <div className="text-[10px] text-neutral-400">Low-latency stereo PCM audio forwarded to desktop</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.audioMirroring}
                onChange={(e) => onUpdateSettings({ audioMirroring: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 bg-neutral-700 border-neutral-600 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/40 border border-neutral-800 cursor-pointer hover:bg-neutral-800/60 transition-colors">
              <div className="flex items-center gap-2.5">
                <EyeOff className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Dim Phone Screen</div>
                  <div className="text-[10px] text-neutral-400">Turns down physical screen brightness while mirroring</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.dimDeviceScreen}
                onChange={(e) => onUpdateSettings({ dimDeviceScreen: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 bg-neutral-700 border-neutral-600 focus:ring-0"
              />
            </label>
          </div>

          <div className="w-full h-px bg-neutral-800"></div>

          {/* Frame Style */}
          <div className="space-y-2">
            <label className="font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Device Bezel Frame Style</span>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'titanium', label: 'Titanium' },
                { id: 'pixel', label: 'Pixel' },
                { id: 'galaxy', label: 'Galaxy' },
                { id: 'frameless', label: 'Frameless' }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => onUpdateSettings({ frameStyle: style.id as any })}
                  className={`py-2 px-1 rounded-lg border text-center transition-all ${
                    settings.frameStyle === style.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-neutral-800/40 border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
          <span className="text-[11px] text-emerald-400 font-mono font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Lifetime Pro Status Active
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
