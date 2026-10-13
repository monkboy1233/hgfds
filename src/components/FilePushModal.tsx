import React, { useState } from 'react';
import { 
  X, 
  FolderUp, 
  File, 
  CheckCircle2, 
  Sparkles, 
  UploadCloud, 
  Trash2,
  HardDrive
} from 'lucide-react';
import { PushedFile } from '../types/vysor';

interface FilePushModalProps {
  isOpen: boolean;
  onClose: () => void;
  pushedFiles: PushedFile[];
  onUploadFile: (file: File) => void;
  onClearFiles: () => void;
}

export const FilePushModal: React.FC<FilePushModalProps> = ({
  isOpen,
  onClose,
  pushedFiles,
  onUploadFile,
  onClearFiles
}) => {
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => {
        onUploadFile(file);
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        onUploadFile(file);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FolderUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Push Files & APKs</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FREE PRO FEATURE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Drag and drop files to automatically send them to /sdcard/Download or install APKs.
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

        {/* Drag & Drop Zone */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              isDragging 
                ? 'border-cyan-400 bg-cyan-950/30 text-cyan-200' 
                : 'border-neutral-700 hover:border-neutral-600 bg-neutral-950/40 text-neutral-400'
            }`}
            onClick={() => document.getElementById('vysor-file-input')?.click()}
          >
            <input 
              id="vysor-file-input" 
              type="file" 
              multiple 
              onChange={handleFileInput} 
              className="hidden" 
            />
            <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-cyan-400 mb-3 shadow-lg">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm text-white">Drop files or click to upload</div>
            <div className="text-xs text-neutral-400 mt-1">
              Supports .apk, images, videos, logs, and zip archives
            </div>
          </div>

          {/* Transfers History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Device Storage Queue ({pushedFiles.length})
              </span>
              {pushedFiles.length > 0 && (
                <button
                  onClick={onClearFiles}
                  className="text-xs text-neutral-500 hover:text-red-400 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear List
                </button>
              )}
            </div>

            {pushedFiles.length === 0 ? (
              <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800 text-center text-xs text-neutral-500">
                No files transferred yet this session.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {pushedFiles.map((f) => (
                  <div 
                    key={f.id}
                    className="p-2.5 rounded-lg bg-neutral-800/50 border border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-medium text-white truncate max-w-[200px]">{f.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {(f.size / (1024 * 1024)).toFixed(2)} MB • {f.status}
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between text-xs">
          <span className="text-neutral-400 flex items-center gap-1.5 font-mono text-[11px]">
            <HardDrive className="w-3.5 h-3.5 text-neutral-500" />
            Destination: /sdcard/Download
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
