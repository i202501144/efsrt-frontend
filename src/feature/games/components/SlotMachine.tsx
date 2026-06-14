import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Coins } from 'lucide-react';

const SYMBOLS = ['📺', '💻', '❄️', '📱', '🧺', '🎮', '🔊'];

export const SlotMachine: React.FC<{ onWin?: (prize: string) => void }> = ({ onWin }) => {
  const [reels, setReels] = useState(['📺', '📺', '📺']);
  const [spinning, setSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const controls = [useAnimation(), useAnimation(), useAnimation()];

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    
    const newCount = spinCount + 1;
    setSpinCount(newCount);

    let newReels;
    
    // Forzar victoria cada 5 intentos
    if (newCount >= 5) {
      const winningSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      newReels = [winningSymbol, winningSymbol, winningSymbol];
      setSpinCount(0); // Reiniciar contador
    } else {
      newReels = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ];
    }

    // Animación de cada rodillo
    const animations = controls.map((control, i) => {
      return control.start({
        y: [0, -100, 0],
        transition: { 
          duration: 1 + i * 0.5, 
          ease: "backInOut" 
        }
      });
    });

    await Promise.all(animations);
    setReels(newReels);
    setSpinning(false);

    // Verificar si ganó
    if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
      if (onWin) onWin(`Jackpot de ${newReels[0]}!`);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-[40px] border-4 border-purple-100 shadow-2xl shadow-purple-500/5">
      <div className="flex gap-4 mb-10 bg-purple-50/60 p-6 rounded-3xl border border-purple-100/50 shadow-inner">
        {reels.map((symbol, i) => (
          <div key={i} className="w-24 h-32 bg-gradient-to-b from-white to-purple-50 rounded-2xl flex items-center justify-center text-5xl shadow-md border border-purple-100/80 overflow-hidden">
            <motion.div animate={controls[i]}>
              {symbol}
            </motion.div>
          </div>
        ))}
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className={`group relative px-12 py-5 rounded-2xl font-black text-xl transition-all active:scale-95 ${
          spinning ? 'bg-purple-100 text-purple-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl shadow-pink-500/20 hover:from-pink-400 hover:to-purple-500'
        }`}
      >
        <div className="flex items-center gap-3">
          <Coins className={`w-6 h-6 ${spinning ? '' : 'group-hover:rotate-12 transition-transform'}`} />
          {spinning ? 'GIRANDO...' : '¡JUGAR!'}
        </div>
      </button>
      
      <p className="mt-6 text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">
        Consigue 3 iguales para ganar el Jackpot
      </p>
    </div>
  );
};
