/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const ThreadsController_1 = require("../controllers/ThreadsController");
class ThreadsRoute {
    constructor() {
        this.threadsController = new ThreadsController_1.default();
        this.routes = (app) => {
            app
                .route('/api/threads/:board_id')
                .get(this.threadsController.get_threads)
                .post(this.threadsController.createThread)
                .delete(this.threadsController.deleteThread)
                .put(this.threadsController.report_thread);
            app
                .route('/api/thread/:thread_id')
                .get(this.threadsController.getThread)
                .put(this.threadsController.update_thread)
                .delete(this.threadsController.deleteThread);
        };
    }
}
exports.default = ThreadsRoute;
//# sourceMappingURL=ThreadsRoute.js.map