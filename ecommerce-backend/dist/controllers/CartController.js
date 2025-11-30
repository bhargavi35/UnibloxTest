"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cartService_1 = require("../services/cartService");
exports.CartController = {
    getCart: (req, res) => {
        try {
            const { userId } = req.params;
            const cart = cartService_1.cartService.getCart(userId);
            res.json(cart);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get cart' });
        }
    },
    addToCart: (req, res) => {
        try {
            const { userId } = req.params;
            const { productId, quantity } = req.body;
            const cart = cartService_1.cartService.addToCart(userId, productId, quantity);
            res.json(cart);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    updateCartItem: (req, res) => {
        try {
            const { userId, productId } = req.params;
            const { quantity } = req.body;
            const cart = cartService_1.cartService.updateCartItem(userId, productId, quantity);
            res.json(cart);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    removeFromCart: (req, res) => {
        try {
            const { userId, productId } = req.params;
            const cart = cartService_1.cartService.removeFromCart(userId, productId);
            res.json(cart);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    applyDiscount: (req, res) => {
        try {
            const { userId } = req.params;
            const { code } = req.body;
            const cart = cartService_1.cartService.applyDiscountCode(userId, code);
            res.json(cart);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    removeDiscount: (req, res) => {
        try {
            const { userId } = req.params;
            const cart = cartService_1.cartService.removeDiscountCode(userId);
            res.json(cart);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};
//# sourceMappingURL=CartController.js.map