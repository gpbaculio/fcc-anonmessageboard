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
    app
      .route('/api/boards')
      .get(this.boardsController.getBoards)
      .post(this.boardsController.createBoard);
    app
      .route('/api/board/:board_id')
      .get(this.boardsController.getBoard)
      .post(this.boardsController.updateBoardName);
  };
}
