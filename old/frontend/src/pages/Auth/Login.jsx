import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLogIn, FiMail, FiLock, FiGithub } from 'react-icons/fi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

// Esquema de validação com Zod
const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
});

// Mapeamento de ícones para os botões sociais
const iconMap = {
    Google: FaGoogle,
    GitHub: FiGithub,
    Facebook: FaFacebook,
};

// Componente SocialButton
function SocialButton({ icon, color }) {
    const Icon = iconMap[icon] || FiLogIn;

    return (
        <motion.button
            whileHover={{ y: -2 }}
            className={`${color} p-3 rounded-lg text-white hover:bg-opacity-90 transition-all flex items-center justify-center`}
        >
            <Icon className="w-5 h-5" />
        </motion.button>
    );
}

// Componente principal de login
export default function Login() {
    const [loading, setLoading] = useState(false); // Estado de loading

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setLoading(true); // Inicia o loading
        try {
            const response = await api.post('/login', data);

            if (response.data.original.token) {
                localStorage.setItem('access_token', response.data.original.token);
                toast.success('Login realizado com sucesso!');
                window.location.href = '/';
            } else {
                toast.error(response.data.original.message || 'Erro ao fazer login.');
            }
        } catch (error) {
            toast.error('Erro inesperado. Tente novamente.');
            console.error('Erro:', error);
        } finally {
            setLoading(false); // Finaliza o loading
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/20"
            >
                {/* Cabeçalho */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                        AngolaViva
                    </h1>
                    <p className="text-gray-300">Sistema de Gestão Epidemiológica</p>
		    <p className="text-gray-300">(Colera)</p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* Campo Email */}
                        <div className="relative">
                            <FiMail className="absolute top-3 left-3 text-gray-400" />
                            <input
                                {...register('email')}
                                placeholder="Email"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 text-gray-100 placeholder-gray-400"
                            />
                            {errors.email && (
                                <span className="text-rose-400 text-sm block mt-1">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        {/* Campo Senha */}
                        <div className="relative">
                            <FiLock className="absolute top-3 left-3 text-gray-400" />
                            <input
                                type="password"
                                {...register('password')}
                                placeholder="Senha"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 text-gray-100 placeholder-gray-400"
                            />
                            {errors.password && (
                                <span className="text-rose-400 text-sm block mt-1">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Botão de Login */}

		     <motion.div
  className="w-full py-3 rounded-xl font-semibold flex items-center justify-center transition-all duration-300"
>
  {loading ? (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Spinner branco com tamanho moderado */}
      <svg
        className="animate-spin h-10 w-10 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
    </div>
  ) : (
    <motion.button
      whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(6, 182, 212, 0.3)" }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={loading}
      className="bg-gradient-to-r from-cyan-500 to-blue-600 py-3 px-6 rounded-xl font-semibold text-white shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed w-full"
    >
      Entrar
    </motion.button>
  )}
</motion.div>
                </form>
            </motion.div>
        </div>
    );
}
