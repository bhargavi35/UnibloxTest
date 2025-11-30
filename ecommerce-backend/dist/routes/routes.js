"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CartController_1 = require("../controllers/CartController");
const CheckoutController_1 = require("../controllers/CheckoutController");
const AdminController_1 = require("../controllers/AdminController");
const router = (0, express_1.Router)();
// Cart routes
router.get('/cart/:userId', CartController_1.CartController.getCart);
router.post('/cart/:userId/items', CartController_1.CartController.addToCart);
router.put('/cart/:userId/items/:productId', CartController_1.CartController.updateCartItem);
router.delete('/cart/:userId/items/:productId', CartController_1.CartController.removeFromCart);
router.post('/cart/:userId/discount', CartController_1.CartController.applyDiscount);
router.delete('/cart/:userId/discount', CartController_1.CartController.removeDiscount);
// Checkout routes
router.post('/checkout/:userId', CheckoutController_1.CheckoutController.checkout);
router.get('/discount/validate/:code', CheckoutController_1.CheckoutController.validateDiscount);
// Admin routes
router.get('/admin/stats', AdminController_1.AdminController.getStats);
router.get('/admin/discount-codes', AdminController_1.AdminController.getDiscountCodes);
// Product routes
router.get('/products', (req, res) => {
    const { database } = require('../services/database');
    const products = database.getProducts();
    res.json(products);
});
exports.default = router;
//# sourceMappingURL=routes.js.map