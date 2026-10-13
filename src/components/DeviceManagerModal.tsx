import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Usb, 
  Wifi, 
  Plus, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Radio, 
  Battery, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { DeviceInfo } from '../types/vysor';

interface DeviceManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: DeviceInfo[];
  activeDeviceId: string;
  onSelectDevice: (device: DeviceInfo) => void;
  onConnectWifi: (ip: string, port: string, name: string) => void;
  onPairWebUsb: () => void;
}

export const DeviceManagerModal: React.FC<DeviceManagerModalProps> = ({
  isOpen,
  onClose,
  devices,
  activeDeviceId,
  onSelectDevice,
  onConnectWifi,
  onPairWebUsb
}) => {
  const [wifiIp, setWifiIp] = useState('192.168.1.145');
  const [wifiPort, setWifiPort] = useState('5555');
  const [deviceName, setDeviceName] = useState('My Wireless Device');
  const [isScanning, setIsScanning] = useState(false);
  const [tab, setTab] = useState<'devices' | 'wifi' | 'usb'>('devices');

  if (!isOpen) return null;

  const handleConnectWifi = (e: React.FormEvent) => {
    e.preventDefault();
    onConnectWifi(wifiIp, wifiPort, deviceName);
    setTab('devices');
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Device Connections</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  WIRELESS ADB FREE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Connect via USB cable or wireless local Wi-Fi without restrictions.
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

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 px-5 bg-neutral-950/30">
          <button
            onClick={() => setTab('devices')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              tab === 'devices'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Active Devices ({devices.length})
          </button>
          <button
            onClick={() => setTab('wifi')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === 'wifi'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            Connect via Wi-Fi ADB
          </button>
          <button
            onClick={() => setTab('usb')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === 'usb'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            WebUSB Pairing
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {tab === 'devices' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Select a device to mirror and control:</span>
                <button
                  onClick={handleScan}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  Scan Bus
                </button>
              </div>

              <div className="space-y-2">
                {devices.map((dev) => {
                  const isCurrent = dev.id === activeDeviceId;
                  return (
                    <div
                      key={dev.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-cyan-950/30 border-cyan-500/50 text-white'
                          : 'bg-neutral-800/40 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${isCurrent ? 'bg-cyan-500/20 text-cyan-300' : 'bg-neutral-800 text-neutral-400'}`}>
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm flex items-center gap-2">
                            <span>{dev.name}</span>
                            {dev.connectionType === 'wifi' ? (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                                <Wifi className="w-2.5 h-2.5" />
                                Wi-Fi Wireless
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 flex items-center gap-1">
                                <Usb className="w-2.5 h-2.5" />
                                USB 3.2
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-400 font-mono flex items-center gap-2 mt-0.5">
                            <span>{dev.model}</span>
                            <span>•</span>
                            <span>Android {dev.androidVersion}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Battery className="w-3 h-3 text-emerald-400" />
                              {dev.batteryLevel}%
                            </span>
                            <span>•</span>
                            <span>{dev.displays.length} Displays</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectDevice(dev);
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                          isCurrent
                            ? 'bg-cyan-500 text-neutral-950'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                        }`}
                      >
                        {isCurrent ? <Check className="w-3.5 h-3.5" /> : null}
                        {isCurrent ? 'Mirroring' : 'Switch Device'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'wifi' && (
            <form onSubmit={handleConnectWifi} className="space-y-4">
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Wireless ADB is 100% Free
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Ensure your phone has <strong>Wireless debugging</strong> turned on in Developer Options on the same Wi-Fi network.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Device Label</label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    required
                    className="w-full bg-neutral-800 rounded-lg px-3 py-2 border border-neutral-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-neutral-400 block mb-1">IP Address</label>
                    <input
                      type="text"
                      value={wifiIp}
                      onChange={(e) => setWifiIp(e.target.value)}
                      placeholder="192.168.1.xxx"
                      required
                      className="w-full bg-neutral-800 rounded-lg px-3 py-2 border border-neutral-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Port</label>
                    <input
                      type="text"
                      value={wifiPort}
                      onChange={(e) => setWifiPort(e.target.value)}
                      placeholder="5555"
                      required
                      className="w-full bg-neutral-800 rounded-lg px-3 py-2 border border-neutral-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Wifi className="w-4 h-4" />
                Connect Wireless Device
              </button>
            </form>
          )}

          {tab === 'usb' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <Usb className="w-4 h-4 text-cyan-400" />
                  Pair Physical Phone with WebUSB
                </div>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Plug your Android or iOS device into your computer with a USB cable. Enable <strong>USB Debugging</strong> on your phone.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onPairWebUsb}
                    className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Radio className="w-4 h-4" />
                    Open Browser USB Device Picker
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
