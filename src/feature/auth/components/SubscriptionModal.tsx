import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Calendar, Users, CheckCircle2 } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  isLoggedIn: boolean;
  onGoogleLogin?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  isLoggedIn,
  onGoogleLogin,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-[450px] bg-white rounded-[30px] overflow-hidden shadow-2xl relative z-10 border-2 border-purple-100 shadow-purple-500/10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-purple-400 hover:text-purple-700 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Image */}
            <div className="w-full h-44 overflow-hidden relative">
              <img src="/images/banner.jpg" alt="RafflePass Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
            </div>

            <div className="p-8 pt-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 bg-yellow-500/20 text-yellow-600 text-xs font-black px-3 py-1 rounded-full border border-yellow-500/30 uppercase tracking-wider mb-2 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-current" /> RIFAS SUSCRIPCIÓN
                </div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">¡PARTICIPA Y GANA CADA MES!</h2>
                <p className="text-indigo-900/60 text-sm mt-1 font-semibold">Activa tu cuenta y disfruta tus premios</p>
              </div>

              {/* Price Card */}
              <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5 mb-6 text-center space-y-2 shadow-sm">
                <p className="text-purple-500 text-xs font-black uppercase tracking-wider">Tu Suscripción Activa</p>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">S/ 39.90<span className="text-sm text-purple-400 font-bold"> / mes</span></p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-indigo-950 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Acceso a 4 sorteos mensuales exclusivos</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-indigo-950 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Créditos diarios para la Ruleta y Slots</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-indigo-950 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Premios (electrodomésticos y dinero en efectivo)</span>
                </div>
              </div>

              {/* Action Button */}
              {isLoggedIn ? (
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-sm"
                >
                  {loading ? 'Procesando...' : 'Pagar Suscripción'}
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={onGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 font-black py-4 rounded-2xl transition-all shadow-md active:scale-95"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
                    Registrarse con Google
                  </button>
                  <button
                    onClick={onConfirm}
                    className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-black py-4 rounded-2xl transition-all active:scale-95 text-sm uppercase tracking-wider border border-purple-200"
                  >
                    Crear cuenta con Email
                  </button>
                </div>
              )}

              {/* Info Footer */}
              <div className="mt-6 pt-4 border-t border-purple-100 flex justify-around text-indigo-900/60 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-pink-500" /> Sorteos: 4 / 4
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-500" /> Participantes: 2.5K
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
