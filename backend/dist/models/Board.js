"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    delete_password: {
        type: String,
        hidden: true
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
BoardSchema.pre('save', function (next) {
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
BoardSchema.methods = {
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
exports.default = mongoose.model('Board', BoardSchema);
//# sourceMappingURL=Board.js.map