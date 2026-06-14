import React, { useEffect, useState } from 'react';
import { Ticket as TicketIcon, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userService } from '../src/feature/auth/services/userService';
import { authService } from '../src/feature/auth/services/authService';
import { TicketCard } from '../src/feature/raffles/components/TicketCard';

export const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      try {
        const data = await userService.getUserTickets(user.id);
        setTickets(data || []);
      } catch (error) {
        console.error('Error fetching user tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 mb-2 flex items-center gap-3">
            <TicketIcon className="w-10 h-10 text-emerald-500" /> Mis Tickets
          </h2>
          <p className="text-indigo-900/60 font-semibold">Revisa tus participaciones y números de la suerte para los sorteos activos.</p>
        </div>
        
        {user?.isSubscriber && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2">
            <span>Suscripción Activa</span>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
          </div>
        )}
      </div>

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((ticket, idx) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              idx={idx}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-purple-200 shadow-sm max-w-2xl mx-auto flex flex-col items-center p-8">
          <TicketIcon className="w-16 h-16 text-purple-300 mb-6" />
          <h3 className="text-2xl font-black text-purple-950 mb-2">No tienes tickets todavía</h3>
          <p className="text-indigo-900/60 font-semibold mb-8 max-w-sm">
            Participa en nuestros sorteos activos para adquirir tus boletos de la suerte y ganar electrodomésticos y dispositivos tecnológicos.
          </p>
          <Link
            to="/rifas"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-650 hover:to-purple-650 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
          >
            Ver RafflePass <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
