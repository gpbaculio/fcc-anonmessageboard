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
class BoardsController {
    constructor() {
        this.createBoard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            yield Board_1.default.findOne({ name }, (error, board) => __awaiter(this, void 0, void 0, function* () {
                if (error)
                    res.status(400).send(error);
                if (!board) {
                    yield Board_1.default.create({ name }, (error, newBoard) => {
                        if (error)
                            res.status(400).send(error);
                        else
                            res.status(200).json({ board: newBoard });
                    });
                }
                else
                    res.status(400).send('Board already exists');
            }));
        });
        this.getBoards = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            yield Board_1.default.find({}, null, { sort: '-createdAt', limit: 9, populate: 'threads' }, (error, boards) => {
                if (error)
                    res.status(400).send(error);
                res.status(200).json({ boards });
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
                                    else
                                        res.redirect(`/b/${board_id}`);
                                });
                            });
                        });
                    });
                });
            });
        };
        this.getThreads = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { boardId } = req.params;
            yield Thread_1.default.find({ boardId }, null, { sort: '-createdAt', limit: 10 }, (error, threads) => {
                if (error)
                    res.status(400).send(error);
                else
                    res.status(200).json({ threads });
            });
        });
        this.deleteThread = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { boardId } = req.params;
            const { thread_id, delete_password } = req.body;
            yield Thread_1.default.findOne({ boardId, _id: thread_id }, (error, thread) => __awaiter(this, void 0, void 0, function* () {
                if (error)
                    res.status(400).send(error);
                const correctPassword = yield thread.authenticate(delete_password);
                if (!correctPassword)
                    res.status(400).send('incorrect password');
                else
                    yield Thread_1.default.findOneAndRemove({ _id: thread._id }, (error, thread) => {
                        if (error)
                            res.status(400).send(error);
                        console.log('findOneandRemove THread ', thread);
                        res.status(200).send('success');
                    });
            }));
            // return Book.findOneAndRemove({ _id: bookDbId })
        });
    }
}
exports.default = BoardsController;
//# sourceMappingURL=BoardsController.js.map