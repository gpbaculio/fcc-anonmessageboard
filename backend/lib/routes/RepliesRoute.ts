/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

import RepliesController from '../controllers/RepliesController';

export default class ThreadsRoute {
  private repliesController: RepliesController = new RepliesController();
  public routes = (app): void => {
    app
      .route('/api/replies/:board_id')
      .get(this.repliesController.getThreadReplies)
      .post(this.repliesController.createReply);
  };
}
