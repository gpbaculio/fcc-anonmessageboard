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