import { BasePolicy } from './BasePolicy';
import { FeedPermission } from '../../config/permissions/feed';

export class FeedPolicy extends BasePolicy {
  static create(user: any): boolean {
    const isUserVerified = user.verificationStatus === 'verified' || user.isVerified || user.role === 'admin' || user.role === 'alumni' || user.role === 'student';
    return this.hasPermission(user, FeedPermission.FEED_CREATE) && isUserVerified;
  }

  static update(user: any, post: any): boolean {
    if (this.isAdmin(user)) return true;
    return this.hasPermission(user, FeedPermission.FEED_EDIT_OWN) && this.isOwner(user, post);
  }

  static delete(user: any, post: any): boolean {
    if (this.hasPermission(user, FeedPermission.FEED_DELETE_ANY)) return true;
    return this.hasPermission(user, FeedPermission.FEED_DELETE_OWN) && this.isOwner(user, post);
  }

  static comment(user: any, post: any): boolean {
    if (user.isBanned || !user.isActive) return false;
    if (post.deletedAt || !post.isPublished) return false;
    return this.hasPermission(user, FeedPermission.COMMENT_CREATE);
  }

  static deleteComment(user: any, comment: any): boolean {
    if (this.hasPermission(user, FeedPermission.COMMENT_DELETE_ANY)) return true;
    return this.hasPermission(user, FeedPermission.COMMENT_DELETE_OWN) && this.isOwner(user, comment);
  }
}
