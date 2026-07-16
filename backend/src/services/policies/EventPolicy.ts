import { BasePolicy } from './BasePolicy';
import { EventPermission } from '../../config/permissions/events';

export class EventPolicy extends BasePolicy {
  static create(user: any): boolean {
    return this.hasPermission(user, EventPermission.EVENT_CREATE) && user.verificationStatus === 'verified';
  }

  static update(user: any, event: any): boolean {
    if (this.hasPermission(user, EventPermission.EVENT_EDIT_ANY)) return true;
    const isCoOrganizer = event.coOrganizers?.some((co: any) => co.toString() === user._id.toString());
    return this.hasPermission(user, EventPermission.EVENT_EDIT_OWN) && (this.isOwner(user, event) || isCoOrganizer);
  }

  static delete(user: any, event: any): boolean {
    if (this.hasPermission(user, EventPermission.EVENT_DELETE_ANY)) return true;
    return this.hasPermission(user, EventPermission.EVENT_DELETE_OWN) && this.isOwner(user, event);
  }

  static register(user: any, event: any): boolean {
    if (user.verificationStatus !== 'verified') return false;
    if (!this.hasPermission(user, EventPermission.EVENT_REGISTER)) return false;
    if (event.status === 'cancelled' || event.status === 'completed' || event.deletedAt) return false;
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) return false;
    if (event.maxAttendees && event.registeredCount >= event.maxAttendees) return false;
    
    // Check if already registered
    const alreadyRegistered = event.registrations?.some(
      (reg: any) => reg.user.toString() === user._id.toString() && reg.status !== 'cancelled'
    );
    if (alreadyRegistered) return false;
    return true;
  }
}
