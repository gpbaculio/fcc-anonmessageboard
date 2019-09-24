import { Request, Response } from 'express';
import Reply from '../models/Reply';
import Thread from '../models/Thread';

export default class RepliesController {
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
  public createReply = async function(req: Request, res: Response) {
    const { board_id } = req.params;
    const { thread_id, text, delete_password } = req.body;
    await Reply.create({ thread_id, text, delete_password }, async function(
      error,
      reply
    ) {
      if (error) return res.status(400).send(error);
      else
        await Thread.findOne({ board_id, _id: thread_id }, async function(
          error,
          thread
        ) {
          if (error) res.status(400).send(error);
          thread.bumped_on = new Date();
          thread.replies.push(reply);
          thread.save(function(error) {
            if (error) res.status(400).send(error);
            return res.status(200).json({ reply });
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
