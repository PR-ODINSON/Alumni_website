import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  actor: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  previousValues?: any;
  newValues?: any;
  changedFields?: string[];
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    resourceId: { type: String, index: true },
    previousValues: { type: Schema.Types.Mixed },
    newValues: { type: Schema.Types.Mixed },
    changedFields: [String],
    ipAddress: String,
    userAgent: String,
    reason: String,
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

AuditLogSchema.index({ timestamp: -1 });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
