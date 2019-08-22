/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const StockCheckerController_1 = require("../controllers/StockCheckerController");
class StockCheckerRoute {
    constructor() {
        this.stockCheckerController = new StockCheckerController_1.default();
        this.routes = (app) => {
            app
                .route('/api/stock-prices')
                .post(this.stockCheckerController.getStockData);
        };
    }
}
exports.default = StockCheckerRoute;
//# sourceMappingURL=StockCheckerRoute.js.map