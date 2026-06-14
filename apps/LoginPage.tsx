import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../src/feature/auth/services/authService';
import { SubscriptionModal } from '../src/feature/auth/components/SubscriptionModal';
import { LoginForm } from '../src/feature/auth/components/LoginForm';
import { RegisterForm } from '../src/feature/auth/components/RegisterForm';
import { ForgotPasswordForm } from '../src/feature/auth/components/ForgotPasswordForm';
import { ResetPasswordForm } from '../src/feature/auth/components/ResetPasswordForm';

interface LoginPageProps {
  onSuccess: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Recovery states
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await authService.login(email, password);
        onSuccess(response.user);
      } else if (mode === 'register') {
        const response = await authService.register(email, password, name);
        onSuccess(response.user);
      } else if (mode === 'forgot') {
        const response = await authService.forgotPassword(email);
        setSimulatedCode(response.code);
        setSuccessMessage('Se ha generado tu código de recuperación.');
        setMode('reset');
      } else if (mode === 'reset') {
        await authService.resetPassword(email, code, newPassword);
        setSuccessMessage('Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión.');
        setMode('login');
        // Clear recovery fields
        setCode('');
        setNewPassword('');
        setSimulatedCode('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Simulate Google auth by automatically registering/logging in a test google user
      const response = await authService.register(
        'googleuser@rafflepass.com',
        'google-pass-123456',
        'Usuario Google'
      ).catch(() => {
        // If already registered, log in
        return authService.login('googleuser@rafflepass.com', 'google-pass-123456');
      });
      
      setIsSubscriptionModalOpen(false);
      onSuccess(response.user);
    } catch (err: any) {
      setError('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Bienvenido a RafflePass';
      case 'register':
        return 'Únete a RafflePass';
      case 'forgot':
        return 'Recuperar Contraseña';
      case 'reset':
        return 'Nueva Contraseña';
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4"
         style={{ backgroundImage: 'url(/images/login-bg.jpg)' }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] bg-white rounded-[30px] overflow-hidden shadow-2xl relative z-10 border border-slate-100"
      >
        {/* Banner Image */}
        <div className="w-full h-48 overflow-hidden">
          <img src="/images/banner.jpg" alt="RafflePass Banner" className="w-full h-full object-cover" />
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-1 uppercase tracking-wider">
              {getTitle()}
            </h2>
            <div className="h-1 w-12 bg-green-500 mx-auto rounded-full"></div>
          </div>

          {successMessage && (
            <p className="text-green-600 text-sm font-bold text-center bg-green-50 border border-green-200 py-3 px-4 rounded-xl mb-6">
              {successMessage}
            </p>
          )}

          {error && (
            <p className="text-red-500 text-xs font-bold text-center bg-red-50 border border-red-200 py-3 px-4 rounded-xl mb-6">
              {error}
            </p>
          )}

          {mode === 'login' && (
            <LoginForm
              onSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onForgotPasswordClick={() => {
                setMode('forgot');
                setError('');
                setSuccessMessage('');
              }}
              loading={loading}
            />
          )}

          {mode === 'register' && (
            <RegisterForm
              onSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
              loading={loading}
            />
          )}

          {mode === 'forgot' && (
            <ForgotPasswordForm
              onSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              onBackToLoginClick={() => {
                setMode('login');
                setError('');
                setSuccessMessage('');
              }}
              loading={loading}
            />
          )}

          {mode === 'reset' && (
            <ResetPasswordForm
              onSubmit={handleSubmit}
              code={code}
              setCode={setCode}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              onBackToLoginClick={() => {
                setMode('login');
                setError('');
                setSuccessMessage('');
              }}
              simulatedCode={simulatedCode}
              loading={loading}
            />
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-6">
            {(mode === 'login' || mode === 'register') && (
              <>
                <p className="text-xs text-slate-400 uppercase font-bold">ó</p>
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
                  Iniciar sesión con Google
                </button>
              </>
            )}

            <div className="text-center">
              {mode === 'login' && (
                <p className="text-sm text-slate-500">
                  ¿No eres suscriptor?{' '}
                  <button
                    onClick={() => {
                      setIsSubscriptionModalOpen(true);
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-green-600 font-black hover:underline ml-1"
                  >
                    Suscríbete aquí
                  </button>
                </p>
              )}
              {mode === 'register' && (
                <p className="text-sm text-slate-500">
                  ¿Ya tienes cuenta?{' '}
                  <button
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-green-600 font-black hover:underline ml-1"
                  >
                    Ingresa aquí
                  </button>
                </p>
              )}

            </div>
          </div>
        </div>
      </motion.div>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onConfirm={() => {
          setIsSubscriptionModalOpen(false);
          setMode('register');
        }}
        loading={loading}
        isLoggedIn={false}
        onGoogleLogin={handleGoogleLogin}
      />
    </div>
  );
};
