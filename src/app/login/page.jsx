"use client";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Box, TextField, Button, Typography, Stack, InputAdornment } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from 'next/link';


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
      const token = data?.data?.token || data?.token;
      // Build user object from response if not nested inside data.user
      let user = data?.data?.user || data?.user || null;
      if (!user) {
        const src = data?.data || data || {};
        const username = src.username ?? null;
        const email = src.email ?? null;
        const role = src.role ?? src.authorities ?? src.roles ?? null;
        user = { username, email, role };
      }
      if (!token) throw new Error('No token in response');
      login({ token, user });
      toast.success('Logged in');
      window.location.href = '/dashboard';
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>Kirish</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <TextField
            label="Username"
            fullWidth
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Hisobingiz yo'qmi? <Link href="/register" className='text-blue-500 hover:text-blue-700' >Ro'yxatdan o'tish</Link>
          </Typography>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
