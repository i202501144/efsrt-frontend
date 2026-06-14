import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar } from 'lucide-react';

interface TicketCardProps {
  ticket: {
    id: string;
    createdAt: string;
    number: string;
    raffle?: {
      title: string;
      prize: string;
      drawDate: string;
    };
  };
  idx: number;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, idx }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ y: -5 }}
      className="bg-white border-2 border-emerald-100 rounded-[32px] overflow-hidden shadow-lg shadow-emerald-500/5 relative group"
    >
      {/* Decorative top border */}
      <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
      
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Boleto Digital
            </span>
          </div>
          <span className="text-xs font-bold text-indigo-900/40">
            {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Ticket ID Display */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-2xl p-5 border border-emerald-100/50 text-center">
          <p className="text-indigo-900/50 text-[10px] font-black uppercase tracking-widest mb-1">Tu Número de la Suerte</p>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 tracking-wider">
            #LW-{ticket.number}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-extrabold text-indigo-950 text-lg group-hover:text-emerald-600 transition-colors">
            {ticket.raffle?.title}
          </h3>
          
          <div className="flex items-center gap-2 text-indigo-900/60 text-xs font-bold">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Premio: <span className="text-indigo-950 font-black">{ticket.raffle?.prize}</span></span>
          </div>

          <div className="flex items-center gap-2 text-indigo-900/60 text-xs font-bold">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>Sorteo: <span className="text-indigo-950 font-black">{new Date(ticket.raffle?.drawDate).toLocaleDateString()}</span></span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Activo en Sorteo
          </span>
          
          <span className="text-xs font-bold text-indigo-900/30 uppercase">
            ID: {ticket.id.substring(0, 8)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
