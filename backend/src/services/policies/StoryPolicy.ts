import { BasePolicy } from './BasePolicy';
import { StoryPermission } from '../../config/permissions/stories';

export class StoryPolicy extends BasePolicy {
  static create(user: any): boolean {
    return this.hasPermission(user, StoryPermission.STORY_CREATE) && user.verificationStatus === 'verified';
  }

  static update(user: any, story: any): boolean {
    if (this.hasPermission(user, StoryPermission.STORY_EDIT_ANY)) return true;
    return this.hasPermission(user, StoryPermission.STORY_EDIT_OWN) && this.isOwner(user, story);
  }

  static delete(user: any, story: any): boolean {
    if (this.hasPermission(user, StoryPermission.STORY_DELETE_ANY)) return true;
    return this.hasPermission(user, StoryPermission.STORY_DELETE_OWN) && this.isOwner(user, story);
  }

  static approve(user: any): boolean {
    return this.hasPermission(user, StoryPermission.STORY_APPROVE);
  }
}
