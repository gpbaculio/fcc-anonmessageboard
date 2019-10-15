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
class ThreadsController {
    constructor() {
        this.report_thread = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { board_id } = req.params;
            const { thread_id } = req.body;
            yield Thread_1.default.findOne({ _id: thread_id, board_id }, '-delete_password', {
                populate: [
                    {
                        path: 'replies',
                        model: 'Reply',
                        select: '-delete_password'
                    }
                ]
            }, function (error, thread) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        res.status(400).send(error);
                    // toggle reported status
                    thread.reported = !thread.reported;
                    thread.save(function (error) {
                        if (error)
                            res.status(400).send(error);
                        res.status(200).send('success');
                    });
                });
            });
        });
        this.deleteThread = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { thread_id } = req.params;
            const { delete_password } = req.body;
            yield Thread_1.default.findById(thread_id, function (error, thread) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        res.status(400).send(error);
                    // check if password is correct
                    const correctPassword = yield thread.authenticate(delete_password);
                    if (correctPassword) {
                        yield Thread_1.default.findOneAndRemove({ _id: thread_id }, function (error, deletedThread) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (error)
                                    res.status(400).send(error);
                                // if thread has replies
                                if (deletedThread.replies.length) {
                                    // delete all replies
                                    yield Reply_1.default.deleteMany({
                                        thread_id: deletedThread._id
                                    }, function (error) {
                                        return __awaiter(this, void 0, void 0, function* () {
                                            if (error)
                                                res.status(400).send(error);
                                            else
                                                res.json({ deletedThread });
                                        });
                                    });
                                }
                                else
                                    res.json({ deletedThread });
                            });
                        });
                    }
                    else
                        res.status(400).send('Incorrect Delete Password');
                });
            });
        });
        this.update_thread = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { text, delete_password, report_thread } = req.body;
            const { thread_id } = req.params;
            yield Thread_1.default.findById(thread_id, null, {
                populate: [
                    {
                        path: 'replies',
                        model: 'Reply',
                        select: '-delete_password'
                    }
                ]
            }, function (error, thread) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        res.status(400).send(error);
                    // check if correct password
                    const correctPassword = yield thread.authenticate(delete_password);
                    if (!correctPassword)
                        res.status(400).send('Incorrect Delete Password');
                    else {
                        thread.text = text;
                        thread.save(function (error) {
                            if (error)
                                res.status(400).send(error);
                            const parseThread = thread.toObject();
                            delete parseThread['delete_password'];
                            res.status(200).json({ thread: parseThread });
                        });
                    }
                });
            });
        });
        this.createThread = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const { board_id } = req.params;
                const { text, delete_password } = req.body;
                yield Thread_1.default.create({ board_id, text, delete_password }, function (error, thread) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error)
                            res.status(400).send(error);
                        yield Board_1.default.findById(board_id, function (err, board) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    return res.send(err);
                                board.threads.push(thread);
                                yield board.save(function (err) {
                                    if (err)
                                        return res.send(err);
                                    else {
                                        const parseThread = thread.toObject();
                                        delete parseThread['delete_password'];
                                        res.status(200).json({ thread: parseThread });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        };
        this.getThreads = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { board_id } = req.params;
            yield Thread_1.default.find({ board_id }, '-delete_password', {
                sort: '-createdAt',
                limit: 10,
                populate: [
                    {
                        path: 'threads',
                        model: 'Thread',
                        select: '-delete_password'
                    }
                ]
            }, (error, threads) => {
                console.log('threads controller getThreads', threads);
                if (error)
                    res.status(400).send(error);
                else
                    res.status(200).json({ threads });
            });
        });
        this.getThread = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const { thread_id } = req.params;
                yield Thread_1.default.findById(thread_id, '-delete_password', {
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
                }, function (error, thread) {
                    if (error)
                        res.status(400).send(error);
                    res.status(200).json({ thread });
                });
            });
        };
    }
}
exports.default = ThreadsController;
//# sourceMappingURL=ThreadsController.js.map