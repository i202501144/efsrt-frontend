import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Key } from 'lucide-react';

interface ResetPasswordFormProps {
  onSubmit: (e: React.FormEvent) => void;
  code: string;
  setCode: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  onBackToLoginClick: () => void;
  simulatedCode?: string;
  loading: boolean;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  code,
  setCode,
  newPassword,
  setNewPassword,
  onBackToLoginClick,
  simulatedCode,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {simulatedCode && (
        <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-2xl text-center space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider">Código generado (Simulado):</p>
          <p className="text-2xl font-black tracking-widest text-blue-600">{simulatedCode}</p>
          <p className="text-[10px] text-blue-400">Usa este código para completar el formulario.</p>
        </div>
      )}
      <div className="space-y-1">
        <label className="text-sm font-bold text-slate-700 ml-1">Código de recuperación *</label>
        <div className="relative">
          <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Ingresa el código de 6 dígitos"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-bold text-slate-700 ml-1">Nueva Contraseña *</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 6 caracteres"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-sm"
      >
        {loading ? 'Cargando...' : 'Cambiar contraseña'}
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
