import { BasePolicy } from './BasePolicy';
import { MentorshipPermission } from '../../config/permissions/mentorship';

export class MentorshipPolicy extends BasePolicy {
  static enable(user: any): boolean {
    return this.hasPermission(user, MentorshipPermission.MENTOR_ENABLE) && user.verificationStatus === 'verified';
  }

  static accept(user: any, mentorship: any): boolean {
    if (user.verificationStatus !== 'verified') return false;
    const isMentor = mentorship.mentor.toString() === user._id.toString();
    return this.hasPermission(user, MentorshipPermission.MENTOR_ACCEPT) && isMentor;
  }

  static reject(user: any, mentorship: any): boolean {
    if (user.verificationStatus !== 'verified') return false;
    const isMentor = mentorship.mentor.toString() === user._id.toString();
    return this.hasPermission(user, MentorshipPermission.MENTOR_REJECT) && isMentor;
  }

  static manage(user: any, mentorship: any): boolean {
    if (this.isAdmin(user)) return true;
    const isParticipant =
      mentorship.mentor.toString() === user._id.toString() ||
      mentorship.mentee.toString() === user._id.toString();
    return this.hasPermission(user, MentorshipPermission.MENTOR_MANAGE) && isParticipant;
  }
}
