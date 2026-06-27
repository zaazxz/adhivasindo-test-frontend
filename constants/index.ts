export const FORMAT_RUPIAH = (number: number | string) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(number) || 0);
};

export const FORMAT_DATE = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
  if (!dateString) return "-";
  const dtStr = dateString.endsWith("Z") ? dateString : dateString.replace(" ", "T") + "Z";
  return new Date(dtStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
    ...options
  });
};

export const FORMAT_DATE_SHORT = (dateString: string) => {
  if (!dateString) return "-";
  const dtStr = dateString.endsWith("Z") ? dateString : dateString.replace(" ", "T") + "Z";
  return new Date(dtStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
};

export const FORMAT_DATE_TIME = (dateString: string) => {
  if (!dateString) return "-";
  const dtStr = dateString.endsWith("Z") ? dateString : dateString.replace(" ", "T") + "Z";
  return new Date(dtStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
};

export const ITEMS_PER_PAGE_DEFAULT = 5;
export const ITEMS_PER_PAGE_TRANSAKSI = 8;
export const ITEMS_PER_PAGE_DASHBOARD = 10;
