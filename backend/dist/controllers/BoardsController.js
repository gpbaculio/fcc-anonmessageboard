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
class BoardsController {
    constructor() {
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
            console.log('updateBoardName 1');
            yield Board_1.default.findById(board_id, function (error, board) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        res.status(400).send(error);
                    console.log('updateBoardName 2');
                    const correctPassword = yield board.authenticate(delete_password);
                    if (!correctPassword)
                        res.status(400).send('Incorrect Delete Password');
                    else {
                        board.name = board_name;
                        board.save(function (error) {
                            if (error)
                                res.status(400).send(error);
                            console.log('updateBoardName 3');
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
        this.getBoards = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            yield Board_1.default.find({}, null, {
                sort: '-createdAt',
                limit: 9,
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