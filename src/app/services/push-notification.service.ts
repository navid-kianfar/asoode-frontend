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
        const groupEdit = this.groupService.groups.find(g => g.id === notification.data.id);
        if (!groupEdit) { return; }
        notification.data.members = [...groupEdit.members];
        notification.data.pending = [...groupEdit.pending];
        console.log(groupEdit, notification.data);
        Object.assign(groupEdit, notification.data);
        break;
    }
  }
}
