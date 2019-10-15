import { Request, Response } from 'express';
import Board from '../models/Board';
import Thread from '../models/Thread';
import Reply from '../models/Reply';

export default class ThreadsController {
  public report_thread = async (req: Request, res: Response) => {
    const { board_id } = req.params;
    const { thread_id } = req.body;
    await Thread.findOne(
      { _id: thread_id, board_id },
      '-delete_password',
      {
        populate: [
          {
            path: 'replies',
            model: 'Reply',
            select: '-delete_password'
          }
        ]
      },
      async function(error, thread) {
        if (error) res.status(400).send(error);
        // toggle reported status
        thread.reported = !thread.reported;
        thread.save(function(error) {
          if (error) res.status(400).send(error);
          res.status(200).send('success');
        });
      }
    );
  };
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
  public update_thread = async (req: Request, res: Response) => {
    const { text, delete_password, report_thread } = req.body;
    const { thread_id } = req.params;
    await Thread.findById(
      thread_id,
      null,
      {
        populate: [
          {
            path: 'replies',
            model: 'Reply',
            select: '-delete_password'
          }
        ]
      },
      async function(error, thread) {
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
      { board_id },
      '-delete_password',
      {
        sort: '-createdAt',
        limit: 10,
        populate: [
          {
            path: 'threads',
            model: 'Thread',
            select: '-delete_password'
          }
        ]
      },
      (error, threads) => {
        console.log('threads controller getThreads', threads);
        if (error) res.status(400).send(error);
        else res.status(200).json({ threads });
      }
    );
  };
  public getThread = async function(req: Request, res: Response) {
    const { thread_id } = req.params;
    await Thread.findById(
      thread_id,
      '-delete_password',
      {
        populate: [
          {
            path: 'replies',
            model: 'Reply',
            select: '-delete_password'
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
