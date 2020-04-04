import { Injectable } from '@angular/core';
import {IdentityService} from './auth/identity.service';
import {GroupService} from './groups/group.service';
import {ProjectService} from './projects/project.service';
import {ActivityType} from '../library/app/enums';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private readonly identityService: IdentityService,
    private readonly groupService: GroupService,
    private readonly projectService: ProjectService
  ) { }

  handleSocket(notification: any) {
    switch (notification.type) {
      case ActivityType.AccountEdit:
        if (this.identityService.identity.userId === notification.data.id) {
          Object.assign(this.identityService.profile, notification.data);
          console.log(this.identityService.profile);
        }
        break;
    }
  }
}
