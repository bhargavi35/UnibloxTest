"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutController = void 0;
const checkoutService_1 = require("../services/checkoutService");
exports.CheckoutController = {
    checkout: (req, res) => {
        try {
            const { userId } = req.params;
            const result = checkoutService_1.checkoutService.processCheckout(userId);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    validateDiscount: (req, res) => {
        try {
            const { code } = req.params;
            const isValid = checkoutService_1.checkoutService.validateDiscountCode(code);
            res.json({ valid: isValid });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};
//# sourceMappingURL=CheckoutController.js.map