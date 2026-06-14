import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Roulette } from './feature/games/components/Roulette'
import { SuccessModal } from './feature/games/components/SuccessModal'
import { LoginPage } from '../apps/LoginPage'
import { SubscriptionModal } from './feature/auth/components/SubscriptionModal'
import Rifas from '../apps/Rifas'
import { Minigames } from '../apps/Minigames'
import { authService } from './feature/auth/services/authService'
import { userService } from './feature/auth/services/userService'
import { Winners } from '../apps/Winners'
import { MyTickets } from '../apps/MyTickets'
import { Trophy, Users, Bell, LogOut, Star, Home as HomeIcon, LayoutGrid, Ticket as TicketIcon, Award, Gamepad2 } from 'lucide-react'
import confetti from 'canvas-confetti'

function AppContent() {
  const [winner, setWinner] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [successData, setSuccessData] = useState({ title: '', message: '' })
  const [subscribing, setSubscribing] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const location = useLocation();
  const options = ['📺 Smart TV 55"', '💻 MacBook Pro', '❄️ Refrigeradora', '📱 iPhone 15 Pro', '🧺 Lavadora', '🎮 PlayStation 5']

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) setUser(currentUser)
    setIsLoaded(true)
  }, [])

  if (!isLoaded) return null;

  if (!user) {
    return <LoginPage onSuccess={(u) => setUser(u)} />
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
  }

  const handleSubscribe = () => {
    if (user.isSubscriber) {
      setSuccessData({ title: '¡Ya eres VIP!', message: 'Tu suscripción está activa y lista para ganar.' })
      setIsSuccessModalOpen(true)
      return
    }
    setIsSubscriptionModalOpen(true)
  }

  const confirmSubscription = async () => {
    setSubscribing(true)
    try {
      const response = await userService.subscribe(user.id)
      setUser(response.user)
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#db2777', '#8b5cf6', '#ffffff']
      })
      setIsSubscriptionModalOpen(false)
      setSuccessData({ 
        title: '¡Suscripción Exitosa!', 
        message: 'Felicidades, ahora eres parte de la comunidad RafflePass.' 
      })
      setIsSuccessModalOpen(true)
    } catch (error) {
      alert('Error al procesar la suscripción')
    } finally {
      setSubscribing(false)
    }
  }

  const navItems = [
    { name: 'Inicio', path: '/', icon: HomeIcon },
    { name: 'RafflePass', path: '/rifas', icon: LayoutGrid },
    { name: 'Minijuegos', path: '/juegos', icon: Gamepad2 },
    { name: 'Mis Tickets', path: '/tickets', icon: TicketIcon },
    { name: 'Ganadores', path: '/ganadores', icon: Award },
  ];

  const handleGameWin = async (prize: string) => {
    setWinner(prize);
    
    // Guardar en el backend
    if (user) {
      try {
        await userService.recordGameResult(
          user.id,
          'ROULETTE',
          prize,
          true,
          prize
        );
      } catch (error) {
        console.error('Error recording home win:', error);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 flex flex-col items-center p-6 font-sans">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-12 bg-white px-6 py-4 rounded-3xl shadow-lg shadow-purple-500/5 border border-purple-100/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Trophy className="text-white w-6 h-6 animate-pulse" />
          </div>
          <Link to="/" className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">RAFFLEPASS</Link>
        </div>
        
        <nav className="flex gap-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            const activeColors: Record<string, string> = {
              '/': 'text-pink-600 border-pink-500/30 bg-pink-50/50',
              '/rifas': 'text-amber-600 border-amber-500/30 bg-amber-50/50',
              '/juegos': 'text-purple-600 border-purple-500/30 bg-purple-50/50',
              '/tickets': 'text-emerald-650 border-emerald-500/30 bg-emerald-50/50',
              '/ganadores': 'text-yellow-600 border-yellow-500/30 bg-yellow-50/50',
            };
            
            const hoverColors: Record<string, string> = {
              '/': 'hover:text-pink-650 hover:bg-pink-50/20',
              '/rifas': 'hover:text-amber-650 hover:bg-amber-50/20',
              '/juegos': 'hover:text-purple-650 hover:bg-purple-50/20',
              '/tickets': 'hover:text-emerald-650 hover:bg-emerald-50/20',
              '/ganadores': 'hover:text-yellow-650 hover:bg-yellow-50/20',
            };

            const itemActiveColor = activeColors[item.path] || 'text-purple-600 border-purple-500/30 bg-purple-50/50';
            const itemHoverColor = hoverColors[item.path] || 'hover:text-purple-650 hover:bg-purple-50/20';

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-black px-4 py-2.5 rounded-2xl transition-all border border-transparent ${
                  isActive ? `${itemActiveColor} shadow-sm` : `text-slate-500 ${itemHoverColor}`
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2.5 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-purple-50/80 border border-purple-100/70 rounded-full px-4.5 py-2">
              <div className="w-6.5 h-6.5 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-black text-purple-950">{user.name}</span>
              {user.isSubscriber && (
                <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-600 text-[10px] font-black px-2.5 py-1 rounded-full border border-yellow-500/30 uppercase tracking-tighter">
                  <Star className="w-2.5 h-2.5 fill-current text-yellow-500" /> VIP
                </span>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 text-purple-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={
          <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-650 text-xs font-black uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                Sorteo en vivo ahora
              </div>
              <h2 className="text-5xl lg:text-6xl font-black leading-tight text-slate-900">
                Gana premios <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500">
                  increíbles hoy.
                </span>
              </h2>
              <p className="text-lg text-indigo-950 font-bold max-w-lg opacity-80">
                Suscríbete y participa en nuestros sorteos diarios. Ruletas, slots y más juegos interactivos para nuestra comunidad.
              </p>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-purple-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  {user?.isSubscriber ? '¡Ya eres VIP!' : subscribing ? 'Procesando...' : 'Comprar Tickets / Suscribirse'}
                </button>
                <Link to="/rifas" className="bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-xl font-bold transition-all text-center flex items-center justify-center shadow-sm">
                  Ver RafflePass
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-black text-pink-600 flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-500" /> 15k+
                  </span>
                  <span className="text-xs text-indigo-900/60 uppercase font-black">Suscriptores</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-black text-purple-600 flex items-center gap-2">
                    <TicketIcon className="w-5 h-5 text-purple-500" /> 50k+
                  </span>
                  <span className="text-xs text-indigo-900/60 uppercase font-black">Tickets Vendidos</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-black text-amber-600 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" /> 200+
                  </span>
                  <span className="text-xs text-indigo-900/60 uppercase font-black">Premios Entregados</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <Roulette options={options} onFinish={handleGameWin} />
              {winner && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center shadow-md shadow-emerald-500/5"
                >
                  <p className="text-emerald-600 font-bold text-lg">¡Felicidades! Has ganado:</p>
                  <p className="text-3xl font-black text-indigo-950">{winner}</p>
                </motion.div>
              )}
            </div>
          </main>
        } />
        <Route path="/rifas" element={<Rifas />} />
        <Route path="/juegos" element={<Minigames />} />
        <Route path="/tickets" element={<MyTickets />} />
        <Route path="/ganadores" element={<Winners />} />
      </Routes>

      {/* Footer Decoration */}
      <footer className="mt-24 w-full border-t border-purple-100/50 pt-8 text-center text-purple-400 text-sm font-semibold">
        &copy; 2024 RafflePass System. Todos los derechos reservados.
      </footer>

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successData.title}
        message={successData.message}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onConfirm={confirmSubscription}
        loading={subscribing}
        isLoggedIn={true}
      />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
