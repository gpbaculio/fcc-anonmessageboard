/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const RepliesController_1 = require("../controllers/RepliesController");
class ThreadsRoute {
    constructor() {
        this.repliesController = new RepliesController_1.default();
        this.routes = (app) => {
            app
                .route('/api/replies/:board_id')
                .post(this.repliesController.createReply);
        };
    }
}
exports.default = ThreadsRoute;
//# sourceMappingURL=RepliesRoute.js.map