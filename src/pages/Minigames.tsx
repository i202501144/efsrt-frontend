import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Roulette } from '../components/games/Roulette';
import { ScratchCard } from '../components/games/ScratchCard';
import { SlotMachine } from '../components/games/SlotMachine';
import { SuccessModal } from '../components/common/SuccessModal';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { Gamepad2, Eraser, RotateCw, Trophy, Star, Coins } from 'lucide-react';

export const Minigames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'roulette' | 'scratch' | 'slots'>('roulette');
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '' });

  const handleWin = async (prize: string) => {
    setLastWin(prize);
    setModalData({
      title: '¡FELICIDADES!',
      message: `Has ganado: ${prize}. Tu premio ha sido registrado en tu cuenta.`
    });
    setIsModalOpen(true);

    // Guardar en el backend
    const user = authService.getCurrentUser();
    if (user) {
      try {
        await userService.recordGameResult(
          user.id,
          activeGame.toUpperCase(),
          prize,
          true,
          prize
        );
      } catch (error) {
        console.error('Error recording win:', error);
      }
    }
  };

  const options = ['iPhone 15', 'PS5 Slim', 'RTX 4080', 'Suscripción Pro', '100 USD', 'Kit Gamer'];

  return (
    <div className="w-full max-w-6xl py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
            <Gamepad2 className="w-10 h-10 text-blue-500" /> Zona de Juegos
          </h2>
          <p className="text-slate-400 text-center md:text-left">Pon a prueba tu suerte y gana premios directos.</p>
        </div>

        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveGame('roulette')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeGame === 'roulette' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${activeGame === 'roulette' ? 'animate-spin-slow' : ''}`} /> Ruleta
          </button>
          <button
            onClick={() => setActiveGame('scratch')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeGame === 'scratch' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eraser className="w-4 h-4" /> Raspa y Gana
          </button>
          <button
            onClick={() => setActiveGame('slots')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeGame === 'slots' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" /> Tragamonedas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Game Area */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

          <AnimatePresence mode="wait">
            {activeGame === 'roulette' ? (
              <motion.div
                key="roulette"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full flex flex-col items-center"
              >
                <Roulette options={options} onFinish={handleWin} />
              </motion.div>
            ) : activeGame === 'scratch' ? (
              <motion.div
                key="scratch"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full flex flex-col items-center"
              >
                <div className="mb-10 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Tarjeta de la Suerte</h3>
                  <p className="text-slate-500 text-sm">¡Raspa más del 30% para revelar tu premio!</p>
                </div>
                <ScratchCard prize="PS5 Slim Edition" onComplete={() => handleWin('PS5 Slim Edition')} />
              </motion.div>
            ) : (
              <motion.div
                key="slots"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full flex flex-col items-center"
              >
                <div className="mb-10 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Tragamonedas VIP</h3>
                  <p className="text-slate-500 text-sm">¡Consigue 3 símbolos iguales para ganar!</p>
                </div>
                <SlotMachine onWin={handleWin} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Last Win Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy className="w-3 h-3 text-yellow-500" /> Última Ganancia
            </h4>
            {lastWin ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-2"
              >
                <p className="text-2xl font-black text-white">{lastWin}</p>
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Listo para reclamar
                </div>
              </motion.div>
            ) : (
              <p className="text-slate-500 text-sm italic">Aún no has jugado...</p>
            )}
          </div>

          {/* Stats/Promo Card */}
          <div className="bg-blue-600 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <Star className="w-8 h-8 text-white/50 mb-4" />
              <h4 className="text-xl font-black text-white mb-2">¿Quieres más oportunidades?</h4>
              <p className="text-blue-100 text-sm mb-6">Los suscriptores VIP reciben 5 raspaditas diarias gratis.</p>
              <button className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:scale-105 active:scale-95">
                Ver Planes VIP
              </button>
            </div>
            {/* Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        </div>
      </div>

      <SuccessModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalData.title}
        message={modalData.message}
      />
    </div>
  );
};
