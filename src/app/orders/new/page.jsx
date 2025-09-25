"use client";
import { useCartStore } from '@/stores/cart';
import CartItem from '@/components/CartItem';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthStore } from '@/stores/auth';

const schema = yup.object({});

export default function NewOrderPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total)();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const userEmail = useAuthStore((s) => s.user?.email || '');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (_values) => {
    if (items.length === 0) return toast.error('Cart is empty');
    if (!userEmail) return toast.error('Email not available. Please login again.');
    try {
      const { data } = await api.post('/orders', { email: userEmail, items });
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
        {items.length === 0 ? (
          <div className="p-4 rounded border text-gray-600 bg-gray-50">Savat bo'sh</div>
        ) : (
          <>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQty={(q) => updateQuantity(item.id, q)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
            <div className="text-right font-medium">Total: ${total.toFixed(2)}</div>
          </>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <button disabled={isSubmitting || items.length === 0 || !userEmail} className="w-full bg-gray-900 text-white rounded px-3 py-2">
          {items.length === 0 ? 'Savat bo\'sh' : 'Buyurtmani tasdiqlash'}
        </button>
        {!userEmail && (
          <p className="text-red-600 text-sm">Email topilmadi. Iltimos qayta tizimga kiring.</p>
        )}
      </form>
    </div>
  );
}
