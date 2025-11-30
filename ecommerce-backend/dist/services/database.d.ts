import { Product, Cart, Order, DiscountCode, AdminStats } from '../types';
declare class InMemoryDatabase {
    private products;
    private carts;
    private orders;
    private discountCodes;
    private orderCounter;
    getProducts(): Product[];
    getProduct(id: string): Product | undefined;
    getCart(userId: string): Cart;
    updateCart(userId: string, cart: Cart): void;
    createOrder(order: Order): void;
    getOrders(): Order[];
    addDiscountCode(code: DiscountCode): void;
    getDiscountCodes(): DiscountCode[];
    updateDiscountCode(code: string, updates: Partial<DiscountCode>): void;
    getAdminStats(): AdminStats;
    getOrderCount(): number;
    clearCart(userId: string): void;
}
export declare const database: InMemoryDatabase;
export {};
//# sourceMappingURL=database.d.ts.map