import { BasePolicy } from './BasePolicy';
import { ReportPermission } from '../../config/permissions/reports';

export class ReportPolicy extends BasePolicy {
  static create(user: any): boolean {
    return !!user; // Any authenticated user can file reports
  }

  static review(user: any): boolean {
    return this.hasPermission(user, ReportPermission.REPORT_REVIEW);
  }
}
