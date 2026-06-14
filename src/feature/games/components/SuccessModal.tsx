import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-white border-2 border-purple-100 rounded-3xl overflow-hidden shadow-2xl p-8 text-center shadow-purple-500/10"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-md shadow-emerald-500/5">
                <CheckCircle className="w-10 h-10 text-emerald-500 animate-pulse" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 mb-2">{title}</h2>
            <p className="text-indigo-900/60 font-semibold mb-8">{message}</p>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20 tracking-wider uppercase text-sm"
            >
              ¡Genial!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
