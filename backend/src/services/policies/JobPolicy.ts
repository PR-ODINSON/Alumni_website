import { BasePolicy } from './BasePolicy';
import { JobPermission } from '../../config/permissions/jobs';

export class JobPolicy extends BasePolicy {
  static create(user: any): boolean {
    return this.hasPermission(user, JobPermission.JOB_CREATE) && user.verificationStatus === 'verified';
  }

  static update(user: any, job: any): boolean {
    if (this.hasPermission(user, JobPermission.JOB_EDIT_ANY)) return true;
    return this.hasPermission(user, JobPermission.JOB_EDIT_OWN) && this.isOwner(user, job);
  }

  static delete(user: any, job: any): boolean {
    if (this.hasPermission(user, JobPermission.JOB_DELETE_ANY)) return true;
    return this.hasPermission(user, JobPermission.JOB_DELETE_OWN) && this.isOwner(user, job);
  }

  static close(user: any, job: any): boolean {
    if (this.hasPermission(user, JobPermission.JOB_EDIT_ANY)) return true;
    return this.hasPermission(user, JobPermission.JOB_CLOSE_OWN) && this.isOwner(user, job);
  }

  static apply(user: any, job: any): boolean {
    if (user.verificationStatus !== 'verified') return false;
    if (!this.hasPermission(user, JobPermission.JOB_APPLY)) return false;
    // ABAC Checks
    if (job.status === 'closed' || job.status === 'archived' || job.deletedAt) return false;
    if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) return false;
    // Check if already applied
    const alreadyApplied = job.applicants?.some((app: any) => app.user.toString() === user._id.toString());
    if (alreadyApplied) return false;
    return true;
  }
}
