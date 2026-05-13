import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RefreshCw } from 'lucide-react';

interface ScratchCardProps {
  prize: string;
  onComplete?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ prize, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 320;
    canvas.height = 180;

    // Fill with cover color
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some "scratch here" text
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillStyle = '#475569'; // slate-600
    ctx.textAlign = 'center';
    ctx.fillText('¡RASPA AQUÍ!', canvas.width / 2, canvas.height / 2 + 7);

    // Add some noise/texture
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
  }, []);

  const scratch = (e: any) => {
    if (!isDrawing || isScratched) return;
    if (e.cancelable) e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    // Soporte mejorado para Mouse y Touch
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    if (clientX === undefined || clientY === undefined) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparentPixels++;
    }

    const currentPercentage = (transparentPixels / (canvas.width * canvas.height)) * 100;
    setPercentage(Math.round(currentPercentage));

    if (currentPercentage > 30 && !isScratched) {
      setIsScratched(true);
      revealAll();
    }
  };

  const revealAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.8 }
    });
    if (onComplete) onComplete();
  };

  const reset = () => {
    setIsScratched(false);
    setPercentage(0);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';
    ctx.fillText('¡RASPA AQUÍ!', canvas.width / 2, canvas.height / 2 + 7);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-80 h-[180px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800">
        {/* Prize Layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase mb-2">Has ganado:</p>
          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {prize}
          </p>
        </div>

        {/* Scratch Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={(e) => { setIsDrawing(true); scratch(e); }}
          onMouseUp={() => setIsDrawing(false)}
          onMouseMove={scratch}
          onTouchStart={(e) => { setIsDrawing(true); scratch(e); }}
          onTouchEnd={() => setIsDrawing(false)}
          onTouchMove={scratch}
          className={`absolute inset-0 cursor-crosshair transition-opacity duration-500 ${isScratched ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            animate={{ width: `${percentage}%` }}
            className="h-full bg-blue-500"
          />
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {isScratched ? '¡Revelado!' : `Raspado: ${percentage}%`}
        </p>
        
        <button 
          onClick={reset}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Reiniciar Tarjeta
        </button>
      </div>
    </div>
  );
};
