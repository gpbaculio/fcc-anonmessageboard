"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ReplySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    thread_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    },
    delete_password: {
        type: String,
        hidden: true
    },
    reported: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    versionKey: false
});
ReplySchema.pre('save', function (next) {
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
ReplySchema.methods = {
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
exports.default = mongoose.model('Reply', ReplySchema);
//# sourceMappingURL=Reply.js.map