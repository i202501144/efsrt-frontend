import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Loader2 } from 'lucide-react';
import { raffleService } from '../services/raffleService';

const ActiveRaffles: React.FC = () => {
  const [raffles, setRaffles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const data = await raffleService.getRaffles();
        setRaffles(data);
      } catch (error) {
        console.error('Error fetching raffles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRaffles();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl py-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black text-white mb-2">Rifas Activas</h2>
          <p className="text-slate-400">Participa y gana premios increíbles todos los días.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {raffles.map((raffle) => (
          <motion.div
            key={raffle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-slate-900/50 border border-slate-800 rounded-[32px] overflow-hidden group transition-all hover:border-blue-500/30"
          >
            <div className="relative h-64 overflow-hidden bg-slate-800">
              <img 
                src={raffle.image || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800'} 
                alt={raffle.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  {raffle.status}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-blue-400" /> {new Date(raffle.drawDate).toLocaleDateString()}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                {raffle.title}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-slate-500">Tickets vendidos</span>
                  <span className="text-blue-400">{raffle._count?.tickets || 0}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: '20%' }} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Premio</p>
                  <p className="text-2xl font-black text-white">{raffle.prize}</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                  Participar <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {raffles.length === 0 && (
          <div className="col-span-full text-center py-20 bg-slate-900/30 rounded-[40px] border border-dashed border-slate-800">
            <p className="text-slate-500 font-bold text-xl">No hay rifas activas en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveRaffles;
