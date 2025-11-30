import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { CheckoutController } from '../controllers/CheckoutController';
import { AdminController } from '../controllers/AdminController';
import { database } from '../services/database';
import { DiscountController } from '../controllers/discountController';

const router = Router();

// Cart routes
router.get('/cart/:userId', CartController.getCart);
router.post('/cart/:userId/items', CartController.addToCart);
router.put('/cart/:userId/items/:productId', CartController.updateCartItem);
router.delete('/cart/:userId/items/:productId', CartController.removeFromCart);
router.post('/cart/:userId/discount', CartController.applyDiscount);
router.delete('/cart/:userId/discount', CartController.removeDiscount);

// Checkout routes
router.post('/checkout/:userId', CheckoutController.checkout);
router.get('/discount/validate/:code', CheckoutController.validateDiscount);

// Admin routes
router.get('/admin/stats', AdminController.getStats);
router.get('/admin/discount-codes', AdminController.getDiscountCodes);

// Product routes
// ✅ FIX: Proper products route
router.get('/products', (req, res) => {
  try {
    const products = database.getProducts();
    console.log('Products API called, returning:', products.length, 'products');
    res.json(products); // ✅ Direct array response
  } catch (error: any) {
    console.error('Error in products route:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/discounts/available/:userId', DiscountController.getAvailableDiscounts);
router.post('/discounts/generate-test', DiscountController.generateTestDiscount); 

export default router;