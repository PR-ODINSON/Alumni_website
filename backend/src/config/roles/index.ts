import { Permission } from '../permissions';
import { UserPermission } from '../permissions/users';
import { FeedPermission } from '../permissions/feed';
import { JobPermission } from '../permissions/jobs';
import { EventPermission } from '../permissions/events';
import { ResearchPermission } from '../permissions/research';
import { StoryPermission } from '../permissions/stories';
import { StartupPermission } from '../permissions/startups';
import { ReportPermission } from '../permissions/reports';
import { AnalyticsPermission } from '../permissions/analytics';
import { MentorshipPermission } from '../permissions/mentorship';
import { NotificationPermission } from '../permissions/notifications';

export const GUEST_PERMISSIONS: Permission[] = [];

export const STUDENT_PERMISSIONS: Permission[] = [
  FeedPermission.FEED_CREATE,
  FeedPermission.FEED_EDIT_OWN,
  FeedPermission.FEED_DELETE_OWN,
  FeedPermission.COMMENT_CREATE,
  FeedPermission.COMMENT_DELETE_OWN,
  JobPermission.JOB_APPLY,
  EventPermission.EVENT_REGISTER,
  ResearchPermission.RESEARCH_APPLY,
  AnalyticsPermission.ANALYTICS_VIEW_SELF,
  NotificationPermission.NOTIFICATION_READ,
  NotificationPermission.NOTIFICATION_DELETE,
  ReportPermission.REPORT_CREATE,
];

export const ALUMNI_PERMISSIONS: Permission[] = [
  ...STUDENT_PERMISSIONS,
  JobPermission.JOB_CREATE,
  JobPermission.JOB_EDIT_OWN,
  JobPermission.JOB_DELETE_OWN,
  JobPermission.JOB_CLOSE_OWN,
  EventPermission.EVENT_CREATE,
  EventPermission.EVENT_EDIT_OWN,
  EventPermission.EVENT_DELETE_OWN,
  StartupPermission.STARTUP_CREATE,
  StartupPermission.STARTUP_EDIT_OWN,
  StartupPermission.STARTUP_DELETE_OWN,
  StoryPermission.STORY_CREATE,
  StoryPermission.STORY_EDIT_OWN,
  StoryPermission.STORY_DELETE_OWN,
  MentorshipPermission.MENTOR_ENABLE,
  MentorshipPermission.MENTOR_ACCEPT,
  MentorshipPermission.MENTOR_REJECT,
  MentorshipPermission.MENTOR_MANAGE,
  ResearchPermission.RESEARCH_CREATE,
];

export const FACULTY_PERMISSIONS: Permission[] = [
  ...STUDENT_PERMISSIONS,
  EventPermission.EVENT_CREATE,
  EventPermission.EVENT_EDIT_OWN,
  EventPermission.EVENT_DELETE_OWN,
  MentorshipPermission.MENTOR_ENABLE,
  MentorshipPermission.MENTOR_ACCEPT,
  MentorshipPermission.MENTOR_REJECT,
  MentorshipPermission.MENTOR_MANAGE,
  ResearchPermission.RESEARCH_CREATE,
];

export const ADMIN_PERMISSIONS: string[] = ['*'];

export const ROLES_PERMISSIONS: Record<string, string[]> = {
  guest: GUEST_PERMISSIONS,
  student: STUDENT_PERMISSIONS,
  alumni: ALUMNI_PERMISSIONS,
  faculty: FACULTY_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
};
