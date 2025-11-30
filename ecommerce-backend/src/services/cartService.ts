import { v4 as uuidv4 } from 'uuid';
import { database } from './database';
import { Cart, CartItem, Product, DiscountCode } from '../types';

export class CartService {
  addToCart(userId: string, productId: string, quantity: number = 1): Cart {
    const product = database.getProduct(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    const cart = database.getCart(userId);
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }

    this.calculateCartTotal(cart);
    database.updateCart(userId, cart);
    
    return cart;
  }

  removeFromCart(userId: string, productId: string): Cart {
    const cart = database.getCart(userId);
    cart.items = cart.items.filter(item => item.productId !== productId);
    
    this.calculateCartTotal(cart);
    database.updateCart(userId, cart);
    
    return cart;
  }

  updateCartItem(userId: string, productId: string, quantity: number): Cart {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    const product = database.getProduct(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    const cart = database.getCart(userId);
    const item = cart.items.find(item => item.productId === productId);
    
    if (item) {
      item.quantity = quantity;
      item.price = product.price;
    }

    this.calculateCartTotal(cart);
    database.updateCart(userId, cart);
    
    return cart;
  }

  applyDiscountCode(userId: string, code: string): Cart {
    const cart = database.getCart(userId);
    const discountCode = database.getDiscountCodes().find(dc => dc.code === code && !dc.isUsed);

    if (!discountCode) {
      throw new Error('Invalid or already used discount code');
    }

    cart.discountCode = code;
    cart.discountAmount = cart.total * (discountCode.discountPercent / 100);
    
    database.updateCart(userId, cart);
    return cart;
  }

  removeDiscountCode(userId: string): Cart {
    const cart = database.getCart(userId);
    cart.discountCode = undefined;
    cart.discountAmount = 0;
    
    database.updateCart(userId, cart);
    return cart;
  }

  private calculateCartTotal(cart: Cart): void {
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Recalculate discount if exists
    if (cart.discountCode) {
      const discountCode = database.getDiscountCodes().find(dc => dc.code === cart.discountCode);
      if (discountCode) {
        cart.discountAmount = cart.total * (discountCode.discountPercent / 100);
      }
    }
  }

  getCart(userId: string): Cart {
    return database.getCart(userId);
  }

  clearCart(userId: string): void {
    database.updateCart(userId, {
      id: userId,
      userId,
      items: [],
      total: 0,
      discountAmount: 0
    });
  }
}

export const cartService = new CartService();