import mongoose, { Document, Schema } from 'mongoose';

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface IConnection extends Document {
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: ConnectionStatus;
  message?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema = new Schema<IConnection>(
  {
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'blocked'],
      default: 'pending',
    },
    message: { type: String, maxlength: 300 },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });
ConnectionSchema.index({ requester: 1, status: 1 });
ConnectionSchema.index({ recipient: 1, status: 1 });

export default mongoose.model<IConnection>('Connection', ConnectionSchema);
