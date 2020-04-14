import { Injectable } from '@angular/core';
import {MemberInfoViewModel} from '../../view-models/auth/identity-types';
import {ProjectService} from '../projects/project.service';
import {GroupService} from '../groups/group.service';
import {IdentityService} from '../auth/identity.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private readonly projectService: ProjectService,
    private readonly groupService: GroupService,
    private readonly identityService: IdentityService,
  ) { }

  findUser(userId: string): MemberInfoViewModel {
    let found: any = this.identityService.identity.userId === userId ?
      this.identityService.profile : undefined;
    if (!found) {
      for (const project of this.projectService.projects) {
        for (const member of project.members) {
          if (userId === member.recordId) {
            found = member.member;
            break;
          }
        }
        if (found) { break; }
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
        if (found) { break; }
      }
    }
    return found;
  }
}
