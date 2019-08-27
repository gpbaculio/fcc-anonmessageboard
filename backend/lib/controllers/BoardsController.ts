import { Request, Response } from 'express';
import Board from '../models/Board';
import Thread from '../models/Thread';

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
      { sort: '-createdAt', limit: 9, populate: 'threads' },
      (error, boards) => {
        if (error) res.status(400).send(error);
        res.status(200).json({ boards });
      }
    );
  };
  public createThread = async function(req: Request, res: Response) {
    const { board_id } = req.params;
    const { text, delete_password } = req.body;
    await Thread.create({ board_id, text, delete_password }, async function(
      error,
      thread
    ) {
      if (error) res.status(400).send(error);
      await Board.findById(board_id, async function(err, board) {
        if (err) return res.send(err);
        board.threads.push(thread);
        await board.save(function(err) {
          if (err) return res.send(err);
          else res.redirect(`/b/${board_id}`);
        });
      });
    });
  };
  public getThreads = async (req: Request, res: Response) => {
    const { boardId } = req.params;
    await Thread.find(
      { boardId },
      null,
      { sort: '-createdAt', limit: 10 },
      (error, threads) => {
        if (error) res.status(400).send(error);
        else res.status(200).json({ threads });
      }
    );
  };
  public deleteThread = async (req: Request, res: Response) => {
    const { boardId } = req.params;
    const { thread_id, delete_password } = req.body;
    await Thread.findOne({ boardId, _id: thread_id }, async (error, thread) => {
      if (error) res.status(400).send(error);
      const correctPassword = await thread.authenticate(delete_password);
      if (!correctPassword) res.status(400).send('incorrect password');
      else
        await Thread.findOneAndRemove({ _id: thread._id }, (error, thread) => {
          if (error) res.status(400).send(error);
          console.log('findOneandRemove THread ', thread);
          res.status(200).send('success');
        });
    });
    // return Book.findOneAndRemove({ _id: bookDbId })
  };
}
