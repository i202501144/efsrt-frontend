import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginPageProps {
  onSuccess: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authService.login(email, password);
      } else {
        response = await authService.register(email, password, name);
      }
      onSuccess(response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4"
         style={{ backgroundImage: 'url(/images/login-bg.png)' }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] bg-[#121212] rounded-[30px] overflow-hidden shadow-2xl relative z-10 border border-white/5"
      >
        {/* Banner Image */}
        <div className="w-full h-48 overflow-hidden">
          <img src="/images/banner.png" alt="LuckyWave Banner" className="w-full h-full object-cover" />
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wider">
              {isLogin ? 'Bienvenido a LuckyWave' : 'Únete a LuckyWave'}
            </h2>
            <div className="h-1 w-12 bg-green-500 mx-auto rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-300 ml-1">Nombre Completo *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Ingresa tu nombre"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-300 ml-1">Correo electrónico *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  placeholder="Ingresa tu email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-300 ml-1">Contraseña *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-center">
                <button type="button" className="text-xs text-slate-500 hover:text-slate-300 underline">
                  Olvidé mi contraseña
                </button>
              </div>
            )}

            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              {loading ? 'Cargando...' : isLogin ? 'Ingresar' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-6">
            <p className="text-xs text-slate-500 uppercase font-bold">ó</p>
            
            <button className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
              Iniciar sesión con Google
            </button>

            <div className="text-center">
              <p className="text-sm text-slate-400">
                {isLogin ? '¿No eres suscriptor? ' : '¿Ya tienes cuenta? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-green-500 font-black hover:underline ml-1"
                >
                  {isLogin ? 'Suscríbete aquí' : 'Ingresa aquí'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
