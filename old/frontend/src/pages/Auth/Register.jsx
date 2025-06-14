import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

const registerSchema = z.object({
    name: z.string().min(3, 'Mínimo 3 caracteres'),
                                email: z.string().email('Email inválido'),
                                password: z.string().min(6, 'Mínimo 6 caracteres'),
                                role: z.enum(['gestor', 'medico', 'tecnico']),
});

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        // Lógica de cadastro
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/20 relative overflow-hidden"
        >
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light" />

        <Link
        to="/login"
        className="absolute top-4 left-4 text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
        >
        <FiArrowLeft />
        Voltar
        </Link>

        <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        Criar Conta
        </h2>
        <p className="text-gray-300 mt-2">Junte-se à nossa plataforma</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo Nome */}
        <div className="relative">
        <FiUser className="absolute top-3 left-3 text-gray-400" />
        <input
        {...register('name')}
        placeholder="Nome completo"
        className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 text-gray-100 placeholder-gray-400"
        />
        {errors.name && (
            <span className="text-rose-400 text-sm block mt-1">
            {errors.name.message}
            </span>
        )}
        </div>

        {/* Restante dos campos similares ao Login */}

        <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
        >
        Criar Conta
        </motion.button>
        </form>
        </motion.div>
        </div>
    );
}
