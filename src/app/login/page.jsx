"use client";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';


const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().min(4).required(),
});

export default function LoginPage() {
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values, {
        headers: {
          'Accept-Language': (typeof window !== 'undefined' ? localStorage.getItem('appLang') : null) || 'en',
        },
      });
      console.log(data);
      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user || null;
      if (!token) throw new Error('No token in response');
      login({ token, user });
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
          <input {...register('username')} placeholder="Username" className="w-full border rounded px-3 py-2" name='username' />
          {errors.username && <p className="text-red-600 text-sm">{errors.username.message}</p>}
        </div>
        <div>
          <input type="password" {...register('password')} placeholder="Password" className="w-full border rounded px-3 py-2" name='password' />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>
        <div className="pb-1">
            Do you have an account? <Link href="/register" className="underline underline-offset-1">{t('nav.register')}</Link>
        </div>
        <button disabled={isSubmitting} className="w-full bg-gray-900 text-white rounded px-3 py-2">Login</button>
      </form>
    </div>
  );
}
