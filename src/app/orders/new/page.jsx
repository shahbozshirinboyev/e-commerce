"use client";
import { useCartStore } from '@/stores/cart';
import CartItem from '@/components/CartItem';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  email: yup.string().email().required(),
});

export default function NewOrderPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total)();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clear = useCartStore((s) => s.clear);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    if (items.length === 0) return toast.error('Cart is empty');
    try {
      const { data } = await api.post('/orders', { ...values, items });
      toast.success('Order created');
      clear();
      window.location.href = `/orders/${data.id}`;
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to create order');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">New Order</h1>
      <div className="space-y-2">
        {items.map((item) => (
          <CartItem key={item.id} item={item} onQty={(q) => updateQuantity(item.id, q)} />
        ))}
        <div className="text-right font-medium">Total: ${total.toFixed(2)}</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('email')} placeholder="Email" className="w-full border rounded px-3 py-2" />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        <button disabled={isSubmitting} className="w-full bg-gray-900 text-white rounded px-3 py-2">Create Order</button>
      </form>
    </div>
  );
}
