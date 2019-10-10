"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const chaiModule = require('chai');
const axios = require('axios');
const mongoose = require("mongoose");
const assert = chaiModule.assert;
const server_1 = require("../server");
chaiModule.use(chaiHttp);
// create board
const create_test_board = function (done, { name, delete_password }, call_back) {
    return __awaiter(this, void 0, void 0, function* () {
        // make sure board is non existing
        yield Board_1.default.findOne({ name }, function (error, board) {
            return __awaiter(this, void 0, void 0, function* () {
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
                    const new_board = new Board_1.default({ name, delete_password });
                    new_board
                        .save()
                        .then(function (rec) {
                        if (call_back)
                            call_back(new_board._id);
                        done();
                    })
                        .catch(function (err) {
                        console.error(err.message);
                        done();
                    });
                }
            });
        });
    });
};
// delete board
const delete_test_board = function (done, board_id_param) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Board_1.default.findOneAndDelete(board_id_param, function (error, deleted_board) {
            return __awaiter(this, void 0, void 0, function* () {
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
                    yield Thread_1.default.deleteMany({
                        board_id: deleted_board._id
                    }, function (error) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (error) {
                                console.error(error.message);
                                done();
                                return;
                            }
                            else {
                                // delete any replies associated with the thread
                                console.log('deleted threads associated with board id', deleted_board._id);
                                yield Reply_1.default.deleteMany({
                                    thread_id: { $in: deleted_board_thread_ids }
                                }, function (error) {
                                    return __awaiter(this, void 0, void 0, function* () {
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
                                });
                            }
                        });
                    });
                }
            });
        });
    });
};
const create_board_thread = function (done, { board_id, text, delete_password }, call_back) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Thread_1.default.create({ board_id, text, delete_password }, function (thread_error, thread) {
            return __awaiter(this, void 0, void 0, function* () {
                if (thread_error) {
                    console.error(thread_error.message);
                    done();
                }
                yield Board_1.default.findById(board_id, function (board_error, board) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (board_error) {
                            console.error(board_error.message);
                            done();
                        }
                        // push created thread on board and save
                        board.threads.push(thread);
                        yield board.save(function (board_save_error) {
                            if (board_save_error) {
                                console.error(board_save_error.message);
                                done();
                            }
                            else {
                                if (call_back)
                                    call_back(thread._id);
                                done();
                            }
                        });
                    });
                });
            });
        });
    });
};
suite('Functional Tests', function () {
    // need more time from response
    this.timeout(10000);
    // generate simple random string for board name, thread text, reply text, delete password
    const gen_rand_string = () => Math.random()
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
        create_test_board(done, {
            name: gen_rand_string(),
            delete_password: gen_rand_string()
        }, function (board_id) {
            test_board_id = board_id;
            return;
        });
    });
    suite(`API ROUTING FOR ${threads_route}/:board_id`, function () {
        this.timeout(10000);
        suite('POST', function () {
            this.timeout(10000);
            test(`CREATE NEW THREAD ON BOARD`, function (done) {
                chaiModule
                    .request(server_1.default)
                    .post(`${threads_route}/${test_board_id}`)
                    .send({
                    text: gen_rand_string(),
                    delete_password: gen_rand_string()
                })
                    .end(function (create_thread_error, res) {
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
        suite('GET', function () { });
        suite('DELETE', function () { });
        suite('PUT', function () { });
    });
    suite('API ROUTING FOR /api/replies/:board', function () {
        suite('POST', function () { });
        suite('GET', function () { });
        suite('PUT', function () { });
        suite('DELETE', function () { });
    });
});
//# sourceMappingURL=2_functional-tests.js.map