import { Request, Response } from 'express';
import Board from '../models/Board';
import { ThreadDocument } from 'models/Thread';

export default class BoardsController {
  public createBoard = async (req: Request, res: Response) => {
    const { name, delete_password } = req.body;
    await Board.findOne({ name }, async (error, board) => {
      if (error) res.status(400).send(error);
      if (!board) {
        await Board.create({ name, delete_password }, (error, newBoard) => {
          if (error) res.status(400).send(error);
          else {
            const parseBoard = newBoard.toObject();
            delete parseBoard['delete_password'];
            res.status(200).json({ board: parseBoard });
          }
        });
      } else res.status(400).send('Board already exists');
    });
  };
  public updateBoardName = async (req: Request, res: Response) => {
    const { board_name, delete_password } = req.body;
    const { board_id } = req.params;
    console.log('updateBoardName 1');
    await Board.findById(board_id, async function(error, board) {
      if (error) res.status(400).send(error);
      console.log('updateBoardName 2');
      const correctPassword = await board.authenticate(delete_password);
      if (!correctPassword) res.status(400).send('Incorrect Delete Password');
      else {
        board.name = board_name;
        board.save(function(error) {
          if (error) res.status(400).send(error);
          console.log('updateBoardName 3');
          const parseBoard = board.toObject();
          delete parseBoard['delete_password'];
          res.status(200).json({ board: parseBoard });
        });
      }
    });
  };
  public getBoard = async (req: Request, res: Response) => {
    const { board_id } = req.params;
    await Board.findById(
      board_id,
      null,
      {
        populate: {
          path: 'threads',
          model: 'Thread',
          select: '-delete_password -reported',
          populate: {
            path: 'replies',
            model: 'Reply',
            select: '-delete_password -reported'
          }
        }
      },
      (error, board) => {
        if (error) res.status(400).send(error);
        res.status(200).json({ board });
      }
    );
  };
  public getBoards = async (_req: Request, res: Response) => {
    await Board.find(
      {},
      null,
      {
        sort: '-createdAt',
        limit: 9,
        populate: {
          path: 'threads',
          model: 'Thread',
          select: '-delete_password -reported',
          populate: {
            path: 'replies',
            model: 'Reply',
            select: '-delete_password -reported'
          }
        }
      },
      (error, boards) => {
        if (error) res.status(400).send(error);
        res.status(200).json({ boards });
      }
    );
  };
}
