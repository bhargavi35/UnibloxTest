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
}
export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    discountCode?: string;
    discountAmount: number;
}
export interface DiscountCode {
    code: string;
    discountPercent: number;
    isUsed: boolean;
    createdAt: Date;
    usedAt?: Date;
}
export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    discountCode?: string;
    discountAmount: number;
    finalAmount: number;
    createdAt: Date;
}
export interface AdminStats {
    totalItemsPurchased: number;
    totalPurchaseAmount: number;
    discountCodes: DiscountCode[];
    totalDiscountAmount: number;
}
//# sourceMappingURL=index.d.ts.map