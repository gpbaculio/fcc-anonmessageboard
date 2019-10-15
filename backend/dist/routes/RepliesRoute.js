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
                .post(this.repliesController.createReply)
                .put(this.repliesController.report_reply);
            app
                .route('/api/reply/:reply_id')
                .post(this.repliesController.updateReplyText)
                .delete(this.repliesController.deleteReply);
        };
    }
}
exports.default = ThreadsRoute;
//# sourceMappingURL=RepliesRoute.js.map