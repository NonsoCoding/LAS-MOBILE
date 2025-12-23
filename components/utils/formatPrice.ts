// utils/formatPrice.ts

export const formatPrice = (value: number | string) => {
  const num = Number(value);

  if (isNaN(num)) return "₦0";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(num);
};

export const formatPriceWithDecimal = (value: number | string) => {
  const num = Number(value);

  if (isNaN(num)) return "₦0.00";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(num);
};

export const formatCompactPrice = (value: number) => {
  return Intl.NumberFormat("en-NG", {
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(value);
};
