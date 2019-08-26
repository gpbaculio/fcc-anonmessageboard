import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface ThreadDocument extends mongoose.Document {
  text: string;
  boardId: string;
  delete_password: string;
  encryptPassword: (delete_password: string) => Promise<string>;
  authenticate: (plainTextPassword: string) => boolean;
}

const ThreadSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board'
    },
    delete_password: {
      type: String,
      hidden: true
    }
  },
  {
    timestamps: true,
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
      console.log('this ', this.delete_password);
      console.log('plainTextPassword ', plainTextPassword);
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
