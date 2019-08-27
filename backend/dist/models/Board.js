"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ]
}, {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    versionKey: false
});
exports.default = mongoose.model('Board', BoardSchema);
//# sourceMappingURL=Board.js.map