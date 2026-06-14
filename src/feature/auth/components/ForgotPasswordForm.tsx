import React from 'react';
import { Mail } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (val: string) => void;
  onBackToLoginClick: () => void;
  loading: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  email,
  setEmail,
  onBackToLoginClick,
  loading,
}) => {
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-sm"
      >
        {loading ? 'Cargando...' : 'Enviar código'}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onBackToLoginClick}
          className="text-sm text-green-600 font-black hover:underline"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </form>
  );
};
