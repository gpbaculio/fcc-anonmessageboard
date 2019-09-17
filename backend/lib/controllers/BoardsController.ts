import { Request, Response } from 'express';
import Board from '../models/Board';
import Thread, { ThreadDocument } from '../models/Thread';
import Reply from '../models/Reply';
import * as mongoose from 'mongoose';

export default class BoardsController {
  public deleteBoard = async (req: Request, res: Response) => {
    const { board_id } = req.params;
    await Board.findOneAndRemove({ _id: board_id }, async function(
      error,
      deletedBoard
    ) {
      if (error) res.status(400).send(error);
      // check if board have threads then delete it all
      if (deletedBoard.threads.length) {
        const deletedBoardThreadIds = deletedBoard.threads.map(th =>
          mongoose.Types.ObjectId(th.id)
        );
        await Thread.deleteMany(
          {
            board_id: deletedBoard._id
          },
          async function(error) {
            if (error) res.status(400).send(error);
            else {
              // check if board have threads
              await Reply.deleteMany(
                {
                  thread_id: { $in: deletedBoardThreadIds }
                },
                async function(error) {
                  if (error) res.status(400).send(error);
                  res.json({ deletedBoard });
                }
              );
              res.json({ deletedBoard });
            }
          }
        );
      } else res.json({ deletedBoard });
    });
  };
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
    await Board.findById(board_id, async function(error, board) {
      if (error) res.status(400).send(error);
      const correctPassword = await board.authenticate(delete_password);
      if (!correctPassword) res.status(400).send('Incorrect Delete Password');
      else {
        board.name = board_name;
        board.save(function(error) {
          if (error) res.status(400).send(error);
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
