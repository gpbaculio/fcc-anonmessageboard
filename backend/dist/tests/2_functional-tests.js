"use strict";
/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chaiHttp = require('chai-http');
const chai_module = require('chai');
const server_1 = require("../server");
const db_test_helpers_1 = require("./db_test_helpers");
const db_test_helpers_2 = require("./db_test_helpers");
const assert = chai_module.assert;
chai_module.use(chaiHttp);
// create board and assign its' _id on test_board_id
// test_board_id will be used to delete the board after testing
suite('Functional Tests', function () {
    // need more time from response
    this.timeout(20000);
    let test_board_id;
    // generate simple random string for board name, thread text, reply text, delete password
    const gen_rand_string = () => Math.random()
        .toString(36)
        .substring(2);
    const threads_route = '/api/threads';
    // we need to create a board to create a thread, created board will be deleted after test on teardown
    suiteSetup(done => {
        this.timeout(20000);
        console.log('suite setup');
        db_test_helpers_2.create_test_board(done, {
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
                db_test_helpers_2.delete_board_thread(done, { _id: thread_id });
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
                db_test_helpers_2.create_board_thread(done, request_body, function (created_thread_id) {
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
                db_test_helpers_2.delete_board_thread(done, { _id: thread_id });
            });
        });
        suite('DELETE', function () {
            this.timeout(20000);
            let thread_id;
            let request_body;
            // create the thread to delete
            setup(done => {
                this.timeout(20000);
                request_body = {
                    board_id: test_board_id,
                    text: gen_rand_string(),
                    delete_password: gen_rand_string()
                };
                db_test_helpers_2.create_board_thread(done, request_body, function (created_thread_id) {
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
                db_test_helpers_2.create_board_thread(done, request_body, function (created_thread_id) {
                    thread_id = created_thread_id;
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
                db_test_helpers_2.delete_board_thread(done, { _id: thread_id });
            });
        });
    });
    suite('API ROUTING FOR /api/replies/:board', function () {
        suite('POST', function () {
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
                db_test_helpers_2.create_board_thread(done, request_body, function (created_thread_id) {
                    thread_id = created_thread_id;
                });
            });
            test('CREATE A REPLY ON A THREAD', function (done) {
                this.timeout(20000);
                const create_reply_args = {
                    thread_id,
                    text: gen_rand_string(),
                    delete_password: gen_rand_string()
                };
                const expected_status = 200;
                const reply_required_keys = [
                    'reported',
                    '_id',
                    'thread_id',
                    'text',
                    'created_on',
                    'updated_on'
                ];
                chai_module
                    .request(server_1.default)
                    .post(`/api/replies/${test_board_id}`)
                    .send(create_reply_args)
                    .end((create_reply_error, response) => {
                    const { reply } = response.body;
                    assert.equal(response.status, expected_status);
                    assert.equal(create_reply_error, null);
                    assert.equal(reply.text, create_reply_args.text);
                    assert.hasAllKeys(reply, reply_required_keys);
                    done();
                });
            });
            teardown(done => {
                this.timeout(20000);
                db_test_helpers_2.delete_board_thread(done, { _id: thread_id });
            });
        });
        suite('GET', function () { });
        suite('PUT', function () {
            this.timeout(20000);
            let thread_id;
            // we create and refer to this reply to report
            let reply_id;
            let create_reply_request_body;
            setup(done => {
                this.timeout(20000);
                db_test_helpers_2.create_board_thread(done, {
                    board_id: test_board_id,
                    text: gen_rand_string(),
                    delete_password: gen_rand_string()
                }, function (created_thread_id) {
                    thread_id = created_thread_id;
                    db_test_helpers_1.create_thread_reply(done, {
                        thread_id,
                        text: gen_rand_string(),
                        delete_password: gen_rand_string()
                    }, function (created_reply_id) {
                        reply_id = created_reply_id;
                    });
                }, { for_reply: true });
            });
            test('REPORT A REPLY ON A THREAD', function (done) {
                this.timeout(20000);
                const expected_status = 200;
                const expected_text = 'success';
                chai_module
                    .request(server_1.default)
                    .put(`/api/replies/${test_board_id}`)
                    .send({ thread_id, reply_id })
                    .end((report_reply_error, response) => {
                    assert.equal(report_reply_error, null);
                    assert.equal(response.status, expected_status);
                    assert.equal(response.text, expected_text);
                    done();
                });
            });
            teardown(done => {
                this.timeout(20000);
                db_test_helpers_2.delete_board_thread(done, { _id: thread_id });
            });
        });
        suite('DELETE', function () { });
    });
    // delete board 'general'
    suiteTeardown(done => {
        console.log('suite teardown');
        db_test_helpers_2.delete_test_board(done, { _id: test_board_id });
    });
});
//# sourceMappingURL=2_functional-tests.js.map