import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';

interface RouletteProps {
  options: string[];
  onFinish: (winner: string) => void;
}

export const Roulette: React.FC<RouletteProps> = ({ options, onFinish }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const controls = useAnimation();

  const handleSpinClick = () => {
    if (mustSpin) return;
    
    const newPrizeNumber = Math.floor(Math.random() * options.length);
    setMustSpin(true);

    const rotation = 360 * 5 + (360 - (newPrizeNumber * (360 / options.length)));
    
    controls.start({
      rotate: rotation,
      transition: { duration: 4, ease: "easeOut" }
    }).then(() => {
      setMustSpin(false);
      onFinish(options[newPrizeNumber]);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl border-2 border-purple-100 w-full max-w-[420px] shadow-purple-500/5">
      <h2 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 uppercase tracking-wide">
        Ruleta
      </h2>
      
      <div className="relative w-80 h-80 mb-10">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-8 h-10 bg-red-500 clip-path-triangle shadow-md border-2 border-white"></div>
        
        <motion.div
          animate={controls}
          className="w-full h-full rounded-full border-8 border-purple-50 shadow-xl overflow-hidden relative"
          style={{ 
            background: `conic-gradient(${options.map((_, i) => 
              `${i % 2 === 0 ? '#ec4899' : '#8b5cf6'} ${(i * 360) / options.length}deg ${((i + 1) * 360) / options.length}deg`
            ).join(', ')})`
          }}
        >
          {options.map((option, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-start justify-center pt-8 text-white font-black text-xs"
              style={{ transform: `translate(-50%, -50%) rotate(${(i * 360 / options.length) + (180 / options.length)}deg)` }}
            >
              <span>{option}</span>
            </div>
          ))}
        </motion.div>
        
        {/* Center Button */}
        <button
          onClick={handleSpinClick}
          disabled={mustSpin}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 text-white font-black shadow-xl border-4 border-white hover:scale-110 transition-transform active:scale-95 flex items-center justify-center ${mustSpin ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          GIRAR
        </button>
      </div>

      <div className="text-purple-400 text-center italic text-sm font-black">
        ¡Participa y gana al instante!
      </div>
    </div>
  );
};
