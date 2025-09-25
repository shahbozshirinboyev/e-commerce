"use client";
import { useCartStore } from '@/stores/cart';
import CartItem from '@/components/CartItem';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/utils/currency';

// Define validation schema
const schema = yup.object().shape({
  customerName: yup.string().required('Ism kiritilishi shart'),
  customerEmail: yup.string().email('Noto\'g\'ri email formati').required('Email kiritilishi shart'),
  orderItems: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup.number().required('Mahsulot ID si kerak'),
        quantity: yup.number().min(1, 'Kamida 1 ta bo\'lishi kerak').required('Miqdori kiritilishi shart'),
      })
    )
    .min(1, 'Kamida bitta mahsulot tanlanishi kerak'),
});

export default function NewOrderPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total)();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clear);
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      orderItems: [],
    },
  });

  const watchedCustomerName = watch('customerName');
  const watchedCustomerEmail = watch('customerEmail');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set form values when component mounts or user changes
  useEffect(() => {
    if (user && mounted) {
      setValue('customerName', user.name || user.username || '');
      setValue('customerEmail', user.email || '');
    }
    setValue('orderItems', items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
    })));
  }, [user, items, setValue, mounted]);

  const onSubmit = async (data) => {
    try {
      // Validate cart is not empty
      if (items.length === 0) {
        toast.error('Savat bo\'sh');
        return;
      }

      // Prepare order data according to schema
      const orderData = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        orderItems: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post('/orders', orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': localStorage.getItem('appLang') || 'uz',
        },
      });

      const responseData = response.data;

      if (responseData.success) {
        toast.success('Buyurtma muvaffaqiyatli yaratildi');
        clearCart();
        router.push(`/orders/${responseData.data.id}`);
      } else {
        throw new Error(responseData.message || 'Buyurtma yaratishda xatolik');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Buyurtma yaratishda xatolik yuz berdi';
      toast.error(errorMessage);
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="p-8 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Savatingiz bo'sh</h2>
          <p className="text-gray-500 mb-6">Buyurtma berish uchun avval mahsulot qo'shing</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mahsulotlarni ko'rish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Yangi buyurtma</h1>
        <div className="text-sm text-gray-500">
          Jami: {formatPrice(total)}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Mijoz ma'lumotlari</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'liq ism *
              </label>
              <input
                {...register('customerName')}
                type="text"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.customerName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ismingizni kiriting"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email manzil *
              </label>
              <input
                {...register('customerEmail')}
                type="email"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.customerEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="email@example.com"
              />
              {errors.customerEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.customerEmail.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Buyurtma mahsulotlari</h2>
            <p className="text-sm text-gray-500 mt-1">
              {items.length} ta mahsulot • Jami: {formatPrice(total)}
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <CartItem
                  item={item}
                  onQty={(q) => updateQuantity(item.id, q)}
                  onRemove={() => removeItem(item.id)}
                />
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-gray-900">Jami to'lov:</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Orqaga qaytish
          </button>
          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              isSubmitting || items.length === 0
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Jarayonda...</span>
              </div>
            ) : (
              'Buyurtma berish'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
