import { Request, Response } from 'express';
import Board from '../models/Board';
import Thread from '../models/Thread';

export default class ThreadsController {
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
          else {
            const parseThread = thread.toObject();
            delete parseThread['delete_password'];
            res.status(200).json({ thread: parseThread });
          }
        });
      });
    });
  };
  public getThreads = async (req: Request, res: Response) => {
    const { board_id } = req.params;
    await Thread.find(
      { boardId: board_id },
      null,
      { sort: '-createdAt', limit: 10 },
      (error, threads) => {
        if (error) res.status(400).send(error);
        else res.status(200).json({ threads });
      }
    );
  };
  public deleteThread = async (req: Request, res: Response) => {
    const { board_id } = req.params;
    const { thread_id, delete_password } = req.body;
    await Thread.findOne(
      { boardId: board_id, _id: thread_id },
      async (error, thread) => {
        if (error) res.status(400).send(error);
        const correctPassword = await thread.authenticate(delete_password);
        if (!correctPassword) res.status(400).send('incorrect password');
        else
          await Thread.findOneAndRemove(
            { _id: thread._id },
            (error, thread) => {
              if (error) res.status(400).send(error);
              res.status(200).send('success');
            }
          );
      }
    );
  };
}
