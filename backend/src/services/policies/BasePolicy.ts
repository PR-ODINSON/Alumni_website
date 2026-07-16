import { ROLES_PERMISSIONS } from '../../config/roles';

export class BasePolicy {
  protected static isOwner(user: any, resource: any): boolean {
    if (!user || !resource) return false;
    // Map various typical ownership fields
    const ownerId =
      resource.postedBy ||
      resource.author ||
      resource.pi ||
      resource.alumni ||
      resource.user ||
      (resource._id && resource.role ? resource._id : null); // If user resource itself
    if (!ownerId) return false;
    return ownerId.toString() === user._id.toString();
  }

  protected static hasPermission(user: any, permission: string): boolean {
    if (!user || !user.role) return false;
    const permissions = ROLES_PERMISSIONS[user.role] || [];
    return permissions.includes('*') || permissions.includes(permission);
  }

  protected static isAdmin(user: any): boolean {
    return user && user.role === 'admin';
  }
}
