import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onForgotPasswordClick: () => void;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  onForgotPasswordClick,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="text-sm font-bold text-slate-700 ml-1">Correo electrónico *</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            placeholder="Ingresa tu email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-bold text-slate-700 ml-1">Contraseña *</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Ingresa tu contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="text-xs text-slate-500 hover:text-slate-700 underline"
        >
          Olvidé mi contraseña
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-sm"
      >
        {loading ? 'Cargando...' : 'Ingresar'}
      </button>
    </form>
  );
};
