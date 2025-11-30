"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = exports.CartService = void 0;
const database_1 = require("./database");
class CartService {
    addToCart(userId, productId, quantity = 1) {
        const product = database_1.database.getProduct(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }
        const cart = database_1.database.getCart(userId);
        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        }
        else {
            cart.items.push({
                productId,
                quantity,
                price: product.price
            });
        }
        this.calculateCartTotal(cart);
        database_1.database.updateCart(userId, cart);
        return cart;
    }
    removeFromCart(userId, productId) {
        const cart = database_1.database.getCart(userId);
        cart.items = cart.items.filter(item => item.productId !== productId);
        this.calculateCartTotal(cart);
        database_1.database.updateCart(userId, cart);
        return cart;
    }
    updateCartItem(userId, productId, quantity) {
        if (quantity <= 0) {
            return this.removeFromCart(userId, productId);
        }
        const product = database_1.database.getProduct(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }
        const cart = database_1.database.getCart(userId);
        const item = cart.items.find(item => item.productId === productId);
        if (item) {
            item.quantity = quantity;
            item.price = product.price;
        }
        this.calculateCartTotal(cart);
        database_1.database.updateCart(userId, cart);
        return cart;
    }
    applyDiscountCode(userId, code) {
        const cart = database_1.database.getCart(userId);
        const discountCode = database_1.database.getDiscountCodes().find(dc => dc.code === code && !dc.isUsed);
        if (!discountCode) {
            throw new Error('Invalid or already used discount code');
        }
        cart.discountCode = code;
        cart.discountAmount = cart.total * (discountCode.discountPercent / 100);
        database_1.database.updateCart(userId, cart);
        return cart;
    }
    removeDiscountCode(userId) {
        const cart = database_1.database.getCart(userId);
        cart.discountCode = undefined;
        cart.discountAmount = 0;
        database_1.database.updateCart(userId, cart);
        return cart;
    }
    calculateCartTotal(cart) {
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // Recalculate discount if exists
        if (cart.discountCode) {
            const discountCode = database_1.database.getDiscountCodes().find(dc => dc.code === cart.discountCode);
            if (discountCode) {
                cart.discountAmount = cart.total * (discountCode.discountPercent / 100);
            }
        }
    }
    getCart(userId) {
        return database_1.database.getCart(userId);
    }
    clearCart(userId) {
        database_1.database.updateCart(userId, {
            id: userId,
            userId,
            items: [],
            total: 0,
            discountAmount: 0
        });
    }
}
exports.CartService = CartService;
exports.cartService = new CartService();
//# sourceMappingURL=cartService.js.map