export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  discountCode?: string;
  discountAmount: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  discountCode?: string;
  discountAmount: number;
  finalAmount: number;
  createdAt: string;
}
export interface DiscountCode {
  code: string;
  discountPercent: number;
  isUsed: boolean;
  createdAt: string;
  usedAt?: string;
  generatedForOrder?: number;
}

export interface CheckoutResponse {
  order: Order;
  discountCode?: string;
  message?: string;
}

export interface AvailableDiscount {
  code: string;
  discountPercent: number;
  isEligible: boolean;
}