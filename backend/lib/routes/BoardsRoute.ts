/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

import BoardsController from '../controllers/BoardsController';

export default class BoardsRoute {
  private boardsController: BoardsController = new BoardsController();
  public routes = (app): void => {
    app.route('/api/boards').post(this.boardsController.createBoard);
  };
}
