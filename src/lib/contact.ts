const DEFAULT_SUPPORT_PHONE = "+212727541242";

export const SUPPORT_PHONE_LOCAL = "0727541242";
export const SUPPORT_PHONE_DISPLAY = "07 27 54 12 42";

export function getSupportPhoneE164() {
  return process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? DEFAULT_SUPPORT_PHONE;
}

export function getWhatsAppDigits() {
  return getSupportPhoneE164().replace(/\D/g, "");
}

export function getWhatsAppHref(message?: string) {
  const base = `https://wa.me/${getWhatsAppDigits()}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function getTelHref() {
  return `tel:${getSupportPhoneE164()}`;
}
