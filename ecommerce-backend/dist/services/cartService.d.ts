import { Cart } from '../types';
export declare class CartService {
    addToCart(userId: string, productId: string, quantity?: number): Cart;
    removeFromCart(userId: string, productId: string): Cart;
    updateCartItem(userId: string, productId: string, quantity: number): Cart;
    applyDiscountCode(userId: string, code: string): Cart;
    removeDiscountCode(userId: string): Cart;
    private calculateCartTotal;
    getCart(userId: string): Cart;
    clearCart(userId: string): void;
}
export declare const cartService: CartService;
//# sourceMappingURL=cartService.d.ts.map