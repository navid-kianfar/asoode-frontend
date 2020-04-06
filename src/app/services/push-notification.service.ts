import { Injectable } from '@angular/core';
import {IdentityService} from './auth/identity.service';
import {GroupService} from './groups/group.service';
import {ProjectService} from './projects/project.service';
import {ActivityType} from '../library/app/enums';
import {Router} from '@angular/router';
import {WindowService} from './window.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private readonly identityService: IdentityService,
    private readonly router: Router,
    private readonly groupService: GroupService,
    private readonly projectService: ProjectService,
    private readonly windowService: WindowService,
  ) { }

  handleSocket(notification: any) {
    let find1: any = null;
    let find2: any = null;
    // let find3: any = null;
    const url = (notification.push.url || '').replace('https://panel.asoode.com', '');
    switch (notification.type) {
      case ActivityType.AccountEdit:
        if (this.identityService.identity.userId === notification.data.id) {
          Object.assign(this.identityService.profile, notification.data);
        }
        this.groupService.groups.forEach(g => {
          const access = g.members.find(m => m.recordId === notification.data.id);
          if (access) { Object.assign(access.member, notification.data); }
        });
        this.projectService.projects.forEach(g => {
          const access = g.members.find(m => m.recordId === notification.data.id);
          if (access) { Object.assign(access.member, notification.data); }
        });
        break;
      case ActivityType.GroupAdd:
        this.groupService.groups.push(notification.data);
        if (
          this.identityService.identity.userId === notification.data.userId &&
          this.windowService.active) {
          this.router.navigateByUrl(url);
        }
        break;
      case ActivityType.GroupEdit:
        find1 = this.groupService.groups.find(g => g.id === notification.data.id);
        if (!find1) { return; }
        notification.data.members = [...find1.members];
        notification.data.pending = [...find1.pending];
        Object.assign(find1, notification.data);
        break;
      case ActivityType.GroupMemberPermission:
        if (notification.data.groupId) {
          find1 = this.groupService.groups.find(g => g.id === notification.data.groupId);
          if (!find1) { return; }
          find2 = find1.members.find(m => m.id === notification.data.id);
          if (find2) {
            find2.access = notification.data.access;
            return;
          }
        }
        find1 = this.groupService.groups.find(g => g.id === notification.data.recordId);
        find2 = find1.pending.find(m => m.id === notification.data.id);
        if (find2) {
          find2.access = notification.data.access;
          return;
        }
        break;
      case ActivityType.GroupMemberRemove:
        if (notification.data.groupId) {
          find1 = this.groupService.groups.find(g => g.id === notification.data.groupId);
          if (!find1) { return; }
          find1.members = find1.members.filter(m => m.id !== notification.data.id);
          return;
        }
        find1 = this.groupService.groups.find(g => g.id === notification.data.recordId);
        if (!find1) { return; }
        find1.pending = find1.pending.filter(m => m.id !== notification.data.id);
        break;
      case ActivityType.GroupMemberAdd:
        find1 = this.groupService.groups.find(g => g.id === notification.data.groupId);
        if (find1) {
          find1.members = [...find1.members, ...notification.data.members];
          find1.pending = [...find1.pending, ...notification.data.pending];
        }
        break;

      case ActivityType.ProjectAdd:
        this.projectService.projects.push(notification.data);
        if (
          this.identityService.identity.userId === notification.data.userId &&
          this.windowService.active) {
          this.router.navigateByUrl(url);
        }
        break;
      case ActivityType.ProjectSubAdd:
        find1 = this.projectService.projects.find(p => p.id === notification.data.projectId);
        if (find1) { find1.subProjects.push(notification.data); }
        break;
    }
  }
}
