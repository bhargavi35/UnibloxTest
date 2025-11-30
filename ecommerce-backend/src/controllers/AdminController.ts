import { Request, Response } from 'express';
import { database } from '../services/database';

export const AdminController = {
  getStats: (req: Request, res: Response) => {
    try {
      const stats = database.getAdminStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getDiscountCodes: (req: Request, res: Response) => {
    try {
      const discountCodes = database.getDiscountCodes();
      res.json(discountCodes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};