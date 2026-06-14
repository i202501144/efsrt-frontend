import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar } from 'lucide-react';

interface WinnerCardProps {
  winner: {
    id: string;
    name: string;
    image: string;
    date: string;
    prize: string;
    method: string;
  };
  index: number;
}

export const WinnerCard: React.FC<WinnerCardProps> = ({ winner, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border-2 border-purple-100 rounded-[32px] p-6 hover:border-pink-300 transition-all group relative overflow-hidden shadow-lg shadow-purple-500/5"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-20 bg-yellow-500"></div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img src={winner.image} alt={winner.name} className="w-16 h-16 rounded-2xl object-cover border border-purple-100" />
          <div className="absolute -bottom-2 -right-2 bg-white border border-purple-100 p-1.5 rounded-lg shadow-sm">
            <Award className="w-4 h-4 text-yellow-500" />
          </div>
        </div>
        <div>
          <h3 className="font-extrabold text-purple-950 text-lg">{winner.name}</h3>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold">
            <Calendar className="w-3 h-3" /> {new Date(winner.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100">
          <p className="text-[10px] font-black text-pink-500 uppercase mb-1">Premio Mayor</p>
          <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">{winner.prize}</p>
        </div>
        <div className="text-[10px] font-black text-purple-400 uppercase italic">Vía {winner.method}</div>
      </div>
    </motion.div>
  );
};
