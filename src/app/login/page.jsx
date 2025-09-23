"use client";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      login({ token: data.token, user: data.user });
      toast.success('Logged in');
      window.location.href = '/dashboard';
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input {...register('email')} placeholder="Email" className="w-full border rounded px-3 py-2" />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <input type="password" {...register('password')} placeholder="Password" className="w-full border rounded px-3 py-2" />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>
        <button disabled={isSubmitting} className="w-full bg-gray-900 text-white rounded px-3 py-2">Login</button>
      </form>
    </div>
  );
}
