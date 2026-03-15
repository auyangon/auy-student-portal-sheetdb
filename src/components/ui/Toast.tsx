import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface ToastProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type: 'success' | 'error';
}

export default function Toast({ open, onClose, message, type }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 40 }}
          className="fixed bottom-6 left-1/2 z-50 w-[92vw] max-w-[420px] -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-[20px] border border-white/60 bg-white/85 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${type === 'success' ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'bg-red-100 text-red-600'}`}>
              {type === 'success' ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              )}
            </div>
            <div className="text-sm">
              <div className="font-[600] tracking-[-0.01em] text-zinc-900">{message}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
