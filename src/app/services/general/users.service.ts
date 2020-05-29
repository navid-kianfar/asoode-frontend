import { Injectable } from '@angular/core';
import { MemberInfoViewModel } from '../../view-models/auth/identity-types';
import { ProjectService } from '../projects/project.service';
import { GroupService } from '../groups/group.service';
import { IdentityService } from '../auth/identity.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private repository: any = {};

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
        found = (await this.identityService.getMemberInfo(userId)).data;
      }
      this.repository[userId] = found;
    }
    return this.repository[userId];
  }
}
