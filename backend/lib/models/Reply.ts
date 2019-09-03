import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface ReplyDocument extends mongoose.Document {
  text: string;
  thread_id: string;
  delete_password: string;
  encryptPassword: (delete_password: string) => Promise<string>;
  authenticate: (plainTextPassword: string) => boolean;
}

const ReplySchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    versionKey: false
  }
);

ReplySchema.pre<ReplyDocument>('save', function(next) {
  if (this.isModified('delete_password')) {
    this.encryptPassword(this.delete_password)
      .then(hash => {
        this.delete_password = hash;
        next();
      })
      .catch(err => next(err));
  } else return next();
});

ReplySchema.methods = {
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

export default mongoose.model<ReplyDocument>('Reply', ReplySchema);
