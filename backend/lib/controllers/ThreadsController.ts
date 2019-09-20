import { Request, Response } from 'express';
import Board from '../models/Board';
import Thread from '../models/Thread';
import Reply from '../models/Reply';

export default class ThreadsController {
  public deleteThread = async (req: Request, res: Response) => {
    const { thread_id } = req.params;
    const { delete_password } = req.body;
    await Thread.findById(thread_id, async function(error, thread) {
      if (error) res.status(400).send(error);
      // check if password is correct
      const correctPassword = await thread.authenticate(delete_password);
      if (correctPassword) {
        await Thread.findOneAndRemove({ _id: thread_id }, async function(
          error,
          deletedThread
        ) {
          if (error) res.status(400).send(error);
          // if thread has replies
          if (deletedThread.replies.length) {
            // delete all replies
            await Reply.deleteMany(
              {
                thread_id: deletedThread._id
              },
              async function(error) {
                if (error) res.status(400).send(error);
                else res.json({ deletedThread });
              }
            );
          } else res.json({ deletedThread });
        });
      } else res.status(400).send('Incorrect Delete Password');
    });
  };
  public updateThreadName = async (req: Request, res: Response) => {
    const { text, delete_password } = req.body;
    const { thread_id } = req.params;
    await Thread.findById(thread_id, async function(error, thread) {
      if (error) res.status(400).send(error);
      // check if correct password
      const correctPassword = await thread.authenticate(delete_password);
      if (!correctPassword) res.status(400).send('Incorrect Delete Password');
      else {
        thread.text = text;
        thread.save(function(error) {
          if (error) res.status(400).send(error);
          const parseThread = thread.toObject();
          delete parseThread['delete_password'];
          res.status(200).json({ thread: parseThread });
        });
      }
    });
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
  public getThread = async function(req: Request, res: Response) {
    const { thread_id } = req.params;
    await Thread.findById(
      thread_id,
      '-delete_password -reported',
      {
        populate: [
          {
            path: 'replies',
            model: 'Reply',
            select: '-delete_password -reported'
          }
          // {
          //   path: 'board_id',
          //   model: 'Board',
          //   select: '-delete_password -reported'
          // }
        ]
      },
      function(error, thread) {
        if (error) res.status(400).send(error);
        res.status(200).json({ thread });
      }
    );
  };
}
