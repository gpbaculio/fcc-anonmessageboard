import * as mongoose from 'mongoose';

import Board from '../models/Board';
import Thread from '../models/Thread';
import Reply from '../models/Reply';

export const create_test_board = function(
  done,
  { name, delete_password }: { name: string; delete_password: string },
  call_back?: (board_id) => void
) {
  // make sure board is non existing
  Board.findOne({ name }, function(error, board) {
    // check for error
    if (error) {
      console.error(error.message);
      done();
    }
    // board found existing, return error
    if (board) {
      console.error('Board already exists');
      done();
    } // non existing, create the board
    else {
      const _new_board = new Board({ name, delete_password });
      _new_board
        .save()
        .then(function(new_board) {
          if (call_back) call_back(new_board._id);
          done();
        })
        .catch(function(err) {
          console.error(err.message);
          done();
        });
    }
  });
};
// delete board
export const delete_test_board = function(
  done,
  board_id_param: { _id: string }
) {
  Board.findByIdAndRemove(board_id_param, function(error, deleted_board) {
    if (error) console.error(error.message);
    if (deleted_board && !deleted_board.threads.length) {
      console.log('deleted board with id', deleted_board._id);
      done();
      return;
    }
    // check if board have threads
    else if (deleted_board && deleted_board.threads.length) {
      console.log('deleted board with id', deleted_board._id);
      const deleted_board_thread_ids = deleted_board.threads.map(thread =>
        mongoose.Types.ObjectId(thread.id)
      );
      Thread.deleteMany(
        {
          board_id: deleted_board._id
        },
        function(error) {
          if (error) {
            console.error(error.message);
            done();
            return;
          } else {
            // delete any replies associated with the thread
            console.log(
              'deleted threads associated with board id',
              deleted_board._id
            );
            Reply.deleteMany(
              {
                thread_id: { $in: deleted_board_thread_ids }
              },
              function(error) {
                if (error) {
                  console.error(error.message);
                  done();
                  return;
                } else {
                  console.log(
                    'deleted replies associated with thread ids  ',
                    deleted_board_thread_ids
                  );
                  done();
                  return;
                }
              }
            );
          }
        }
      );
    }
  });
};
export const create_board_thread = function(
  done,
  {
    board_id,
    text,
    delete_password
  }: {
    board_id: string;
    text: string;
    delete_password: string;
  },
  call_back?: (thread_id: string) => void,
  { for_reply = false } = {}
) {
  Thread.create({ board_id, text, delete_password }, function(
    thread_error,
    thread
  ) {
    if (thread_error) {
      console.error(thread_error.message);
      done();
    }
    Board.findById(board_id, function(board_error, board) {
      if (board_error) {
        console.error(board_error.message);
        done();
      }
      // push created thread on board and save
      board.threads.push(thread);
      board.save(function(board_save_error) {
        if (board_save_error) {
          console.error(board_save_error.message);
          done();
        } else {
          if (call_back) call_back(thread._id);
          // do not return for reply since we need to proceed on creating a reply
          if (for_reply) return;
          done();
        }
      });
    });
  });
};

export const delete_board_thread = function(done, thread_id: { _id: string }) {
  Thread.findOneAndDelete(thread_id, function(
    thread_delete_error,
    deleted_thread
  ) {
    if (thread_delete_error) {
      console.error(thread_delete_error.message);
      done();
    }
    // if thread has no replies
    if (deleted_thread && !deleted_thread.replies.length) {
      console.log('deleted thread with id', deleted_thread._id);
      done();
    }
    // if thread has replies
    else if (deleted_thread && deleted_thread.replies.length) {
      const deleted_thread_reply_ids = deleted_thread.replies.map(thread =>
        mongoose.Types.ObjectId(thread.id)
      );
      Reply.deleteMany(
        {
          _id: { $in: deleted_thread_reply_ids }
        },
        function(delete_replies_error) {
          if (delete_replies_error) {
            console.error(delete_replies_error.message);
            done();
          } else {
            console.log(
              'deleted replies associated with thread id',
              deleted_thread._id
            );
            done();
          }
        }
      );
    }
  });
};
export const create_thread_reply = function(
  done,
  {
    thread_id,
    text,
    delete_password
  }: {
    thread_id: string;
    text: string;
    delete_password: string;
  },
  call_back?: (reply_id: string) => void
) {
  const new_reply = new Reply({ thread_id, text, delete_password });
  new_reply.save((new_reply_error, saved_reply) => {
    if (new_reply_error) {
      console.error(new_reply_error.message);
      done();
    }
    Thread.findById(thread_id, function(find_thread_error, thread) {
      if (find_thread_error) {
        console.error(new_reply_error.message);
        done();
      }
      thread.bumped_on = new Date();
      thread.replies.push(saved_reply);
      thread.save(function(thread_save_error) {
        if (thread_save_error) {
          console.error(thread_save_error.message);
          done();
        }
        const saved_reply_object = saved_reply.toObject();
        delete saved_reply_object.delete_password;
        if (call_back) call_back(saved_reply_object._id);
        done();
      });
    });
  });
};
