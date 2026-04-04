import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 glass border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center gap-3 z-[100] shadow-2xl shadow-emerald-500/20"
    >
      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      <span className="text-sm font-semibold text-emerald-50">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white/10 rounded-lg">
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </motion.div>
  );
}
