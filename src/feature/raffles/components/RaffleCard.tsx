import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Loader2 } from 'lucide-react';

interface RaffleCardProps {
  raffle: {
    id: string;
    title: string;
    image?: string;
    prize: string;
    status: string;
    drawDate: string;
    _count?: {
      tickets?: number;
    };
  };
  buyingId: string | null;
  onParticipate: (raffleId: string, raffleTitle: string) => void;
}

const getProductImage = (prize: string) => {
  const p = prize.toLowerCase();
  if (p.includes('tv') || p.includes('smart tv') || p.includes('televisor')) {
    return 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800'; // Smart TV
  }
  if (p.includes('macbook') || p.includes('laptop') || p.includes('m3') || p.includes('computadora')) {
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'; // MacBook
  }
  if (p.includes('refrigeradora') || p.includes('lg') || p.includes('refri') || p.includes('nevera')) {
    return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'; // LG Side-by-side
  }
  if (p.includes('iphone') || p.includes('celular') || p.includes('teléfono') || p.includes('apple')) {
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'; // iPhone
  }
  if (p.includes('lavadora') || p.includes('samsung') || p.includes('secadora')) {
    return 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=800'; // Washing machine
  }
  if (p.includes('playstation') || p.includes('ps5') || p.includes('consola') || p.includes('juego')) {
    return 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800'; // PS5
  }
  return 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800'; // default tech setup
};

export const RaffleCard: React.FC<RaffleCardProps> = ({
  raffle,
  buyingId,
  onParticipate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white border-2 border-purple-100 rounded-[32px] overflow-hidden group shadow-lg shadow-purple-500/5 transition-all hover:border-pink-300"
    >
      <div className="relative h-64 overflow-hidden bg-purple-50">
        <img 
          src={raffle.image || getProductImage(raffle.prize)} 
          alt={raffle.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
            {raffle.status}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-purple-700 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 border border-purple-100 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-pink-500 animate-pulse" /> {new Date(raffle.drawDate).toLocaleDateString()}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <h3 className="text-xl font-extrabold text-indigo-950 group-hover:text-pink-600 transition-colors">
          {raffle.title}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
            <span className="text-indigo-900/40">Tickets vendidos</span>
            <span className="text-purple-600 font-extrabold">{raffle._count?.tickets || 0}</span>
          </div>
          <div className="w-full h-2.5 bg-purple-50 rounded-full overflow-hidden border border-purple-100/50">
            <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" style={{ width: `${Math.min((raffle._count?.tickets || 0) * 5, 100)}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-purple-50">
          <div>
            <p className="text-[10px] font-black text-indigo-900/40 uppercase mb-1">Premio</p>
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{raffle.prize}</p>
          </div>
          <button 
            onClick={() => onParticipate(raffle.id, raffle.title)}
            disabled={buyingId === raffle.id}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-650 hover:to-purple-650 text-white px-6 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-purple-600/20 active:scale-95 disabled:opacity-50"
          >
            {buyingId === raffle.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Participar <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
