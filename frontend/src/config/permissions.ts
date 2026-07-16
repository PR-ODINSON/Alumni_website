export const UserPermission = {
  USERS_VIEW: 'users:view',
  USERS_VERIFY: 'users:verify',
  USERS_DELETE: 'users:delete',
  USERS_BAN: 'users:ban',
  USERS_EDIT_ANY: 'users:edit_any',
} as const;
export type UserPermission = typeof UserPermission[keyof typeof UserPermission];

export const FeedPermission = {
  FEED_CREATE: 'feed:create',
  FEED_EDIT_OWN: 'feed:edit_own',
  FEED_DELETE_OWN: 'feed:delete_own',
  FEED_DELETE_ANY: 'feed:delete_any',
  COMMENT_CREATE: 'comment:create',
  COMMENT_DELETE_OWN: 'comment:delete_own',
  COMMENT_DELETE_ANY: 'comment:delete_any',
} as const;
export type FeedPermission = typeof FeedPermission[keyof typeof FeedPermission];

export const JobPermission = {
  JOB_CREATE: 'job:create',
  JOB_EDIT_OWN: 'job:edit_own',
  JOB_DELETE_OWN: 'job:delete_own',
  JOB_CLOSE_OWN: 'job:close_own',
  JOB_APPLY: 'job:apply',
  JOB_EDIT_ANY: 'job:edit_any',
  JOB_DELETE_ANY: 'job:delete_any',
} as const;
export type JobPermission = typeof JobPermission[keyof typeof JobPermission];

export const EventPermission = {
  EVENT_CREATE: 'event:create',
  EVENT_EDIT_OWN: 'event:edit_own',
  EVENT_DELETE_OWN: 'event:delete_own',
  EVENT_REGISTER: 'event:register',
  EVENT_EDIT_ANY: 'event:edit_any',
  EVENT_DELETE_ANY: 'event:delete_any',
} as const;
export type EventPermission = typeof EventPermission[keyof typeof EventPermission];

export const ResearchPermission = {
  RESEARCH_CREATE: 'research:create',
  RESEARCH_APPLY: 'research:apply',
  RESEARCH_APPROVE: 'research:approve',
  RESEARCH_EDIT_ANY: 'research:edit_any',
  RESEARCH_DELETE_ANY: 'research:delete_any',
} as const;
export type ResearchPermission = typeof ResearchPermission[keyof typeof ResearchPermission];

export const StoryPermission = {
  STORY_CREATE: 'story:create',
  STORY_APPROVE: 'story:approve',
  STORY_EDIT_OWN: 'story:edit_own',
  STORY_DELETE_OWN: 'story:delete_own',
  STORY_EDIT_ANY: 'story:edit_any',
  STORY_DELETE_ANY: 'story:delete_any',
} as const;
export type StoryPermission = typeof StoryPermission[keyof typeof StoryPermission];

export const StartupPermission = {
  STARTUP_CREATE: 'startup:create',
  STARTUP_EDIT_OWN: 'startup:edit_own',
  STARTUP_DELETE_OWN: 'startup:delete_own',
  STARTUP_EDIT_ANY: 'startup:edit_any',
  STARTUP_DELETE_ANY: 'startup:delete_any',
} as const;
export type StartupPermission = typeof StartupPermission[keyof typeof StartupPermission];

export const ReportPermission = {
  REPORT_CREATE: 'report:create',
  REPORT_REVIEW: 'report:review',
} as const;
export type ReportPermission = typeof ReportPermission[keyof typeof ReportPermission];

export const AnalyticsPermission = {
  ANALYTICS_VIEW_SELF: 'analytics:view_self',
  ANALYTICS_VIEW_GLOBAL: 'analytics:view_global',
} as const;
export type AnalyticsPermission = typeof AnalyticsPermission[keyof typeof AnalyticsPermission];

export const AdminPermission = {
  ADMIN_PANEL_ACCESS: 'admin:panel_access',
  SYSTEM_SETTINGS: 'admin:system_settings',
  AUDIT_LOG_VIEW: 'admin:audit_log_view',
  FEATURE_FLAG_MANAGE: 'admin:feature_flag_manage',
} as const;
export type AdminPermission = typeof AdminPermission[keyof typeof AdminPermission];

export const MentorshipPermission = {
  MENTOR_ENABLE: 'mentor:enable',
  MENTOR_ACCEPT: 'mentor:accept',
  MENTOR_REJECT: 'mentor:reject',
  MENTOR_MANAGE: 'mentor:manage',
} as const;
export type MentorshipPermission = typeof MentorshipPermission[keyof typeof MentorshipPermission];

export const NotificationPermission = {
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_DELETE: 'notification:delete',
} as const;
export type NotificationPermission = typeof NotificationPermission[keyof typeof NotificationPermission];

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

export const ROLES_PERMISSIONS: Record<string, string[]> = {
  guest: [],
  student: [
    'feed:create',
    'feed:edit_own',
    'feed:delete_own',
    'comment:create',
    'comment:delete_own',
    'job:apply',
    'event:register',
    'research:apply',
    'analytics:view_self',
    'notification:read',
    'notification:delete',
    'report:create',
  ],
  alumni: [
    'feed:create',
    'feed:edit_own',
    'feed:delete_own',
    'comment:create',
    'comment:delete_own',
    'job:apply',
    'event:register',
    'research:apply',
    'analytics:view_self',
    'notification:read',
    'notification:delete',
    'report:create',
    'job:create',
    'job:edit_own',
    'job:delete_own',
    'job:close_own',
    'event:create',
    'event:edit_own',
    'event:delete_own',
    'startup:create',
    'startup:edit_own',
    'startup:delete_own',
    'story:create',
    'story:edit_own',
    'story:delete_own',
    'mentor:enable',
    'mentor:accept',
    'mentor:reject',
    'mentor:manage',
    'research:create',
  ],
  faculty: [
    'feed:create',
    'feed:edit_own',
    'feed:delete_own',
    'comment:create',
    'comment:delete_own',
    'job:apply',
    'event:register',
    'research:apply',
    'analytics:view_self',
    'notification:read',
    'notification:delete',
    'report:create',
    'event:create',
    'event:edit_own',
    'event:delete_own',
    'mentor:enable',
    'mentor:accept',
    'mentor:reject',
    'mentor:manage',
    'research:create',
  ],
  admin: ['*'],
};
