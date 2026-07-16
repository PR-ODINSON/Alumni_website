import AuditLog from '../models/AuditLog';

interface ILogAuditParams {
  actor: string;
  action: string;
  resource: string;
  resourceId?: string;
  previousValues?: any;
  newValues?: any;
  changedFields?: string[];
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export const logAudit = async (params: ILogAuditParams): Promise<void> => {
  try {
    await AuditLog.create({
      actor: params.actor,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      previousValues: params.previousValues,
      newValues: params.newValues,
      changedFields: params.changedFields,
      reason: params.reason,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  } catch (err) {
    console.error('Audit Logging failed:', err);
  }
};
