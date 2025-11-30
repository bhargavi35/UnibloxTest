import { Request, Response } from 'express';
import { cartService } from '../services/cartService';

export const CartController = {
  getCart: (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const cart = cartService.getCart(userId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get cart' });
    }
  },

  addToCart: (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { productId, quantity } = req.body;
      
      const cart = cartService.addToCart(userId, productId, quantity);
      res.json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  updateCartItem: (req: Request, res: Response) => {
    try {
      const { userId, productId } = req.params;
      const { quantity } = req.body;
      
      const cart = cartService.updateCartItem(userId, productId, quantity);
      res.json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  removeFromCart: (req: Request, res: Response) => {
    try {
      const { userId, productId } = req.params;
      const cart = cartService.removeFromCart(userId, productId);
      res.json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  applyDiscount: (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { code } = req.body;
      
      const cart = cartService.applyDiscountCode(userId, code);
      res.json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  removeDiscount: (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const cart = cartService.removeDiscountCode(userId);
      res.json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};