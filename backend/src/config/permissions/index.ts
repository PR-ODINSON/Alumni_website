import { UserPermission } from './users';
import { FeedPermission } from './feed';
import { JobPermission } from './jobs';
import { EventPermission } from './events';
import { ResearchPermission } from './research';
import { StoryPermission } from './stories';
import { StartupPermission } from './startups';
import { ReportPermission } from './reports';
import { AnalyticsPermission } from './analytics';
import { AdminPermission } from './admin';
import { MentorshipPermission } from './mentorship';
import { NotificationPermission } from './notifications';

export * from './users';
export * from './feed';
export * from './jobs';
export * from './events';
export * from './research';
export * from './stories';
export * from './startups';
export * from './reports';
export * from './analytics';
export * from './admin';
export * from './mentorship';
export * from './notifications';

export type Permission =
  | UserPermission
  | FeedPermission
  | JobPermission
  | EventPermission
  | ResearchPermission
  | StoryPermission
  | StartupPermission
  | ReportPermission
  | AnalyticsPermission
  | AdminPermission
  | MentorshipPermission
  | NotificationPermission;

export const ALL_PERMISSIONS: Permission[] = [
  ...Object.values(UserPermission),
  ...Object.values(FeedPermission),
  ...Object.values(JobPermission),
  ...Object.values(EventPermission),
  ...Object.values(ResearchPermission),
  ...Object.values(StoryPermission),
  ...Object.values(StartupPermission),
  ...Object.values(ReportPermission),
  ...Object.values(AnalyticsPermission),
  ...Object.values(AdminPermission),
  ...Object.values(MentorshipPermission),
  ...Object.values(NotificationPermission),
];
