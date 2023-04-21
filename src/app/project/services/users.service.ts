import { Injectable } from '@angular/core';
import { MemberInfoViewModel } from '../../view-models/auth/identity-types';
import { ProjectService } from './project.service';
import { GroupService } from '../../groups/services/group.service';
import { IdentityService } from '../../auth/services/identity.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private repository: any = {};
  private pending: any = {};

  constructor(
    private readonly projectService: ProjectService,
    private readonly groupService: GroupService,
    private readonly identityService: IdentityService,
  ) {}

  async findUser(userId: string): Promise<MemberInfoViewModel> {
    if (!this.repository[userId]) {
      let found: any =
        this.identityService.identity.userId === userId
          ? this.identityService.profile
          : undefined;
      if (!found) {
        for (const project of this.projectService.projects) {
          for (const member of project.members) {
            if (userId === member.recordId) {
              found = member.member;
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }
      if (!found) {
        for (const group of this.groupService.groups) {
          for (const member of group.members) {
            if (userId === member.id) {
              found = member.member;
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }
      if (!found) {
        if (this.pending[userId]) {
          found = (await this.pending[userId]).data;
        } else {
          this.pending[userId] = this.identityService.getMemberInfo(userId);
          found = (await this.pending[userId]).data;
          this.pending[userId] = null;
        }
      }
      this.repository[userId] = found;
    }
    return this.repository[userId];
  }
}
