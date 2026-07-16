import { BasePolicy } from './BasePolicy';
import { StartupPermission } from '../../config/permissions/startups';

export class StartupPolicy extends BasePolicy {
  static create(user: any): boolean {
    return this.hasPermission(user, StartupPermission.STARTUP_CREATE) && user.verificationStatus === 'verified';
  }

  static update(user: any, startup: any): boolean {
    if (this.hasPermission(user, StartupPermission.STARTUP_EDIT_ANY)) return true;
    return this.hasPermission(user, StartupPermission.STARTUP_EDIT_OWN) && this.isOwner(user, startup);
  }

  static delete(user: any, startup: any): boolean {
    if (this.hasPermission(user, StartupPermission.STARTUP_DELETE_ANY)) return true;
    return this.hasPermission(user, StartupPermission.STARTUP_DELETE_OWN) && this.isOwner(user, startup);
  }
}
