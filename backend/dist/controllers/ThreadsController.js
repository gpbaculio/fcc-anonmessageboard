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
class ThreadsController {
    constructor() {
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
            yield Thread_1.default.find({ boardId: board_id }, null, { sort: '-createdAt', limit: 10 }, (error, threads) => {
                if (error)
                    res.status(400).send(error);
                else
                    res.status(200).json({ threads });
            });
        });
        this.deleteThread = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { board_id } = req.params;
            const { thread_id, delete_password } = req.body;
            yield Thread_1.default.findOne({ boardId: board_id, _id: thread_id }, (error, thread) => __awaiter(this, void 0, void 0, function* () {
                if (error)
                    res.status(400).send(error);
                const correctPassword = yield thread.authenticate(delete_password);
                if (!correctPassword)
                    res.status(400).send('incorrect password');
                else
                    yield Thread_1.default.findOneAndRemove({ _id: thread._id }, (error, thread) => {
                        if (error)
                            res.status(400).send(error);
                        res.status(200).send('success');
                    });
            }));
        });
    }
}
exports.default = ThreadsController;
//# sourceMappingURL=ThreadsController.js.map