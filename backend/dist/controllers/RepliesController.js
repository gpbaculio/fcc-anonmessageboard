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
const Reply_1 = require("../models/Reply");
const Thread_1 = require("../models/Thread");
class RepliesController {
    constructor() {
        this.deleteReply = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { reply_id } = req.params;
            const { delete_password } = req.body;
            yield Reply_1.default.findById(reply_id, function (error, reply) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        res.status(400).send(error);
                    // check if password is correct
                    const correctPassword = yield reply.authenticate(delete_password);
                    if (correctPassword) {
                        yield Reply_1.default.findOneAndRemove({ _id: reply_id }, function (error, deletedReply) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (error)
                                    res.status(400).send(error);
                                // a reply will always have thread
                                else
                                    res.json({ deletedReply });
                            });
                        });
                    }
                    else
                        res.status(400).send('Incorrect Delete Password');
                });
            });
        });
        this.createReply = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const { board_id } = req.params;
                const { thread_id, text, delete_password } = req.body;
                yield Reply_1.default.create({ thread_id, text, delete_password }, function (error, reply) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error)
                            return res.status(400).send(error);
                        else
                            yield Thread_1.default.findOne({ board_id, _id: thread_id }, function (error, thread) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    if (error)
                                        res.status(400).send(error);
                                    thread.bumped_on = new Date();
                                    thread.replies.push(reply);
                                    thread.save(function (error) {
                                        if (error)
                                            res.status(400).send(error);
                                        return res.status(200).json({ reply });
                                    });
                                });
                            });
                    });
                });
            });
        };
        this.updateReplyText = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const { reply_id } = req.params;
                const { text, delete_password } = req.body;
                yield Reply_1.default.findById(reply_id, function (error, reply) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error)
                            res.status(400).send(error);
                        // check if password is correct
                        const correctPassword = yield reply.authenticate(delete_password);
                        if (correctPassword) {
                            reply.text = text;
                            reply.save(function (error) {
                                if (error)
                                    res.status(400).send(error);
                                const parseReply = reply.toObject();
                                delete parseReply['delete_password'];
                                res.status(200).json({ reply: parseReply });
                            });
                        }
                        else
                            res.status(400).send('Incorrect Delete Password');
                    });
                });
            });
        };
    }
}
exports.default = RepliesController;
//# sourceMappingURL=RepliesController.js.map