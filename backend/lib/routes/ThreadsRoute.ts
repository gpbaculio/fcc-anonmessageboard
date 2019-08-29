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
      .get(this.threadsController.getThreads)
      .post(this.threadsController.createThread)
      .delete(this.threadsController.deleteThread);
  };
}
