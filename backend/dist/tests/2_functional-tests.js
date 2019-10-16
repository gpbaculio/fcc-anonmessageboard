"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = require("../models/Board");
const Thread_1 = require("../models/Thread");
const Reply_1 = require("../models/Reply");
/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */
const chaiHttp = require('chai-http');
const chai_module = require('chai');
const axios = require('axios');
const mongoose = require("mongoose");
const assert = chai_module.assert;
const server_1 = require("../server");
chai_module.use(chaiHttp);
// create board and assign its' _id on test_board_id
// test_board_id will be used to delete the board after testing
let test_board_id;
// create board
const create_test_board = function (done, { name, delete_password }, call_back) {
    // make sure board is non existing
    Board_1.default.findOne({ name }, function (error, board) {
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
            const _new_board = new Board_1.default({ name, delete_password });
            _new_board
                .save()
                .then(function (new_board) {
                test_board_id = new_board._id;
                console.log('test_board_id ', test_board_id);
                if (call_back)
                    call_back(test_board_id);
                console.log('create board with id ', test_board_id);
                done();
            })
                .catch(function (err) {
                console.error(err.message);
                done();
            });
        }
    });
};
// delete board
const delete_test_board = function (done, board_id_param) {
    Board_1.default.findByIdAndRemove(board_id_param, function (error, deleted_board) {
        if (error)
            console.error(error.message);
        if (deleted_board && !deleted_board.threads.length) {
            console.log('deleted board with id', deleted_board._id);
            done();
            return;
        }
        // check if board have threads
        else if (deleted_board && deleted_board.threads.length) {
            console.log('deleted board with id', deleted_board._id);
            const deleted_board_thread_ids = deleted_board.threads.map(thread => mongoose.Types.ObjectId(thread.id));
            Thread_1.default.deleteMany({
                board_id: deleted_board._id
            }, function (error) {
                if (error) {
                    console.error(error.message);
                    done();
                    return;
                }
                else {
                    // delete any replies associated with the thread
                    console.log('deleted threads associated with board id', deleted_board._id);
                    Reply_1.default.deleteMany({
                        thread_id: { $in: deleted_board_thread_ids }
                    }, function (error) {
                        if (error) {
                            console.error(error.message);
                            done();
                            return;
                        }
                        else {
                            console.log('deleted replies associated with thread ids  ', deleted_board_thread_ids);
                            done();
                            return;
                        }
                    });
                }
            });
        }
    });
};
const create_board_thread = function (done, { board_id, text, delete_password }, call_back) {
    Thread_1.default.create({ board_id, text, delete_password }, function (thread_error, thread) {
        if (thread_error) {
            console.error(thread_error.message);
            done();
        }
        Board_1.default.findById(board_id, function (board_error, board) {
            if (board_error) {
                console.error(board_error.message);
                done();
            }
            // push created thread on board and save
            board.threads.push(thread);
            board.save(function (board_save_error) {
                if (board_save_error) {
                    console.error(board_save_error.message);
                    done();
                }
                else {
                    if (call_back)
                        call_back(thread._id);
                    console.log('created thread with id', thread._id);
                    done();
                }
            });
        });
    });
};
const delete_board_thread = function (done, thread_id) {
    Thread_1.default.findOneAndDelete(thread_id, function (thread_delete_error, deleted_thread) {
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
            const deleted_thread_reply_ids = deleted_thread.replies.map(thread => mongoose.Types.ObjectId(thread.id));
            Reply_1.default.deleteMany({
                _id: { $in: deleted_thread_reply_ids }
            }, function (delete_replies_error) {
                if (delete_replies_error) {
                    console.error(delete_replies_error.message);
                    done();
                }
                else {
                    console.log('deleted replies associated with thread id', deleted_thread._id);
                    done();
                }
            });
        }
    });
};
suite('Functional Tests', function () {
    // need more time from response
    this.timeout(20000);
    // generate simple random string for board name, thread text, reply text, delete password
    const gen_rand_string = () => Math.random()
        .toString(36)
        .substring(2);
    const threads_route = '/api/threads';
    // we need to create a board to create a thread, created board will be deleted after test on teardown
    suiteSetup(done => {
        this.timeout(20000);
        console.log('suite setup');
        create_test_board(done, {
            name: gen_rand_string(),
            delete_password: gen_rand_string()
        }, function (board_id) {
            test_board_id = board_id;
            return;
        });
    });
    suite(`API ROUTING FOR ${threads_route}/:board_id`, function () {
        this.timeout(20000);
        suite('POST', function () {
            let thread_id = null;
            this.timeout(20000);
            test(`CREATE NEW THREAD ON BOARD`, function (done) {
                this.timeout(20000);
                const request_body = {
                    text: gen_rand_string(),
                    delete_password: gen_rand_string()
                };
                const expected_status = 200;
                const expected_keys = [
                    'reported',
                    'replies',
                    '_id',
                    'board_id',
                    'text',
                    'bumped_on',
                    'created_on',
                    'updated_on'
                ];
                chai_module
                    .request(server_1.default)
                    .post(`${threads_route}/${test_board_id}`)
                    .send(request_body)
                    .end(function (create_thread_error, response) {
                    const { thread: result_thread } = response.body;
                    thread_id = result_thread._id;
                    // should be no error
                    assert.equal(create_thread_error, null);
                    assert.equal(response.status, expected_status);
                    // thread should contain expected keys
                    assert.hasAllKeys(result_thread, expected_keys);
                    // text should match text from argument request
                    assert.propertyVal(result_thread, 'text', request_body.text);
                    // initialized to false
                    assert.isFalse(result_thread.reported);
                    // replies should be array
                    assert.isArray(result_thread.replies);
                    assert.isEmpty(result_thread.replies);
                    done();
                });
            });
            // delete thread after testing
            teardown(done => {
                this.timeout(20000);
                delete_board_thread(done, { _id: thread_id });
            });
        });
        suite('GET', function () {
            let thread_id = null;
            this.timeout(20000);
            setup(done => {
                this.timeout(20000);
                const request_body = {
                    board_id: test_board_id,
                    text: gen_rand_string(),
                    delete_password: gen_rand_string()
                };
                create_board_thread(done, request_body, function (created_thread_id) {
                    thread_id = created_thread_id;
                });
            });
            test(`GET THREADS OF BOARD`, function (done) {
                this.timeout(20000);
                const expected_status = 200;
                chai_module
                    .request(server_1.default)
                    .get(`/api/threads/${test_board_id}`)
                    .end((get_threads_error, response) => {
                    const { status: actual_status } = response;
                    const { threads: result_threads } = response.body;
                    const required_keys = [
                        'reported',
                        'replies',
                        '_id',
                        'board_id',
                        'text',
                        'bumped_on',
                        'created_on',
                        'updated_on'
                    ];
                    assert.equal(get_threads_error, null);
                    // make sure it has required keys
                    result_threads.forEach(thread => {
                        assert.hasAllKeys(thread, required_keys);
                    });
                    assert.equal(actual_status, expected_status);
                    assert.isArray(result_threads);
                    done();
                });
            });
            // delete thread after testing
            teardown(done => {
                this.timeout(20000);
                delete_board_thread(done, { _id: thread_id });
            });
        });
        suite('DELETE', function () {
            this.timeout(20000);
            let thread_id;
            let request_body;
            setup(done => {
                this.timeout(20000);
                request_body = {
                    board_id: test_board_id,
                    text: gen_rand_string(),
                    delete_password: gen_rand_string()
                };
                create_board_thread(done, request_body, function (created_thread_id) {
                    thread_id = created_thread_id;
                });
            });
            test(`DELETE A THREAD OF BOARD`, function (done) {
                this.timeout(20000);
                const expected_status = 200;
                const expected_text = 'success';
                chai_module
                    .request(server_1.default)
                    .delete(`/api/threads/${test_board_id}`)
                    // we reference request body delete password for authentication to succeed
                    .send({ thread_id, delete_password: request_body.delete_password })
                    .end((delete_thread_error, response) => {
                    assert.equal(delete_thread_error, null);
                    assert.equal(response.text, expected_text);
                    assert.equal(response.status, expected_status);
                    done();
                });
            });
        });
        suite('PUT', function () {
            this.timeout(20000);
            let thread_id;
            let request_body;
            setup(done => {
                this.timeout(20000);
                request_body = {
                    board_id: test_board_id,
                    text: gen_rand_string(),
                    delete_password: gen_rand_string()
                };
                create_board_thread(done, request_body, function (created_thread_id) {
                    thread_id = created_thread_id;
                    return;
                });
            });
            test('REPORT A THREAD OF A BOARD', function (done) {
                this.timeout(20000);
                const expected_status = 200;
                const expected_text = 'success';
                chai_module
                    .request(server_1.default)
                    .put(`/api/threads/${test_board_id}`)
                    .send({ thread_id })
                    .end((report_thread_error, response) => {
                    assert.equal(report_thread_error, null);
                    assert.equal(response.text, expected_text);
                    assert.equal(response.status, expected_status);
                    done();
                });
            });
            teardown(done => {
                this.timeout(20000);
                delete_board_thread(done, { _id: thread_id });
            });
        });
    });
    suite('API ROUTING FOR /api/replies/:board', function () {
        suite('POST', function () { });
        suite('GET', function () { });
        suite('PUT', function () { });
        suite('DELETE', function () { });
    });
    // delete board 'general'
    suiteTeardown(done => {
        console.log('suite teardown');
        delete_test_board(done, { _id: test_board_id });
    });
});
//# sourceMappingURL=2_functional-tests.js.map