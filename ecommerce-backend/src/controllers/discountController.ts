import { Request, Response } from 'express';
import { database } from '../services/database';

export const DiscountController = {
    getAvailableDiscounts: (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            console.log(`Fetching available discounts for user: ${userId}`);


            // Get all discount codes from database
            const allDiscountCodes = database.getDiscountCodes();

            console.log('🔍 All discount codes:', allDiscountCodes.map(dc => ({
                code: dc.code,
                isUsed: dc.isUsed,
                createdAt: dc.createdAt
            })));

            // Filter only unused discount codes
            const availableDiscounts = allDiscountCodes
                .filter(code => !code.isUsed)
                .map(code => ({
                    code: code.code,
                    discountPercent: code.discountPercent,
                    isEligible: true
                }));

            // Calculate orders until next discount (every 5th order gets a code)
            const totalOrders = database.getOrders().length;
            const ordersUntilNextDiscount = 5 - (totalOrders % 5);

            console.log(`Total orders: ${totalOrders}, Next discount in: ${ordersUntilNextDiscount} orders`);

            res.json({
                success: true,
                availableDiscounts,
                nextDiscountAt: ordersUntilNextDiscount === 5 ? 0 : ordersUntilNextDiscount,
                totalOrders
            });
        } catch (error: any) {
            console.error('Error in getAvailableDiscounts:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    generateTestDiscount: (req: Request, res: Response) => {
        try {
            const { code = `TEST${Date.now().toString(36).toUpperCase()}`, discountPercent = 10 } = req.body;

            console.log(`🎯 Generating test discount code: ${code}`);

            // Check if code already exists
            const existingCode = database.getDiscountCodes().find(dc => dc.code === code);
            if (existingCode) {
                console.log(`❌ Discount code ${code} already exists`);
                return res.status(400).json({
                    success: false,
                    error: 'Discount code already exists'
                });
            }

            const discountCode = {
                code,
                discountPercent,
                isUsed: false,
                createdAt: new Date().toISOString()
            };

            database.addDiscountCode(discountCode);

            console.log(`✅ Generated test discount code: ${code}`);

            res.json({
                success: true,
                discountCode,
                message: `Test discount code ${code} generated successfully`
            });
        } catch (error: any) {
            console.error('❌ Error generating test discount:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};