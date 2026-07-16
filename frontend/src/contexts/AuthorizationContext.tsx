import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { ROLES_PERMISSIONS } from '../config/permissions';
import api from '../lib/api';

interface FeatureFlag {
  key: string;
  isEnabled: boolean;
}

interface AuthorizationContextType {
  can: (action: string, resource?: any) => boolean;
  isVerifiedUser: boolean;
  featureFlags: FeatureFlag[];
  isFeatureEnabled: (key: string) => boolean;
  refreshFlags: () => Promise<void>;
}

const AuthorizationContext = createContext<AuthorizationContextType | null>(null);

export const AuthorizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);

  const fetchFlags = async () => {
    try {
      const response = await api.get('/feature-flags');
      if (response.data?.success) {
        setFlags(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load feature flags:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFlags();
    } else {
      setFlags([]);
    }
  }, [user]);

  const isFeatureEnabled = (key: string): boolean => {
    const flag = flags.find((f) => f.key === key);
    return flag ? flag.isEnabled : true; // Default to true if not registered
  };

  const isOwner = (currentUser: any, resource: any): boolean => {
    if (!currentUser || !resource) return false;
    const ownerId =
      resource.postedBy?._id ||
      resource.postedBy ||
      resource.author?._id ||
      resource.author ||
      resource.pi?._id ||
      resource.pi ||
      resource.alumni?._id ||
      resource.alumni ||
      resource.user?._id ||
      resource.user ||
      (resource._id && resource.role ? resource._id : null);
    
    if (!ownerId) return false;
    return ownerId.toString() === currentUser._id.toString();
  };

  const can = (action: string, resource?: any): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;

    // Feature Flag Check
    const namespace = action.split(':')[0];
    const flagKeys: Record<string, string> = {
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
    const flagKey = flagKeys[namespace];
    if (flagKey && !isFeatureEnabled(flagKey)) {
      return false;
    }

    // verification status ABAC restriction
    const status = user.verificationStatus || (user.isVerified ? 'verified' : 'pending');
    if (status === 'suspended') return false;

    // Mutating actions require verification
    const requiresVerificationActions = [
      'job:create',
      'event:create',
      'research:create',
      'story:create',
      'startup:create',
      'feed:create',
      'comment:create',
      'mentor:enable',
      'message:start',
    ];
    if (requiresVerificationActions.includes(action) && status !== 'verified') {
      return false;
    }

    // Role mapping permissions check
    const permissions = ROLES_PERMISSIONS[user.role] || [];
    const baseAction = action.replace(/_(own|any)$/, ''); // normalize action ending
    const hasBasePermission = permissions.includes(action) || permissions.includes(baseAction) || permissions.includes('*');

    if (!hasBasePermission) return false;

    // Ownership check (ABAC)
    if (action.endsWith('_own') || action === 'job:update' || action === 'job:delete' || action === 'event:update' || action === 'event:delete' || action === 'feed:update' || action === 'feed:delete' || action === 'story:update' || action === 'story:delete' || action === 'research:update' || action === 'research:delete' || action === 'startup:update' || action === 'startup:delete') {
      if (permissions.includes(`${namespace}:edit_any`) || permissions.includes(`${namespace}:delete_any`) || permissions.includes('*')) {
        return true;
      }
      return isOwner(user, resource);
    }

    return true;
  };

  const isVerifiedUser = (user?.verificationStatus || (user?.isVerified ? 'verified' : 'pending')) === 'verified';

  return (
    <AuthorizationContext.Provider
      value={{
        can,
        isVerifiedUser,
        featureFlags: flags,
        isFeatureEnabled,
        refreshFlags: fetchFlags,
      }}
    >
      {children}
    </AuthorizationContext.Provider>
  );
};

export const useAuthorization = () => {
  const context = useContext(AuthorizationContext);
  if (!context) {
    throw new Error('useAuthorization must be used within an AuthorizationProvider');
  }
  return context;
};
