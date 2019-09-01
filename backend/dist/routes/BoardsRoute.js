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
            app
                .route('/api/boards')
                .get(this.boardsController.getBoards)
                .post(this.boardsController.createBoard);
            app.route('/api/board/:board_id').get(this.boardsController.getBoard);
        };
    }
}
exports.default = BoardsRoute;
//# sourceMappingURL=BoardsRoute.js.map