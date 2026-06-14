import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Roulette } from '../src/feature/games/components/Roulette';
import { ScratchCard } from '../src/feature/games/components/ScratchCard';
import { SlotMachine } from '../src/feature/games/components/SlotMachine';
import { SuccessModal } from '../src/feature/games/components/SuccessModal';
import { SubscriptionModal } from '../src/feature/auth/components/SubscriptionModal';
import { authService } from '../src/feature/auth/services/authService';
import { userService } from '../src/feature/auth/services/userService';
import { Gamepad2, Eraser, RotateCw, Trophy, Star, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Minigames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'roulette' | 'scratch' | 'slots'>('roulette');
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '' });
  
  // Subscription states inside Minigames
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const user = authService.getCurrentUser();

  const handleWin = async (prize: string) => {
    setLastWin(prize);
    setModalData({
      title: '¡FELICIDADES!',
      message: `Has ganado: ${prize}. Tu premio ha sido registrado en tu cuenta.`
    });
    setIsModalOpen(true);

    // Guardar en el backend
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

  const handleConfirmSubscription = async () => {
    if (!user) return;
    setSubscribing(true);
    try {
      await userService.subscribe(user.id);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#db2777', '#8b5cf6', '#ffffff']
      });
      setIsSubModalOpen(false);
      
      // Mostrar modal de éxito
      setModalData({
        title: '¡Suscripción VIP Activa!',
        message: 'Felicidades, ahora tienes acceso completo e ilimitado a nuestros sorteos y juegos.'
      });
      setIsModalOpen(true);

      // Recargar la página después de un momento para actualizar la cabecera
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (error) {
      alert('Error al procesar la suscripción');
    } finally {
      setSubscribing(false);
    }
  };

  const options = ['📺 Smart TV 55"', '💻 MacBook Pro', '❄️ Refrigeradora', '📱 iPhone 15 Pro', '🧺 Lavadora', '🎮 PlayStation 5'];

  return (
    <div className="w-full max-w-6xl py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-2 flex items-center gap-3">
            <Gamepad2 className="w-10 h-10 text-fuchsia-600 animate-bounce" /> Zona de Juegos
          </h2>
          <p className="text-indigo-900/60 text-center md:text-left font-semibold">Pon a prueba tu suerte y gana premios directos.</p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-lg shadow-purple-500/5">
          <button
            onClick={() => setActiveGame('roulette')}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black transition-all ${
              activeGame === 'roulette' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-purple-400 hover:text-purple-700'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${activeGame === 'roulette' ? 'animate-spin-slow' : ''}`} /> Ruleta
          </button>
          <button
            onClick={() => setActiveGame('scratch')}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black transition-all ${
              activeGame === 'scratch' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-purple-400 hover:text-purple-700'
            }`}
          >
            <Eraser className="w-4 h-4" /> Raspa y Gana
          </button>
          <button
            onClick={() => setActiveGame('slots')}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black transition-all ${
              activeGame === 'slots' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' : 'text-purple-400 hover:text-purple-700'
            }`}
          >
            <Coins className="w-4 h-4" /> Tragamonedas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Game Area */}
        <div className="lg:col-span-2 bg-white border-2 border-purple-100 shadow-xl shadow-purple-500/5 rounded-[40px] p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

          <AnimatePresence mode="wait">
            {activeGame === 'roulette' && (
              <motion.div
                key="roulette"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full flex flex-col items-center z-10"
              >
                <Roulette options={options} onFinish={handleWin} />
              </motion.div>
            )}
            {activeGame === 'scratch' && (
              <motion.div
                key="scratch"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full flex flex-col items-center z-10"
              >
                <ScratchCard onComplete={handleWin} onSubscribeClick={() => setIsSubModalOpen(true)} />
              </motion.div>
            )}
            {activeGame === 'slots' && (
              <motion.div
                key="slots"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full flex flex-col items-center z-10"
              >
                <div className="mb-10 text-center">
                  <h3 className="text-2xl font-black text-purple-950 mb-2">Tragamonedas VIP</h3>
                  <p className="text-indigo-900/60 text-sm font-semibold">¡Consigue 3 símbolos iguales para ganar!</p>
                </div>
                <SlotMachine onWin={handleWin} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Last Win Card */}
          <div className="bg-white border-2 border-purple-100 rounded-3xl p-6 shadow-lg shadow-purple-500/5">
            <h4 className="text-xs font-black text-pink-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy className="w-3 h-3 text-pink-500" /> Última Ganancia
            </h4>
            {lastWin ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-2"
              >
                <p className="text-3xl font-black text-indigo-950">{lastWin}</p>
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Listo para reclamar
                </div>
              </motion.div>
            ) : (
              <p className="text-indigo-900/40 text-sm italic font-black">Aún no has jugado...</p>
            )}
          </div>

          {/* Stats/Promo Card */}
          <div className="bg-gradient-to-br from-fuchsia-600 via-pink-600 to-rose-500 rounded-3xl p-8 relative overflow-hidden group shadow-lg shadow-pink-500/20">
            <div className="relative z-10">
              <Star className="w-8 h-8 text-white/50 mb-4 animate-spin-slow" />
              <h4 className="text-xl font-black text-white mb-2 font-black">¿Quieres más oportunidades?</h4>
              <p className="text-pink-100 text-sm mb-6 font-semibold">Los suscriptores VIP reciben 5 raspaditas diarias gratis.</p>
              <button 
                onClick={() => setIsSubModalOpen(true)}
                className="bg-white text-pink-650 font-black px-6 py-2.5 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 shadow-md"
              >
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

      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onConfirm={handleConfirmSubscription}
        loading={subscribing}
        isLoggedIn={true}
      />
    </div>
  );
};
