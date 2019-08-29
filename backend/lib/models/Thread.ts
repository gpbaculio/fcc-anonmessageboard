import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface ThreadDocument extends mongoose.Document {
  text: string;
  board_id: string;
  delete_password: string;
  bumped_on: Date;
  replies: string[];
  encryptPassword: (delete_password: string) => Promise<string>;
  authenticate: (plainTextPassword: string) => boolean;
}

const ThreadSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    versionKey: false
  }
);

ThreadSchema.pre<ThreadDocument>('save', function(next) {
  if (this.isModified('delete_password')) {
    this.encryptPassword(this.delete_password)
      .then(hash => {
        this.delete_password = hash;
        next();
      })
      .catch(err => next(err));
  } else return next();
});

ThreadSchema.methods = {
  authenticate(plainTextPassword: string) {
    try {
      return bcrypt.compare(plainTextPassword, this.delete_password);
    } catch (err) {
      return false;
    }
  },
  encryptPassword(password: string) {
    return bcrypt.hash(password, 8);
  }
};

export default mongoose.model<ThreadDocument>('Thread', ThreadSchema);
