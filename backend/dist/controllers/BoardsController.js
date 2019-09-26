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
const mongoose = require("mongoose");
class BoardsController {
    constructor() {
        this.deleteBoard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { board_id } = req.params;
            const { delete_password } = req.body;
            yield Board_1.default.findById(board_id, function (error, board) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        res.status(400).send(error);
                    const correctPassword = yield board.authenticate(delete_password);
                    // if password is correct
                    if (correctPassword) {
                        yield Board_1.default.findOneAndRemove({ _id: board_id }, function (error, deletedBoard) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (error)
                                    res.status(400).send(error);
                                // check if board have threads then delete it all
                                if (deletedBoard.threads.length) {
                                    const deletedBoardThreadIds = deletedBoard.threads.map(th => mongoose.Types.ObjectId(th.id));
                                    yield Thread_1.default.deleteMany({
                                        board_id: deletedBoard._id
                                    }, function (error) {
                                        return __awaiter(this, void 0, void 0, function* () {
                                            if (error)
                                                res.status(400).send(error);
                                            else {
                                                // check if board have threads
                                                yield Reply_1.default.deleteMany({
                                                    thread_id: { $in: deletedBoardThreadIds }
                                                }, function (error) {
                                                    return __awaiter(this, void 0, void 0, function* () {
                                                        if (error)
                                                            res.status(400).send(error);
                                                        res.json({ deletedBoard });
                                                    });
                                                });
                                                res.json({ deletedBoard });
                                            }
                                        });
                                    });
                                }
                                else
                                    res.json({ deletedBoard });
                            });
                        });
                    }
                    else
                        res.status(400).send('Incorrect Delete Password');
                });
            });
        });
        this.createBoard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, delete_password } = req.body;
            yield Board_1.default.findOne({ name }, (error, board) => __awaiter(this, void 0, void 0, function* () {
                if (error)
                    res.status(400).send(error);
                if (!board) {
                    yield Board_1.default.create({ name, delete_password }, (error, newBoard) => {
                        if (error)
                            res.status(400).send(error);
                        else {
                            const parseBoard = newBoard.toObject();
                            delete parseBoard['delete_password'];
                            res.status(200).json({ board: parseBoard });
                        }
                    });
                }
                else
                    res.status(400).send('Board already exists');
            }));
        });
        this.updateBoardName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { board_name, delete_password } = req.body;
            const { board_id } = req.params;
            yield Board_1.default.findById(board_id, function (error, board) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        res.status(400).send(error);
                    const correctPassword = yield board.authenticate(delete_password);
                    if (!correctPassword)
                        res.status(400).send('Incorrect Delete Password');
                    else {
                        board.name = board_name;
                        board.save(function (error) {
                            if (error)
                                res.status(400).send(error);
                            const parseBoard = board.toObject();
                            delete parseBoard['delete_password'];
                            res.status(200).json({ board: parseBoard });
                        });
                    }
                });
            });
        });
        this.getBoard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { board_id } = req.params;
            yield Board_1.default.findById(board_id, null, {
                populate: {
                    path: 'threads',
                    model: 'Thread',
                    select: '-delete_password -reported',
                    populate: {
                        path: 'replies',
                        model: 'Reply',
                        select: '-delete_password -reported'
                    }
                }
            }, (error, board) => {
                if (error)
                    res.status(400).send(error);
                res.status(200).json({ board });
            });
        });
        this.getBoards = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // async ({ page, limit, searchText, userId }) => {
            //   const query = {}
            //   if (searchText !== undefined) {
            //     if (searchText === '') return []
            //     query.title = { $regex: `${searchText}`, $options: 'i' }
            //   }
            //   if (userId) query.userId = userId
            //   return Book.find(
            //     query,
            //     null,
            //     { skip: parseInt(page - 1) * parseInt(limit), limit: parseInt(limit) }
            //   ).populate({ path: 'userId', select: 'username profilePicture' })
            //     .sort('-createdAt');
            // }
            const { search_text, page, limit } = req.query;
            const query = {};
            if (search_text !== undefined)
                query.name = search_text;
            console.log('Number(page) - 1 * Number(limit) ', Number(page - 1) * Number(limit));
            yield Board_1.default.find({}, null, {
                skip: Number(page - 1) * Number(limit),
                limit: Number(limit),
                sort: '-createdAt',
                populate: {
                    path: 'threads',
                    model: 'Thread',
                    select: '-delete_password -reported',
                    populate: {
                        path: 'replies',
                        model: 'Reply',
                        select: '-delete_password -reported'
                    }
                }
            }, (error, boards) => {
                if (error)
                    res.status(400).send(error);
                res.status(200).json({ boards });
            });
        });
    }
}
exports.default = BoardsController;
//# sourceMappingURL=BoardsController.js.map