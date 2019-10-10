import Board from '../models/Board';
import Thread from '../models/Thread';
import Reply from '../models/Reply';
/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chaiHttp = require('chai-http');
const chaiModule = require('chai');
const axios = require('axios');
import * as mongoose from 'mongoose';
const assert = chaiModule.assert;
import server from '../server';
chaiModule.use(chaiHttp);

// create board
const create_test_board = async function(
  done,
  { name, delete_password }: { name: string; delete_password: string },
  call_back?: (board_id) => void
) {
  // make sure board is non existing
  await Board.findOne({ name }, async function(error, board) {
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
      const new_board = new Board({ name, delete_password });
      new_board
        .save()
        .then(function(rec) {
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
const delete_test_board = async function(
  done,
  board_id_param: { _id: string }
) {
  await Board.findOneAndDelete(board_id_param, async function(
    error,
    deleted_board
  ) {
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
      await Thread.deleteMany(
        {
          board_id: deleted_board._id
        },
        async function(error) {
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
            await Reply.deleteMany(
              {
                thread_id: { $in: deleted_board_thread_ids }
              },
              async function(error) {
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
const create_board_thread = async function(
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
  call_back?: (thread_id: string) => void
) {
  await Thread.create({ board_id, text, delete_password }, async function(
    thread_error,
    thread
  ) {
    if (thread_error) {
      console.error(thread_error.message);
      done();
    }
    await Board.findById(board_id, async function(board_error, board) {
      if (board_error) {
        console.error(board_error.message);
        done();
      }
      // push created thread on board and save
      board.threads.push(thread);
      await board.save(function(board_save_error) {
        if (board_save_error) {
          console.error(board_save_error.message);
          done();
        } else {
          if (call_back) call_back(thread._id);
          done();
        }
      });
    });
  });
};
suite('Functional Tests', function() {
  // need more time from response
  this.timeout(10000);

  // generate simple random string for board name, thread text, reply text, delete password
  const gen_rand_string = () =>
    Math.random()
      .toString(36)
      .substring(2);

  // create board and assign its' _id on test_board_id
  // test_board_id will be used to delete the board after testing
  let test_board_id;

  const threads_route = '/api/threads';

  // we need to create a board to create a thread, created board will be deleted after test on teardown
  suiteSetup(done => {
    this.timeout(10000);
    console.log('suite setup');
    create_test_board(
      done,
      {
        name: gen_rand_string(),
        delete_password: gen_rand_string()
      },
      function(board_id) {
        test_board_id = board_id;
        return;
      }
    );
  });
  suite(`API ROUTING FOR ${threads_route}/:board_id`, function() {
    this.timeout(10000);
    suite('POST', function() {
      this.timeout(10000);
      test(`CREATE NEW THREAD ON BOARD`, function(done) {
        chaiModule
          .request(server)
          .post(`${threads_route}/${test_board_id}`)
          .send({
            text: gen_rand_string(),
            delete_password: gen_rand_string()
          })
          .end(function(create_thread_error, res) {
            //testId = res.body._id;
            console.log('res body ', res.body);
            assert.equal(res.status, 200);
            // assert.equal(res.body.issue_title, 'Title');
            // assert.equal(res.body.issue_text, 'text');
            // assert.equal(
            //   res.body.created_by,
            //   'Functional Test - Every field filled in'
            // );
            // assert.equal(res.body.assigned_to, 'Chai and Mocha');
            // assert.equal(res.body.status_text, 'In QA');
            // assert.equal(res.body.open, true);
            done();
          });
      });
      // delete board after testing
      teardown(done => {
        this.timeout(10000);
        delete_test_board(done, { _id: test_board_id });
      });
    });

    suite('GET', function() {});

    suite('DELETE', function() {});

    suite('PUT', function() {});
  });

  suite('API ROUTING FOR /api/replies/:board', function() {
    suite('POST', function() {});

    suite('GET', function() {});

    suite('PUT', function() {});

    suite('DELETE', function() {});
  });
});
