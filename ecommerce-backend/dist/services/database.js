"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
class InMemoryDatabase {
    constructor() {
        this.products = [
            {
                id: '1',
                name: 'Wireless Headphones',
                price: 99.99,
                description: 'High-quality wireless headphones with noise cancellation',
                image: '/images/headphones.jpg',
                stock: 50
            },
            {
                id: '2',
                name: 'Smartphone',
                price: 699.99,
                description: 'Latest smartphone with advanced features',
                image: '/images/smartphone.jpg',
                stock: 30
            },
            {
                id: '3',
                name: 'Laptop',
                price: 1299.99,
                description: 'Powerful laptop for work and gaming',
                image: '/images/laptop.jpg',
                stock: 20
            },
            {
                id: '4',
                name: 'Smart Watch',
                price: 199.99,
                description: 'Feature-rich smartwatch with health monitoring',
                image: '/images/smartwatch.jpg',
                stock: 40
            }
        ];
        this.carts = new Map();
        this.orders = [];
        this.discountCodes = [];
        this.orderCounter = 0;
    }
    // Product methods
    getProducts() {
        return this.products;
    }
    getProduct(id) {
        return this.products.find(p => p.id === id);
    }
    // Cart methods
    getCart(userId) {
        if (!this.carts.has(userId)) {
            this.carts.set(userId, {
                id: userId,
                userId,
                items: [],
                total: 0,
                discountAmount: 0
            });
        }
        return this.carts.get(userId);
    }
    updateCart(userId, cart) {
        this.carts.set(userId, cart);
    }
    // Order methods
    createOrder(order) {
        this.orders.push(order);
        this.orderCounter++;
    }
    getOrders() {
        return this.orders;
    }
    // Discount code methods
    addDiscountCode(code) {
        this.discountCodes.push(code);
    }
    getDiscountCodes() {
        return this.discountCodes;
    }
    updateDiscountCode(code, updates) {
        const discountCode = this.discountCodes.find(dc => dc.code === code);
        if (discountCode) {
            Object.assign(discountCode, updates);
        }
    }
    // Admin stats
    getAdminStats() {
        const totalItemsPurchased = this.orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        const totalPurchaseAmount = this.orders.reduce((sum, order) => sum + order.total, 0);
        const totalDiscountAmount = this.orders.reduce((sum, order) => sum + order.discountAmount, 0);
        return {
            totalItemsPurchased,
            totalPurchaseAmount,
            discountCodes: this.discountCodes,
            totalDiscountAmount
        };
    }
    getOrderCount() {
        return this.orderCounter;
    }
    // Add this method to clear cart
    clearCart(userId) {
        this.carts.set(userId, {
            id: userId,
            userId,
            items: [],
            total: 0,
            discountAmount: 0
        });
    }
}
exports.database = new InMemoryDatabase();
//# sourceMappingURL=database.js.map