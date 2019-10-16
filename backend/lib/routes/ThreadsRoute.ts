/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

import ThreadsController from '../controllers/ThreadsController';

export default class ThreadsRoute {
  private threadsController: ThreadsController = new ThreadsController();
  public routes = (app): void => {
    app
      .route('/api/threads/:board_id')
      .get(this.threadsController.get_threads)
      .post(this.threadsController.createThread)
      .delete(this.threadsController.delete_thread)
      .put(this.threadsController.report_thread);

    app
      .route('/api/thread/:thread_id')
      .get(this.threadsController.getThread)
      .put(this.threadsController.update_thread)
      .delete(this.threadsController.delete_thread);
  };
}
