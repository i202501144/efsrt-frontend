import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

interface ScratchCardProps {
  prize?: string; // Mantener por compatibilidad con firmas
  onComplete?: (winningPrize: string) => void;
  onSubscribeClick?: () => void;
}

const OPTIONS = [
  { name: 'Smart TV 55"', display: '📺 Smart TV' },
  { name: 'MacBook Pro', display: '💻 MacBook' },
  { name: 'Refrigeradora', display: '❄️ Refri' },
  { name: 'iPhone 15 Pro', display: '📱 iPhone 15' },
  { name: 'Lavadora', display: '🧺 Lavadora' },
  { name: 'PlayStation 5', display: '🎮 PS5' },
];

interface SingleScratchBoxProps {
  prizeDisplay: string;
  isRevealed: boolean;
  onReveal: () => void;
}

const SingleScratchBox: React.FC<SingleScratchBoxProps> = ({
  prizeDisplay,
  isRevealed,
  onReveal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const onRevealCalledRef = useRef(false);

  useEffect(() => {
    if (!isRevealed) {
      onRevealCalledRef.current = false;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 110;
    canvas.height = 110;

    // Fill with cover color (Light violet-200)
    ctx.fillStyle = '#ddd6fe'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add "?" in vibrant purple
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillStyle = '#7c3aed'; 
    ctx.textAlign = 'center';
    ctx.fillText('?', canvas.width / 2, canvas.height / 2 + 12);

    // Add some noise texture
    for (let i = 0; i < 150; i++) {
      ctx.fillStyle = `rgba(139, 92, 246, ${Math.random() * 0.15})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
  }, [isRevealed, prizeDisplay]);

  const scratch = (e: any) => {
    if (isRevealed) return;
    if (e.cancelable) e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    if (clientX === undefined || clientY === undefined) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Trigger reveal instantly on the very first click/stroke!
    if (!onRevealCalledRef.current) {
      onRevealCalledRef.current = true;
      console.log(`[SingleScratchBox] First scratch stroke detected. Revealing card instantly!`);
      onReveal();
    }
  };

  const emoji = prizeDisplay.split(' ')[0];
  const name = prizeDisplay.split(' ').slice(1).join(' ');

  return (
    <div className="relative w-[110px] h-[110px] bg-gradient-to-br from-white to-purple-50 rounded-2xl overflow-hidden shadow-md border-2 border-purple-100 flex items-center justify-center text-center p-2 select-none">
      {/* Prize Layer */}
      <div className="flex flex-col items-center justify-center">
        <span className="text-3xl mb-1">{emoji}</span>
        <span className="text-[10px] font-black text-purple-750 uppercase leading-none">
          {name}
        </span>
      </div>

      {/* Canvas Cover */}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          onMouseDown={(e) => { isDrawingRef.current = true; scratch(e); }}
          onMouseUp={() => { isDrawingRef.current = false; }}
          onMouseMove={(e) => { if (isDrawingRef.current) scratch(e); }}
          onMouseLeave={() => { isDrawingRef.current = false; }}
          onTouchStart={(e) => { isDrawingRef.current = true; scratch(e); }}
          onTouchEnd={() => { isDrawingRef.current = false; }}
          onTouchMove={(e) => { if (isDrawingRef.current) scratch(e); }}
          className="absolute inset-0 cursor-crosshair transition-opacity duration-300"
        />
      )}
    </div>
  );
};

export const ScratchCard: React.FC<ScratchCardProps> = ({ onComplete, onSubscribeClick }) => {
  const [cards, setCards] = useState<any[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [winningPrize, setWinningPrize] = useState<string | null>(null);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [scratchedCount, setScratchedCount] = useState<number>(0);

  // Refs para sincronizar el estado instantáneamente y evitar problemas de batching en eventos rápidos de mouse
  const scratchedCountRef = useRef(0);
  const targetPrizeRef = useRef<string | null>(null);
  const gameStatusRef = useRef<'playing' | 'won' | 'lost'>('playing');
  const revealedCardIdsRef = useRef<Set<number>>(new Set());

  const generateCards = () => {
    const isWinner = Math.random() < 0.5; // 50% de probabilidad de ganar
    let selectedPrizes: any[] = [];

    if (isWinner) {
      const winner = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
      selectedPrizes = [winner, winner, winner];

      while (selectedPrizes.length < 6) {
        const randomPrize = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
        if (randomPrize.name !== winner.name) {
          selectedPrizes.push(randomPrize);
        }
      }
    } else {
      // Perdedor: Distribuir de modo que ninguno se repita 3 veces
      const counts: Record<string, number> = {};
      while (selectedPrizes.length < 6) {
        const randomPrize = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
        const currentCount = counts[randomPrize.name] || 0;
        if (currentCount < 2) {
          selectedPrizes.push(randomPrize);
          counts[randomPrize.name] = currentCount + 1;
        }
      }
    }

    // Mezclar
    const shuffled = selectedPrizes
      .map((p) => ({ p, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.p);

    return shuffled.map((p, idx) => ({
      id: idx,
      prizeName: p.name,
      prizeDisplay: p.display,
      isRevealed: false,
    }));
  };

  useEffect(() => {
    setCards(generateCards());
  }, []);

  const handleRevealCard = (id: number) => {
    console.log(`[ScratchCard] handleRevealCard triggered for card ID: ${id}`);
    if (gameStatusRef.current !== 'playing') {
      console.log(`[ScratchCard] Game status is not playing (current status: ${gameStatusRef.current}). Returning early.`);
      return;
    }

    if (revealedCardIdsRef.current.has(id)) {
      console.log(`[ScratchCard] Card with ID ${id} already processed in revealedCardIdsRef. Returning early.`);
      return;
    }
    revealedCardIdsRef.current.add(id);

    // Verificar si esta carta ya fue revelada en la UI
    const card = cards.find((c) => c.id === id);
    if (!card) {
      console.log(`[ScratchCard] Card with ID ${id} not found in cards!`);
      return;
    }
    if (card.isRevealed) {
      console.log(`[ScratchCard] Card with ID ${id} was already marked as isRevealed in cards state!`);
      return;
    }

    console.log(`[ScratchCard] Card matches check passed. Card prize: ${card.prizeName}`);

    // Marcar la carta como revelada en la UI
    setCards((prevCards) =>
      prevCards.map((c) => (c.id === id ? { ...c, isRevealed: true } : c))
    );

    // Incrementar la cuenta instantánea en Ref
    scratchedCountRef.current += 1;
    const currentCount = scratchedCountRef.current;
    setScratchedCount(currentCount);
    console.log(`[ScratchCard] scratchedCountRef.current incremented to: ${currentCount}`);

    if (currentCount === 1) {
      targetPrizeRef.current = card.prizeName;
      console.log(`[ScratchCard] First card scratched. targetPrizeRef.current set to: ${card.prizeName}`);
    } else if (currentCount === 2) {
      console.log(`[ScratchCard] Second card scratched. Comparing ${card.prizeName} with target ${targetPrizeRef.current}`);
      if (card.prizeName === targetPrizeRef.current) {
        console.log(`[ScratchCard] Match on second! Continuing play.`);
        // Coinciden en el segundo! Continúa jugando
      } else {
        console.log(`[ScratchCard] No match on second! Game lost.`);
        // Diferentes en el segundo! Pierde de inmediato
        gameStatusRef.current = 'lost';
        setGameStatus('lost');
        setCards((prevCards) => prevCards.map((c) => ({ ...c, isRevealed: true })));
        setTimeout(() => {
          console.log(`[ScratchCard] Showing lose modal (after 200ms)`);
          setShowLoseModal(true);
        }, 200);
      }
    } else if (currentCount === 3) {
      console.log(`[ScratchCard] Third card scratched. Comparing ${card.prizeName} with target ${targetPrizeRef.current}`);
      if (card.prizeName === targetPrizeRef.current) {
        console.log(`[ScratchCard] Match on third! Game won.`);
        // ¡Ganó! Consiguió 3 iguales en total
        gameStatusRef.current = 'won';
        setGameStatus('won');
        setWinningPrize(targetPrizeRef.current);
        setCards((prevCards) => prevCards.map((c) => ({ ...c, isRevealed: true })));
        
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.8 },
        });

        if (onComplete && targetPrizeRef.current) {
          onComplete(targetPrizeRef.current);
        }
      } else {
        console.log(`[ScratchCard] No match on third! Game lost.`);
        // Diferente en el tercero! Pierde de inmediato
        gameStatusRef.current = 'lost';
        setGameStatus('lost');
        setCards((prevCards) => prevCards.map((c) => ({ ...c, isRevealed: true })));
        setTimeout(() => {
          console.log(`[ScratchCard] Showing lose modal (after 200ms)`);
          setShowLoseModal(true);
        }, 200);
      }
    }
  };

  const handleReset = () => {
    setCards(generateCards());
    setGameStatus('playing');
    setWinningPrize(null);
    setShowLoseModal(false);
    setScratchedCount(0);

    // Resetear refs mutables
    scratchedCountRef.current = 0;
    targetPrizeRef.current = null;
    gameStatusRef.current = 'playing';
    revealedCardIdsRef.current.clear();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 gap-4 max-w-[360px] mx-auto p-4 bg-purple-50/50 rounded-3xl border-2 border-purple-100 shadow-inner">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <SingleScratchBox
              prizeDisplay={card.prizeDisplay}
              isRevealed={card.isRevealed}
              onReveal={() => handleRevealCard(card.id)}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        {gameStatus === 'playing' && (
          <div className="flex items-center gap-2 text-purple-600 text-xs font-black uppercase tracking-wider bg-purple-50 px-4 py-2 rounded-full border border-purple-150 shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-purple-500" /> 
            {scratchedCount === 0 && 'Raspa tu primera casilla'}
            {scratchedCount === 1 && 'Busca la pareja'}
            {scratchedCount === 2 && '¡Consigue el trío ganador!'}
          </div>
        )}

        {gameStatus === 'won' && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-6 py-3 rounded-2xl shadow-md flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500 animate-spin-slow" />
            <span className="font-black text-sm uppercase">¡HAS GANADO: {winningPrize}!</span>
          </div>
        )}

        {gameStatus === 'lost' && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 px-6 py-3 rounded-2xl shadow-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span className="font-black text-sm uppercase">¡Intento Fallido!</span>
          </div>
        )}

        <button 
          onClick={handleReset}
          className="flex items-center gap-2 bg-purple-100 hover:bg-purple-250 text-purple-700 font-black px-6 py-3.5 rounded-2xl transition-all shadow-md hover:scale-105 active:scale-95 text-xs border border-purple-200"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Volver a Jugar
        </button>
      </div>

      <AnimatePresence>
        {showLoseModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white border-2 border-purple-100 rounded-[32px] overflow-hidden shadow-2xl p-8 text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 shadow-md">
                  <AlertCircle className="w-10 h-10 text-rose-500 animate-bounce" />
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 mb-2">
                ¡No hubo suerte!
              </h2>
              <p className="text-indigo-900/60 font-semibold mb-8 text-sm">
                No has conseguido 3 premios iguales en esta raspadita. Espera a tu siguiente oportunidad diaria o suscríbete para obtener intentos y beneficios VIP ilimitados.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowLoseModal(false);
                    if (onSubscribeClick) onSubscribeClick();
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-650 hover:to-purple-650 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-purple-500/20 tracking-wider uppercase text-xs"
                >
                  Suscribirse / Ser VIP
                </button>
                <button
                  onClick={() => setShowLoseModal(false)}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-black py-3.5 rounded-2xl transition-all active:scale-95 text-xs border border-purple-200"
                >
                  Esperar Siguiente Oportunidad
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
