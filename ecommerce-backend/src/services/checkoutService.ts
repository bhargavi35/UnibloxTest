import { v4 as uuidv4 } from 'uuid';
import { database } from './database';
import { Order, DiscountCode } from '../types';

export class CheckoutService {
  private readonly NTH_ORDER_FOR_DISCOUNT = 5; // Every 5th order gets a discount code

  processCheckout(userId: string): { order: Order; discountCode?: string } {
    const cart = database.getCart(userId);

    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }


    // Validate stock and apply discounts
    this.validateCartItems(cart);

    const finalAmount = cart.total - cart.discountAmount;

    const order: Order = {
      id: uuidv4(),
      userId,
      items: [...cart.items],
      total: cart.total,
      discountCode: cart.discountCode,
      discountAmount: cart.discountAmount,
      finalAmount,
      createdAt: new Date().toISOString()
    };

    // Update product stock
    this.updateProductStock(cart);

    // Create order
    database.createOrder(order);

    // Mark discount code as used if applied
    if (cart.discountCode) {
      database.updateDiscountCode(cart.discountCode, { isUsed: true, usedAt: new Date().toISOString() });
    }

    // Clear cart - use database method directly
    database.clearCart(userId);

    // Generate discount code for every Nth order
    let discountCode: string | undefined;
    const orderCount = database.getOrderCount();

    if (orderCount % this.NTH_ORDER_FOR_DISCOUNT === 0) {
      discountCode = this.generateDiscountCode();
    }

    return { order, discountCode };
  }

  private validateCartItems(cart: any): void {
    for (const item of cart.items) {
      const product = database.getProduct(item.productId);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product?.name}`);
      }
    }
  }

  private updateProductStock(cart: any): void {
    for (const item of cart.items) {
      const product = database.getProduct(item.productId);
      if (product) {
        product.stock -= item.quantity;
      }
    }
  }

  private generateDiscountCode(): string {
    const code = `DISCOUNT${Date.now().toString(36).toUpperCase()}`;
    const orderCount = database.getOrderCount(); 
    const discountCode: DiscountCode = {
      code,
      discountPercent: 10,
      isUsed: false,
      createdAt: new Date().toISOString(),
      generatedForOrder: orderCount
    };

    database.addDiscountCode(discountCode);
    return code;
  }

  validateDiscountCode(code: string): boolean {
    const discountCode = database.getDiscountCodes().find(dc => dc.code === code);
    return !!discountCode && !discountCode.isUsed;
  }
}

export const checkoutService = new CheckoutService();