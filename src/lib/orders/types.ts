export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
};

export type CustomerInfo = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
};

export type Order = {
  id: string;
  customer: CustomerInfo;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: "cash_on_delivery";
  createdAt: string;
  updatedAt: string;
};

export type OrderInput = {
  customer: CustomerInfo;
  items: OrderItem[];
  total: number;
};
