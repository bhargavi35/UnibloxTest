"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutService = exports.CheckoutService = void 0;
const uuid_1 = require("uuid");
const database_1 = require("./database");
class CheckoutService {
    constructor() {
        this.NTH_ORDER_FOR_DISCOUNT = 5; // Every 5th order gets a discount code
    }
    processCheckout(userId) {
        const cart = database_1.database.getCart(userId);
        if (cart.items.length === 0) {
            throw new Error('Cart is empty');
        }
        // Validate stock and apply discounts
        this.validateCartItems(cart);
        const finalAmount = cart.total - cart.discountAmount;
        const order = {
            id: (0, uuid_1.v4)(),
            userId,
            items: [...cart.items],
            total: cart.total,
            discountCode: cart.discountCode,
            discountAmount: cart.discountAmount,
            finalAmount,
            createdAt: new Date()
        };
        // Update product stock
        this.updateProductStock(cart);
        // Create order
        database_1.database.createOrder(order);
        // Mark discount code as used if applied
        if (cart.discountCode) {
            database_1.database.updateDiscountCode(cart.discountCode, { isUsed: true, usedAt: new Date() });
        }
        // Clear cart - use database method directly
        database_1.database.clearCart(userId);
        // Generate discount code for every Nth order
        let discountCode;
        const orderCount = database_1.database.getOrderCount();
        if (orderCount % this.NTH_ORDER_FOR_DISCOUNT === 0) {
            discountCode = this.generateDiscountCode();
        }
        return { order, discountCode };
    }
    validateCartItems(cart) {
        for (const item of cart.items) {
            const product = database_1.database.getProduct(item.productId);
            if (!product || product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product?.name}`);
            }
        }
    }
    updateProductStock(cart) {
        for (const item of cart.items) {
            const product = database_1.database.getProduct(item.productId);
            if (product) {
                product.stock -= item.quantity;
            }
        }
    }
    generateDiscountCode() {
        const code = `DISCOUNT${Date.now().toString(36).toUpperCase()}`;
        const discountCode = {
            code,
            discountPercent: 10,
            isUsed: false,
            createdAt: new Date()
        };
        database_1.database.addDiscountCode(discountCode);
        return code;
    }
    validateDiscountCode(code) {
        const discountCode = database_1.database.getDiscountCodes().find(dc => dc.code === code);
        return !!discountCode && !discountCode.isUsed;
    }
}
exports.CheckoutService = CheckoutService;
exports.checkoutService = new CheckoutService();
//# sourceMappingURL=checkoutService.js.map