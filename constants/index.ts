export const FORMAT_RUPIAH = (number: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number);
};

export const ITEMS_PER_PAGE_DEFAULT = 5;
