"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const database_1 = require("../services/database");
exports.AdminController = {
    getStats: (req, res) => {
        try {
            const stats = database_1.database.getAdminStats();
            res.json(stats);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getDiscountCodes: (req, res) => {
        try {
            const discountCodes = database_1.database.getDiscountCodes();
            res.json(discountCodes);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
//# sourceMappingURL=AdminController.js.map