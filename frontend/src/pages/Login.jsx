import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/login', data);
      localStorage.setItem('access_token', res.data.token);
      window.location.href = '/';
    } catch (error) {
      toast.error('Email ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl mb-4">Login</h1>
        <input
          {...register('email')}
          placeholder="Email"
          className="block w-full mb-4 p-2 border rounded"
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Senha"
          className="block w-full mb-4 p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
