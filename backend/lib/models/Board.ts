import * as mongoose from 'mongoose';

export interface BoardDocument extends mongoose.Document {
  name: string;
  threadIds: string[];
}

const BoardSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<BoardDocument>('Board', BoardSchema);
