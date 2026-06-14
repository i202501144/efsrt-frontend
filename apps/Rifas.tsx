import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { raffleService } from '../src/feature/raffles/services/raffleService';
import { userService } from '../src/feature/auth/services/userService';
import { authService } from '../src/feature/auth/services/authService';
import { SuccessModal } from '../src/feature/games/components/SuccessModal';
import { RaffleCard } from '../src/feature/raffles/components/RaffleCard';
import { useNavigate } from 'react-router-dom';

const ActiveRaffles: React.FC = () => {
  const [raffles, setRaffles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successData, setSuccessData] = useState({ title: '', message: '' });
  
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

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

  useEffect(() => {
    fetchRaffles();
  }, []);

  const handleParticipate = async (raffleId: string, raffleTitle: string) => {
    if (!user) return;
    setBuyingId(raffleId);
    try {
      const ticket = await userService.buyTicket(user.id, raffleId);
      // Recargar rifas para actualizar el contador de tickets vendidos
      await fetchRaffles();
      
      setSuccessData({
        title: '¡TICKET ADQUIRIDO!',
        message: `Felicidades, ya estás participando en "${raffleTitle}". Tu número de boleto es #LW-${ticket.number}.`
      });
      setSuccessOpen(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al comprar el ticket');
    } finally {
      setBuyingId(null);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    navigate('/tickets');
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl py-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-500 animate-spin-slow" /> RafflePass
          </h2>
          <p className="text-indigo-900/60 font-semibold">Participa y gana electrodomésticos y dispositivos tecnológicos todos los días.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {raffles.map((raffle) => (
          <RaffleCard
            key={raffle.id}
            raffle={raffle}
            buyingId={buyingId}
            onParticipate={handleParticipate}
          />
        ))}
        {raffles.length === 0 && (
          <div className="col-span-full text-center py-20 bg-purple-50/50 rounded-[40px] border-2 border-dashed border-purple-200">
            <p className="text-purple-950 font-black text-xl">No hay rifas activas en este momento.</p>
          </div>
        )}
      </div>

      <SuccessModal 
        isOpen={successOpen}
        onClose={handleCloseSuccess}
        title={successData.title}
        message={successData.message}
      />
    </div>
  );
};

export default ActiveRaffles;
export { ActiveRaffles };
