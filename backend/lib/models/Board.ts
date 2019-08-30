import * as mongoose from 'mongoose';
import { ThreadDocument } from './Thread';

export interface BoardDocument extends mongoose.Document {
  name: string;
  threads: ThreadDocument[];
  _doc: BoardDocument;
}

const BoardSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    versionKey: false
  }
);

export default mongoose.model<BoardDocument>('Board', BoardSchema);
