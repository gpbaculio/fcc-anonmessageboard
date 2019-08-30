"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ThreadSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    board_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    },
    delete_password: {
        type: String,
        hidden: true
    },
    reported: {
        type: Boolean,
        required: false,
        default: false
    },
    bumped_on: {
        type: Date,
        required: false,
        default: Date.now
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ]
}, {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    versionKey: false
});
ThreadSchema.pre('save', function (next) {
    if (this.isModified('delete_password')) {
        this.encryptPassword(this.delete_password)
            .then(hash => {
            this.delete_password = hash;
            next();
        })
            .catch(err => next(err));
    }
    else
        return next();
});
ThreadSchema.methods = {
    authenticate(plainTextPassword) {
        try {
            return bcrypt.compare(plainTextPassword, this.delete_password);
        }
        catch (err) {
            return false;
        }
    },
    encryptPassword(password) {
        return bcrypt.hash(password, 8);
    }
};
exports.default = mongoose.model('Thread', ThreadSchema);
//# sourceMappingURL=Thread.js.map