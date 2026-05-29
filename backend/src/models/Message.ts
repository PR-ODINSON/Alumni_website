import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  attachment?: {
    url: string;
    publicId: string;
    name: string;
    type: string;
    size: number;
  };
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  unreadCounts: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 5000 },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'system'],
      default: 'text',
    },
    attachment: {
      url: String,
      publicId: String,
      name: String,
      type: String,
      size: Number,
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    lastMessageAt: { type: Date },
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    groupAvatar: { type: String },
    unreadCounts: { type: Map, of: Number, default: new Map() },
  },
  { timestamps: true }
);

MessageSchema.index({ conversation: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
