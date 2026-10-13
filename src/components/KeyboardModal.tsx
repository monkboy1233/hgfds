import React, { useState } from 'react';
import { 
  X, 
  Keyboard, 
  Send, 
  Clipboard, 
  Check, 
  Sparkles,
  CornerDownLeft
} from 'lucide-react';

interface KeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendText: (text: string) => void;
}

export const KeyboardModal: React.FC<KeyboardModalProps> = ({
  isOpen,
  onClose,
  onSendText
}) => {
  const [text, setText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendText(text);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setText('');
    }, 800);
  };

  const handlePasteClipboard = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) {
        setText(clip);
      }
    } catch {
      // ignore clipboard permission error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Direct Keyboard & Input</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FREE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Type or paste text directly into the focused field on the device.
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

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-300">Input Buffer</label>
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Clipboard className="w-3.5 h-3.5" />
              Paste PC Clipboard
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type long passwords, URLs, or messages to inject instantly..."
            rows={4}
            className="w-full bg-neutral-800/80 rounded-xl p-3 border border-neutral-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500 resize-none"
            autoFocus
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-neutral-500">
              International characters & UTF-8 supported
            </span>
            <button
              type="submit"
              disabled={!text.trim()}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                sentSuccess 
                  ? 'bg-emerald-500 text-neutral-950' 
                  : text.trim() 
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950' 
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              {sentSuccess ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              {sentSuccess ? 'Injected!' : 'Send to Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
