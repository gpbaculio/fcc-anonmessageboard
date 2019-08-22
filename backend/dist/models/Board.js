"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    threadIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ]
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose.model('Board', BoardSchema);
//# sourceMappingURL=Board.js.map