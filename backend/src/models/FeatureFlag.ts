import mongoose, { Document, Schema } from 'mongoose';

export interface IFeatureFlag extends Document {
  name: string;
  key: string;
  isEnabled: boolean;
  description: string;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureFlagSchema = new Schema<IFeatureFlag>(
  {
    name: { type: String, required: true, unique: true },
    key: { type: String, required: true, unique: true, index: true },
    isEnabled: { type: Boolean, default: true },
    description: String,
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFeatureFlag>('FeatureFlag', FeatureFlagSchema);
