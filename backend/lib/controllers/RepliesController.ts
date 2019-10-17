import { Request, Response } from 'express';
import Reply from '../models/Reply';
import Thread from '../models/Thread';

export default class RepliesController {
  public report_reply = async (req: Request, res: Response) => {
    const { board_id } = req.params;
    const { thread_id, reply_id } = req.body;
    // make sure the board and thread is existing
    await Thread.findOne({ board_id, _id: thread_id }, async function(
      error,
      thread
    ) {
      if (error) res.status(400).send(error);
      await Reply.findOne(
        { _id: reply_id, thread_id: thread._id },
        '-delete_password',
        {
          populate: {
            path: 'thread_id',
            model: 'Thread',
            select: '-delete_password'
          }
        },
        async function(error, reply) {
          if (error) res.status(400).send(error);
          // toggle reported status
          reply.reported = !reply.reported;
          reply.save(function(error) {
            if (error) res.status(400).send(error);
            res.status(200).send('success');
          });
        }
      );
    });
  };
  public deleteReply = async (req: Request, res: Response) => {
    const { reply_id } = req.params;
    const { delete_password } = req.body;
    await Reply.findById(reply_id, async function(error, reply) {
      if (error) res.status(400).send(error);
      // check if password is correct
      const correctPassword = await reply.authenticate(delete_password);
      if (correctPassword) {
        await Reply.findOneAndRemove({ _id: reply_id }, async function(
          error,
          deletedReply
        ) {
          if (error) res.status(400).send(error);
          // a reply will always have thread
          else res.json({ deletedReply });
        });
      } else res.status(400).send('Incorrect Delete Password');
    });
  };
  public create_reply = function(req: Request, res: Response) {
    const { board_id } = req.params;
    const { thread_id, text, delete_password } = req.body;
    const new_reply = new Reply({ thread_id, text, delete_password });
    new_reply.save((new_reply_error, saved_reply) => {
      if (new_reply_error) res.status(400).send(new_reply_error);
      Thread.findOne({ board_id, _id: thread_id }, function(error, thread) {
        if (error) res.status(400).send(error);
        thread.bumped_on = new Date();
        thread.replies.push(saved_reply);
        thread.save(function(error) {
          if (error) res.status(400).send(error);
          const saved_reply_object = saved_reply.toObject();
          delete saved_reply_object.delete_password;
          return res.status(200).json({ reply: saved_reply_object });
        });
      });
    });
  };
  public updateReplyText = async function(req: Request, res: Response) {
    const { reply_id } = req.params;
    const { text, delete_password } = req.body;
    await Reply.findById(reply_id, async function(error, reply) {
      if (error) res.status(400).send(error);
      // check if password is correct
      const correctPassword = await reply.authenticate(delete_password);
      if (correctPassword) {
        reply.text = text;
        reply.save(function(error) {
          if (error) res.status(400).send(error);
          const parseReply = reply.toObject();
          delete parseReply['delete_password'];
          res.status(200).json({ reply: parseReply });
        });
      } else res.status(400).send('Incorrect Delete Password');
    });
  };
}
