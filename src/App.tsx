import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Roulette } from './modules/games/components/Roulette'
import { SuccessModal } from './modules/games/components/SuccessModal'
import { LoginPage } from './modules/auth/pages/LoginPage'
import Rifas from './modules/raffles/pages/Rifas'
import { Minigames } from './modules/games/pages/Minigames'
import { authService } from './modules/auth/services/authService'
import { userService } from './modules/auth/services/userService'
import { Winners } from './modules/winners/pages/Winners'
import { Trophy, Users, Bell, LogOut, Star, Home as HomeIcon, LayoutGrid, Ticket as TicketIcon, Award, Gamepad2 } from 'lucide-react'
import confetti from 'canvas-confetti'

function AppContent() {
  const [winner, setWinner] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successData, setSuccessData] = useState({ title: '', message: '' })
  const [subscribing, setSubscribing] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const location = useLocation();
  const options = ['iPhone 15', 'PS5 Slim', 'RTX 4080', 'Suscripción Pro', '100 USD', 'Kit Gamer']

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

  const handleSubscribe = async () => {
    if (user.isSubscriber) {
      setSuccessData({ title: '¡Ya eres VIP!', message: 'Tu suscripción está activa y lista para ganar.' })
      setIsSuccessModalOpen(true)
      return
    }

    setSubscribing(true)
    try {
      const response = await userService.subscribe(user.id)
      setUser(response.user)
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#3b82f6', '#8b5cf6', '#ffffff']
      })
      setSuccessData({ 
        title: '¡Suscripción Exitosa!', 
        message: 'Felicidades, ahora eres parte de la comunidad LuckyWave.' 
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
    { name: 'Rifas Activas', path: '/rifas', icon: LayoutGrid },
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
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center p-6 font-sans">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Trophy className="text-white w-6 h-6" />
          </div>
          <Link to="/" className="text-2xl font-bold tracking-tight">LUCKY<span className="text-blue-500">WAVE</span></Link>
        </div>
        
        <nav className="flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                location.pathname === item.path ? 'text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-semibold">{user.name}</span>
              {user.isSubscriber && (
                <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-yellow-500/30 uppercase tracking-tighter">
                  <Star className="w-2.5 h-2.5 fill-current" /> Suscriptor
                </span>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Sorteo en vivo ahora
              </div>
              <h2 className="text-5xl lg:text-6xl font-black leading-tight">
                Gana premios <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  increíbles hoy.
                </span>
              </h2>
              <p className="text-lg text-slate-400 max-w-lg">
                Suscríbete y participa en nuestros sorteos diarios. Ruletas, slots y más juegos interactivos para nuestra comunidad.
              </p>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  {user?.isSubscriber ? '¡Ya eres Suscriptor!' : subscribing ? 'Procesando...' : 'Comprar Tickets / Suscribirse'}
                </button>
                <Link to="/rifas" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold transition-all text-center flex items-center justify-center">
                  Ver Rifas Activas
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" /> 15k+
                  </span>
                  <span className="text-xs text-slate-500 uppercase font-bold">Suscriptores</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-white flex items-center gap-2">
                    <TicketIcon className="w-5 h-5 text-purple-500" /> 50k+
                  </span>
                  <span className="text-xs text-slate-500 uppercase font-bold">Tickets Vendidos</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-pink-500" /> 200+
                  </span>
                  <span className="text-xs text-slate-500 uppercase font-bold">Premios Entregados</span>
                </div>
              </div>
            </div>

  return (
...
            <div className="flex flex-col items-center">
              <Roulette options={options} onFinish={handleGameWin} />
              {winner && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-center"
                >
                  <p className="text-green-400 font-bold text-lg">¡Felicidades! Has ganado:</p>
                  <p className="text-3xl font-black text-white">{winner}</p>
                </motion.div>
              )}
            </div>
          </main>
        } />
        <Route path="/rifas" element={<Rifas />} />
        <Route path="/juegos" element={<Minigames />} />
        <Route path="/tickets" element={<div className="text-center mt-20 text-slate-400">Sección de Mis Tickets en desarrollo...</div>} />
        <Route path="/ganadores" element={<Winners />} />
      </Routes>

      {/* Footer Decoration */}
      <footer className="mt-24 w-full border-t border-slate-900 pt-8 text-center text-slate-600 text-sm">
        &copy; 2024 LuckyWave System. Todos los derechos reservados.
      </footer>

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successData.title}
        message={successData.message}
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
