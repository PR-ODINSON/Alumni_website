import { BasePolicy } from './BasePolicy';
import { ResearchPermission } from '../../config/permissions/research';

export class ResearchPolicy extends BasePolicy {
  static create(user: any): boolean {
    return this.hasPermission(user, ResearchPermission.RESEARCH_CREATE) && user.verificationStatus === 'verified';
  }

  static update(user: any, project: any): boolean {
    if (this.hasPermission(user, ResearchPermission.RESEARCH_EDIT_ANY)) return true;
    return this.hasPermission(user, ResearchPermission.RESEARCH_CREATE) && this.isOwner(user, project);
  }

  static delete(user: any, project: any): boolean {
    if (this.hasPermission(user, ResearchPermission.RESEARCH_DELETE_ANY)) return true;
    return this.hasPermission(user, ResearchPermission.RESEARCH_CREATE) && this.isOwner(user, project);
  }

  static apply(user: any, project: any): boolean {
    if (user.verificationStatus !== 'verified') return false;
    if (!this.hasPermission(user, ResearchPermission.RESEARCH_APPLY)) return false;
    if (project.status !== 'open' || project.deletedAt) return false;
    
    // Can't apply if PI or co-investigator
    if (project.pi.toString() === user._id.toString()) return false;
    const isCo = project.coInvestigators?.some((co: any) => co.toString() === user._id.toString());
    if (isCo) return false;

    // Can't apply if already a collaborator
    const isCollab = project.collaborators?.some((col: any) => col.user.toString() === user._id.toString());
    if (isCollab) return false;

    // Can't apply if already applied
    const alreadyApplied = project.applications?.some((app: any) => app.user.toString() === user._id.toString());
    if (alreadyApplied) return false;

    return true;
  }

  static approve(user: any, project: any): boolean {
    if (this.isAdmin(user)) return true;
    return this.isOwner(user, project) && this.hasPermission(user, ResearchPermission.RESEARCH_APPROVE);
  }
}
