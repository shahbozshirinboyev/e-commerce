"use client";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required(),
  price: yup.number().min(0).required(),
  stock: yup.number().min(0).required(),
});

export default function NewProductPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/products', values);
      toast.success('Product created');
      window.location.href = `/products/${data.id}`;
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to create');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-xl font-semibold">New Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('name')} placeholder="Name" className="w-full border rounded px-3 py-2" />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        <input type="number" step="0.01" {...register('price')} placeholder="Price" className="w-full border rounded px-3 py-2" />
        {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
        <input type="number" {...register('stock')} placeholder="Stock" className="w-full border rounded px-3 py-2" />
        {errors.stock && <p className="text-red-600 text-sm">{errors.stock.message}</p>}
        <button disabled={isSubmitting} className="w-full bg-gray-900 text-white rounded px-3 py-2">Create</button>
      </form>
    </div>
  );
}
