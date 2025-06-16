import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { FiGithub } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

const iconMap = {
  Google: FaGoogle,
  GitHub: FiGithub,
  Facebook: FaFacebook
};

function SocialButton({ icon, color }) {
  const Icon = iconMap[icon] || FiGithub;
  return (
    <motion.button
      whileHover={{ y: -2 }}
      className={`${color} p-3 rounded-lg text-white hover:bg-opacity-90 transition flex items-center justify-center`}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/login', data);
      const res = response.original || response; // compatibilidade

      if (res.success) {
        localStorage.setItem('access_token', res.data.token);
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
        toast.success(res.message || 'Login realizado com sucesso!');
        window.location.href = '/';
      } else {
        toast.error(res.message || 'Erro ao fazer login.');
      }
    } catch (err) {
      toast.error('Erro inesperado. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            AngolaViva
          </h1>
          <p className="text-gray-300">Sistema de Gestão Epidemiológica (Cólera)</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <FiMail className="absolute top-3 left-3 text-gray-400" />
              <input
                {...register('email')}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-white/5 rounded-lg border border-white/20 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition"
              />
              {errors.email && <p className="text-rose-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <FiLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type="password"
                {...register('password')}
                placeholder="Senha"
                className="w-full pl-10 pr-4 py-3 bg-white/5 rounded-lg border border-white/20 backdrop-blur-sm text-gray-100 placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition"
              />
              {errors.password && <p className="text-rose-400 text-sm mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0px 8px 20px rgba(6, 182, 212, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              'Entrar'
            )}
          </motion.button>
        </form>

        <div className="flex justify-center mt-6 space-x-4">
          <SocialButton icon="Google" color="bg-red-500" />
          <SocialButton icon="GitHub" color="bg-gray-800" />
          <SocialButton icon="Facebook" color="bg-blue-600" />
        </div>

        <div className="text-center mt-6">
          <Link to="/register" className="text-sm text-gray-300 hover:text-white transition">
            Não tem conta? <span className="underline">Cadastre-se</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
