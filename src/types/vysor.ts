export interface DeviceDisplay {
  id: number;
  name: string;
  type: 'internal' | 'external' | 'virtual' | 'foldable_cover' | 'desktop';
  width: number;
  height: number;
  densityDpi: number;
  refreshRate: number;
  orientation: 'portrait' | 'landscape';
  isActive: boolean;
  appRunning?: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  model: string;
  serial: string;
  connectionType: 'usb' | 'wifi' | 'webusb' | 'live_stream';
  ipAddress?: string;
  batteryLevel: number;
  isCharging: boolean;
  androidVersion: string;
  resolution: string;
  displays: DeviceDisplay[];
  activeDisplayId: number;
  isLocked: boolean;
  volume: number; // 0 to 100
  brightness: number; // 0 to 100
}

export interface StreamSettings {
  bitrateMbps: number; // 2, 4, 8, 16, 32, 48
  framerateFps: number; // 30, 60, 90, 120
  resolutionScale: number; // 0.5, 0.75, 1.0, 1.25, 1.5, 2.0
  videoCodec: 'H.264' | 'H.265 / HEVC' | 'AV1' | 'VP9';
  hardwareDecoder: boolean;
  audioMirroring: boolean;
  audioBitrateKbps: number;
  lowLatencyMode: boolean;
  dimDeviceScreen: boolean;
  keepDeviceAwake: boolean;
  frameStyle: 'pixel' | 'galaxy' | 'titanium' | 'minimal' | 'frameless';
}

export type ViewLayoutMode = 'single' | 'split-dual' | 'pip' | 'grid';

export interface PushedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  timestamp: Date;
}
