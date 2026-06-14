import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Gamepad2 } from 'lucide-react';
import { winnerService } from '../src/feature/winners/services/winnerService';
import { WinnerCard } from '../src/feature/winners/components/WinnerCard';

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
          className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/10 rounded-full mb-6 border border-yellow-500/20 shadow-md shadow-yellow-500/10"
        >
          <Trophy className="w-10 h-10 text-yellow-500 animate-bounce" />
        </motion.div>
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 mb-4">Salón de la Fama</h2>
        <p className="text-indigo-900/60 text-lg font-semibold">Nuestros afortunados ganadores de la comunidad RafflePass.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {winners.filter(w => w.method === 'Rifa').map((winner, index) => (
          <WinnerCard
            key={winner.id}
            winner={winner}
            index={index}
          />
        ))}
      </div>

      {/* Mini-games Winners Table */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-8">
          <Gamepad2 className="w-6 h-6 text-fuchsia-500 animate-pulse" />
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Ganadores de Minijuegos</h3>
        </div>
        
        <div className="bg-white border-2 border-purple-100 rounded-[32px] overflow-hidden shadow-lg shadow-purple-500/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50/50 border-b border-purple-100">
                <th className="px-8 py-5 text-xs font-black text-purple-650 uppercase tracking-widest">Usuario</th>
                <th className="px-8 py-5 text-xs font-black text-purple-650 uppercase tracking-widest">Minijuego</th>
                <th className="px-8 py-5 text-xs font-black text-purple-650 uppercase tracking-widest">Premio</th>
                <th className="px-8 py-5 text-xs font-black text-purple-650 uppercase tracking-widest">Fecha</th>
                <th className="px-8 py-5 text-xs font-black text-purple-650 uppercase tracking-widest text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 text-slate-700">
              {winners.filter(w => w.method !== 'Rifa').map((winner) => (
                <tr key={winner.id} className="hover:bg-purple-50/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <img src={winner.image} className="w-10 h-10 rounded-full border border-purple-100" alt="" />
                      <span className="font-black text-purple-950">{winner.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-pink-500/10 text-pink-600 text-[10px] font-black rounded-lg uppercase tracking-wider border border-pink-500/20">
                      {winner.method}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-amber-600 font-black">{winner.prize}</span>
                  </td>
                  <td className="px-8 py-5 text-purple-400 text-sm font-semibold">
                    {new Date(winner.date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-emerald-500 text-[10px] font-black uppercase flex items-center justify-end gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Entregado
                    </span>
                  </td>
                </tr>
              ))}
              {winners.filter(w => w.method !== 'Rifa').length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-purple-400 italic font-semibold">
                    Esperando nuevos ganadores...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-20 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5 border-2 border-purple-100/50 rounded-[40px] p-12 flex flex-col md:flex-row justify-around items-center gap-8 shadow-lg shadow-purple-500/5">
        <div className="text-center">
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">+S/ 200k</p>
          <p className="text-indigo-900/60 text-sm uppercase font-black tracking-widest">En Premios</p>
        </div>
        <div className="w-px h-12 bg-purple-100 hidden md:block"></div>
        <div className="text-center">
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">1.2k</p>
          <p className="text-indigo-900/60 text-sm uppercase font-black tracking-widest">Ganadores Reales</p>
        </div>
        <div className="w-px h-12 bg-purple-100 hidden md:block"></div>
        <div className="text-center">
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-2">100%</p>
          <p className="text-indigo-900/60 text-sm uppercase font-black tracking-widest">Entregas Garantizadas</p>
        </div>
      </div>
    </div>
  );
};

export default Winners;
