import { Request, Response } from 'express';
import Reply from '../models/Reply';
import Thread from '../models/Thread';

export default class RepliesController {
  public createReply = async (req: Request, res: Response) => {
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
  public getThreadReplies = async (req: Request, res: Response) => {
    const { board_id } = req.params;
    const { thread_id } = req.query;
  };
}
