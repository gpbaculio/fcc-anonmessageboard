/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const BoardsController_1 = require("../controllers/BoardsController");
class BoardsRoute {
    constructor() {
        this.boardsController = new BoardsController_1.default();
        this.routes = (app) => {
            app.route('/api/boards').post(this.boardsController.createBoard);
        };
    }
}
exports.default = BoardsRoute;
//# sourceMappingURL=BoardsRoute.js.map