import { Request, Response } from 'express';
import { checkoutService } from '../services/checkoutService';

export const CheckoutController = {
  checkout: (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const result = checkoutService.processCheckout(userId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  validateDiscount: (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const isValid = checkoutService.validateDiscountCode(code);
      res.json({ valid: isValid });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};