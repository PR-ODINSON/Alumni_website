import { BasePolicy } from './BasePolicy';
import Connection from '../../models/Connection';
import Mentorship from '../../models/Mentorship';
import Job from '../../models/Job';
import ResearchProject from '../../models/ResearchProject';

export class MessagingPolicy extends BasePolicy {
  /**
   * Asserts whether user can start a conversation with recipient
   */
  static async start(user: any, recipientId: string): Promise<boolean> {
    if (user.verificationStatus !== 'verified') return false;
    if (user._id.toString() === recipientId) return false;
    if (this.isAdmin(user)) return true;

    // 1. Check if accepted connection exists
    const connection = await Connection.findOne({
      $or: [
        { requester: user._id, recipient: recipientId },
        { requester: recipientId, recipient: user._id },
      ],
      status: 'accepted',
    });
    if (connection) return true;

    // 2. Check if active mentorship exists
    const mentorship = await Mentorship.findOne({
      $or: [
        { mentor: user._id, mentee: recipientId },
        { mentor: recipientId, mentee: user._id },
      ],
      status: 'active',
    });
    if (mentorship) return true;

    // 3. Check if job application relationship exists (recipient posted job, user applied; or vice-versa)
    const jobRelationship = await Job.findOne({
      $or: [
        { postedBy: recipientId, 'applicants.user': user._id },
        { postedBy: user._id, 'applicants.user': recipientId },
      ],
    });
    if (jobRelationship) return true;

    // 4. Check if research application relationship exists
    const researchRelationship = await ResearchProject.findOne({
      $or: [
        { pi: recipientId, 'applications.user': user._id },
        { pi: user._id, 'applications.user': recipientId },
        { coInvestigators: recipientId, 'applications.user': user._id },
        { coInvestigators: user._id, 'applications.user': recipientId },
      ],
    });
    if (researchRelationship) return true;

    return false;
  }

  static send(user: any, conversation: any): boolean {
    return conversation.participants?.some((p: any) => p.toString() === user._id.toString());
  }
}
