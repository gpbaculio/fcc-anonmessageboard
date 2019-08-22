import { Request, Response } from 'express';
import Board from '../models/Board';

export default class BoardsController {
  public createBoard = async (req: Request, res: Response) => {
    const { name } = req.body;
    const board = await Board.find({ name });
    if (board) res.status(400).send('Board already exists');
    await Board.create({ name }, (error, newBoard) => {
      if (error) res.status(400).send(error);
      else res.status(200).json({ board: newBoard });
    });
  };
}
