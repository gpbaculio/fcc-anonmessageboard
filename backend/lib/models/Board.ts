import * as mongoose from 'mongoose';
import { ThreadDocument } from './Thread';
import * as bcrypt from 'bcryptjs';

export interface BoardDocument extends mongoose.Document {
  name: string;
  threads: ThreadDocument[];
  _doc: BoardDocument;
  delete_password: string;
  encryptPassword: (delete_password: string) => Promise<string>;
  authenticate: (plainTextPassword: string) => boolean;
}

const BoardSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    versionKey: false
  }
);

BoardSchema.pre<BoardDocument>('save', function(next) {
  if (this.isModified('delete_password')) {
    this.encryptPassword(this.delete_password)
      .then(hash => {
        this.delete_password = hash;
        next();
      })
      .catch(err => next(err));
  } else return next();
});

BoardSchema.methods = {
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

export default mongoose.model<BoardDocument>('Board', BoardSchema);
