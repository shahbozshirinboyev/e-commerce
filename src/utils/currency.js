export function formatPrice(price) {
  if (price === null || price === undefined) return '';
  const number = Number(price);
  if (isNaN(number)) return price;

  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(number) + ' so\'m';
}

export function parsePrice(value) {
  if (!value) return '';
  return value.toString().replace(/\D/g, '');
}
