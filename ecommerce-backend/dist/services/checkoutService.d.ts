import { Order } from '../types';
export declare class CheckoutService {
    private readonly NTH_ORDER_FOR_DISCOUNT;
    processCheckout(userId: string): {
        order: Order;
        discountCode?: string;
    };
    private validateCartItems;
    private updateProductStock;
    private generateDiscountCode;
    validateDiscountCode(code: string): boolean;
}
export declare const checkoutService: CheckoutService;
//# sourceMappingURL=checkoutService.d.ts.map