import { ROLES_PERMISSIONS } from '../config/roles';
import { JobPolicy } from './policies/JobPolicy';
import { EventPolicy } from './policies/EventPolicy';
import { FeedPolicy } from './policies/FeedPolicy';
import { ResearchPolicy } from './policies/ResearchPolicy';
import { StoryPolicy } from './policies/StoryPolicy';
import { StartupPolicy } from './policies/StartupPolicy';
import { MentorshipPolicy } from './policies/MentorshipPolicy';
import { MessagingPolicy } from './policies/MessagingPolicy';
import { ReportPolicy } from './policies/ReportPolicy';
import FeatureFlag from '../models/FeatureFlag';

export class AuthorizationEngine {
  /**
   * Evaluates if a user can perform an action on a resource given a context.
   */
  static async can(user: any, action: string, resource?: any, context?: any): Promise<boolean> {
    if (!user) return false;
    
    // Admin bypass: If admin role, always return true (handles '*' wildcard)
    if (user.role === 'admin') return true;

    // Feature Flag Check:
    // Extract module name from action namespace (e.g., 'job:create' -> 'jobs')
    const namespace = action.split(':')[0];
    const flagKey = this.getFeatureFlagKey(namespace);
    if (flagKey) {
      const isFeatureEnabled = await this.checkFeatureFlag(flagKey);
      if (!isFeatureEnabled) return false;
    }

    // Suspend check: Suspended/banned users cannot perform mutating/sensitive actions
    if (user.isBanned || !user.isActive || user.verificationStatus === 'suspended') {
      return false;
    }

    // Policy routing based on action namespace
    switch (namespace) {
      case 'job':
        return this.resolveJobAction(user, action, resource);
      case 'event':
        return this.resolveEventAction(user, action, resource);
      case 'feed':
      case 'comment':
        return this.resolveFeedAction(user, action, resource);
      case 'research':
        return this.resolveResearchAction(user, action, resource);
      case 'story':
        return this.resolveStoryAction(user, action, resource);
      case 'startup':
        return this.resolveStartupAction(user, action, resource);
      case 'mentor':
        return this.resolveMentorshipAction(user, action, resource);
      case 'message':
        return await this.resolveMessagingAction(user, action, resource);
      case 'report':
        return this.resolveReportAction(user, action, resource);
      default:
        // Fallback: simple permission string checking
        const permissions = ROLES_PERMISSIONS[user.role] || [];
        return permissions.includes(action);
    }
  }

  private static getFeatureFlagKey(namespace: string): string | null {
    const map: Record<string, string> = {
      job: 'jobs',
      event: 'events',
      feed: 'feed',
      comment: 'feed',
      research: 'research',
      story: 'stories',
      startup: 'startups',
      mentor: 'mentorship',
      message: 'networking',
    };
    return map[namespace] || null;
  }

  private static async checkFeatureFlag(key: string): Promise<boolean> {
    try {
      const flag = await FeatureFlag.findOne({ key });
      if (flag) return flag.isEnabled;
      return true; // Default to enabled if flag doesn't exist
    } catch {
      return true;
    }
  }

  private static resolveJobAction(user: any, action: string, resource?: any): boolean {
    if (action === 'job:create') return JobPolicy.create(user);
    if (action === 'job:apply') return JobPolicy.apply(user, resource);
    if (action === 'job:close_own' || action === 'job:close') return JobPolicy.close(user, resource);
    if (action === 'job:edit_own' || action === 'job:update') return JobPolicy.update(user, resource);
    if (action === 'job:delete_own' || action === 'job:delete') return JobPolicy.delete(user, resource);
    return false;
  }

  private static resolveEventAction(user: any, action: string, resource?: any): boolean {
    if (action === 'event:create') return EventPolicy.create(user);
    if (action === 'event:register') return EventPolicy.register(user, resource);
    if (action === 'event:edit_own' || action === 'event:update') return EventPolicy.update(user, resource);
    if (action === 'event:delete_own' || action === 'event:delete') return EventPolicy.delete(user, resource);
    return false;
  }

  private static resolveFeedAction(user: any, action: string, resource?: any): boolean {
    if (action === 'feed:create') return FeedPolicy.create(user);
    if (action === 'feed:edit_own' || action === 'feed:update') return FeedPolicy.update(user, resource);
    if (action === 'feed:delete_own' || action === 'feed:delete') return FeedPolicy.delete(user, resource);
    if (action === 'comment:create') return FeedPolicy.comment(user, resource);
    if (action === 'comment:delete_own' || action === 'comment:delete') return FeedPolicy.deleteComment(user, resource);
    return false;
  }

  private static resolveResearchAction(user: any, action: string, resource?: any): boolean {
    if (action === 'research:create') return ResearchPolicy.create(user);
    if (action === 'research:apply') return ResearchPolicy.apply(user, resource);
    if (action === 'research:approve') return ResearchPolicy.approve(user, resource);
    if (action === 'research:edit_own' || action === 'research:update') return ResearchPolicy.update(user, resource);
    if (action === 'research:delete_own' || action === 'research:delete') return ResearchPolicy.delete(user, resource);
    return false;
  }

  private static resolveStoryAction(user: any, action: string, resource?: any): boolean {
    if (action === 'story:create') return StoryPolicy.create(user);
    if (action === 'story:approve') return StoryPolicy.approve(user);
    if (action === 'story:edit_own' || action === 'story:update') return StoryPolicy.update(user, resource);
    if (action === 'story:delete_own' || action === 'story:delete') return StoryPolicy.delete(user, resource);
    return false;
  }

  private static resolveStartupAction(user: any, action: string, resource?: any): boolean {
    if (action === 'startup:create') return StartupPolicy.create(user);
    if (action === 'startup:edit_own' || action === 'startup:update') return StartupPolicy.update(user, resource);
    if (action === 'startup:delete_own' || action === 'startup:delete') return StartupPolicy.delete(user, resource);
    return false;
  }

  private static resolveMentorshipAction(user: any, action: string, resource?: any): boolean {
    if (action === 'mentor:enable') return MentorshipPolicy.enable(user);
    if (action === 'mentor:accept') return MentorshipPolicy.accept(user, resource);
    if (action === 'mentor:reject') return MentorshipPolicy.reject(user, resource);
    if (action === 'mentor:manage') return MentorshipPolicy.manage(user, resource);
    return false;
  }

  private static async resolveMessagingAction(user: any, action: string, resource?: any): Promise<boolean> {
    if (action === 'message:start') return await MessagingPolicy.start(user, resource);
    if (action === 'message:send') return MessagingPolicy.send(user, resource);
    return false;
  }

  private static resolveReportAction(user: any, action: string, resource?: any): boolean {
    if (action === 'report:create') return ReportPolicy.create(user);
    if (action === 'report:review') return ReportPolicy.review(user);
    return false;
  }
}
