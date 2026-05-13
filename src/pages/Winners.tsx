import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Calendar, Gamepad2 } from 'lucide-react';
import { winnerService } from '../services/winnerService';

export const Winners: React.FC = () => {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const data = await winnerService.getWinners();
        setWinners(data || []);
      } catch (error) {
        console.error('Error fetching winners:', error);
        setWinners([]);
      }
      setLoading(false);
    };
    fetchWinners();
  }, []);

  if (loading) return <div className="text-center mt-20">Cargando ganadores...</div>;

  return (
    <div className="w-full max-w-6xl py-8">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/10 rounded-full mb-6 border border-yellow-500/20"
        >
          <Trophy className="w-10 h-10 text-yellow-500" />
        </motion.div>
        <h2 className="text-5xl font-black text-white mb-4">Salón de la Fama</h2>
        <p className="text-slate-400 text-lg">Nuestros afortunados ganadores de la comunidad LuckyWave.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {winners.filter(w => w.method === 'Rifa').map((winner, index) => (
          <motion.div
            key={winner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-20 bg-yellow-500`}></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img src={winner.image} alt={winner.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-800" />
                <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
                  <Award className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{winner.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Calendar className="w-3 h-3" /> {new Date(winner.date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Premio Mayor</p>
                <p className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">{winner.prize}</p>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase italic">Vía {winner.method}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mini-games Winners Table */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-8">
          <Gamepad2 className="w-6 h-6 text-blue-500" />
          <h3 className="text-2xl font-bold text-white">Ganadores de Minijuegos</h3>
        </div>
        
        <div className="bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Usuario</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Minijuego</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Premio</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {winners.filter(w => w.method !== 'Rifa').map((winner) => (
                <tr key={winner.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <img src={winner.image} className="w-10 h-10 rounded-full border border-slate-700" alt="" />
                      <span className="font-bold text-white">{winner.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-lg uppercase tracking-wider border border-blue-500/20">
                      {winner.method}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-slate-200 font-medium">{winner.prize}</span>
                  </td>
                  <td className="px-8 py-5 text-slate-500 text-sm">
                    {new Date(winner.date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-green-500 text-[10px] font-black uppercase flex items-center justify-end gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Entregado
                    </span>
                  </td>
                </tr>
              ))}
              {winners.filter(w => w.method !== 'Rifa').length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-slate-500 italic">
                    Esperando nuevos ganadores...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/5 rounded-[40px] p-12 flex flex-col md:flex-row justify-around items-center gap-8">
        <div className="text-center">
          <p className="text-4xl font-black text-white mb-2">+$50k</p>
          <p className="text-slate-400 text-sm uppercase font-bold tracking-widest">En Premios</p>
        </div>
        <div className="w-px h-12 bg-white/10 hidden md:block"></div>
        <div className="text-center">
          <p className="text-4xl font-black text-white mb-2">1.2k</p>
          <p className="text-slate-400 text-sm uppercase font-bold tracking-widest">Ganadores Reales</p>
        </div>
        <div className="w-px h-12 bg-white/10 hidden md:block"></div>
        <div className="text-center">
          <p className="text-4xl font-black text-white mb-2">100%</p>
          <p className="text-slate-400 text-sm uppercase font-bold tracking-widest">Entregas Garantizadas</p>
        </div>
      </div>
    </div>
  );
};
