import { Request, Response } from 'express';
import Board from '../models/Board';

export default class BoardsController {
  public createBoard = async (req: Request, res: Response) => {
    const { name } = req.body;
    await Board.findOne({ name }, async (error, board) => {
      if (error) res.status(400).send(error);
      if (!board) {
        await Board.create({ name }, (error, newBoard) => {
          if (error) res.status(400).send(error);
          else res.status(200).json({ board: newBoard });
        });
      } else res.status(400).send('Board already exists');
    });
  };
  public getBoards = async (_req: Request, res: Response) => {
    await Board.find(
      {},
      null,
      { sort: '-createdAt', limit: 9 },
      (error, boards) => {
        if (error) res.status(400).send(error);
        else res.status(200).json({ boards });
      }
    );
  };
}
