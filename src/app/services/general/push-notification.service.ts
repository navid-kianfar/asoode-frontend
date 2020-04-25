import { Injectable } from '@angular/core';
import { IdentityService } from '../auth/identity.service';
import { GroupService } from '../groups/group.service';
import { ProjectService } from '../projects/project.service';
import { ActivityType } from '../../library/app/enums';
import { Router } from '@angular/router';
import { WindowService } from './window.service';
import { WorkPackageViewModel } from '../../view-models/projects/project-types';
import {environment} from '../../../environments/environment';
import {DeviceDetectorService} from 'ngx-device-detector';
// import {ServiceWorkerService} from '../core/service-worker.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(
    private readonly identityService: IdentityService,
    private readonly router: Router,
    private readonly groupService: GroupService,
    private readonly projectService: ProjectService,
    private readonly windowService: WindowService,
    private readonly detector: DeviceDetectorService,
    // private readonly serviceWorkerService: ServiceWorkerService,
  ) {
  }

  // checkDevice(force: boolean = false): Promise<any> {
  //   return new Promise<any>(resolve => {
  //     this.serviceWorkerService.registry.pushManager
  //       .subscribe({
  //         userVisibleOnly: true,
  //         applicationServerKey: this.urlBase64ToUint8Array(
  //           environment.vapid,
  //         ),
  //       })
  //       .then(subscription => {
  //         const json = subscription.toJSON();
  //         const platform = this.detector.os.toLowerCase();
  //         const payload = {
  //           platform,
  //           endpoint: json.endpoint,
  //           expirationTime: json.expirationTime,
  //           auth: json.keys.auth,
  //           p256dh: json.keys.p256dh,
  //           browser: this.detector.browser,
  //           desktop: this.detector.isDesktop(),
  //           tablet: this.detector.isTablet(),
  //           mobile: this.detector.isMobile(),
  //           android: platform === 'android',
  //           ios: platform === 'ios',
  //           safari: this.detector.browser === 'Safari',
  //           device: this.detector.device,
  //         };
  //         resolve(payload);
  //       });
  //   });
  // }

  handleSocket(notification: any) {
    let find1: any = null;
    let find2: any = null;
    // let find3: any = null;
    console.log(notification);
    const url = (notification.push.url || '').replace(
      'https://panel.asoode.com',
      '',
    );
    switch (notification.type) {
      case ActivityType.AccountEdit:
        if (this.identityService.identity.userId === notification.data.id) {
          Object.assign(this.identityService.profile, notification.data);
        }
        this.groupService.groups.forEach(g => {
          const access = g.members.find(m => m.userId === notification.data.id);
          if (access) {
            Object.assign(access.member, notification.data);
          }
        });
        this.projectService.projects.forEach(g => {
          const access = g.members.find(
            m => m.recordId === notification.data.id,
          );
          if (access) {
            Object.assign(access.member, notification.data);
          }
        });
        break;
      case ActivityType.GroupAdd:
        this.groupService.groups.push(notification.data);
        if (
          this.identityService.identity.userId === notification.data.userId &&
          this.windowService.active
        ) {
          this.router.navigateByUrl(url);
        }
        break;
      case ActivityType.GroupEdit:
        find1 = this.groupService.groups.find(
          g => g.id === notification.data.id,
        );
        if (!find1) {
          return;
        }
        notification.data.members = [...find1.members];
        notification.data.pending = [...find1.pending];
        Object.assign(find1, notification.data);
        break;
      case ActivityType.GroupMemberPermission:
        if (notification.data.groupId) {
          find1 = this.groupService.groups.find(
            g => g.id === notification.data.groupId,
          );
          if (!find1) {
            return;
          }
          find2 = find1.members.find(m => m.id === notification.data.id);
          if (find2) {
            find2.access = notification.data.access;
            return;
          }
        }
        find1 = this.groupService.groups.find(
          g => g.id === notification.data.recordId,
        );
        find2 = find1.pending.find(m => m.id === notification.data.id);
        if (find2) {
          find2.access = notification.data.access;
          return;
        }
        break;
      case ActivityType.GroupMemberRemove:
        if (notification.data.groupId) {
          find1 = this.groupService.groups.find(
            g => g.id === notification.data.groupId,
          );
          if (!find1) {
            return;
          }
          find1.members = find1.members.filter(
            m => m.id !== notification.data.id,
          );
          return;
        }
        find1 = this.groupService.groups.find(
          g => g.id === notification.data.recordId,
        );
        if (!find1) {
          return;
        }
        find1.pending = find1.pending.filter(
          m => m.id !== notification.data.id,
        );
        break;
      case ActivityType.GroupMemberAdd:
        find1 = this.groupService.groups.find(
          g => g.id === notification.data.groupId,
        );
        if (find1) {
          find1.members = [...find1.members, ...notification.data.members];
          find1.pending = [...find1.pending, ...notification.data.pending];
        }
        break;

      case ActivityType.ProjectAdd:
        this.projectService.projects.push(notification.data);
        if (
          this.identityService.identity.userId === notification.data.userId &&
          this.windowService.active
        ) {
          this.router.navigateByUrl(url);
        }
        break;
      case ActivityType.ProjectEdit:
        find1 = this.projectService.projects.find(
          p => p.id === notification.data.id,
        );
        if (find1) {
          find1.title = notification.data.title;
          find1.description = notification.data.description;
        }
        break;

      case ActivityType.ProjectSubAdd:
        find1 = this.projectService.projects.find(
          p => p.id === notification.data.projectId,
        );
        if (find1) {
          find1.subProjects.push(notification.data);
        }
        break;
      case ActivityType.ProjectSubEdit:
        find1 = this.projectService.projects.find(
          p => p.id === notification.data.projectId,
        );
        if (find1) {
          find2 = find1.subProjects.find(s => s.id === notification.data.id);
          if (find2) {
            Object.assign(find2, notification.data);
          }
        }
        break;
      case ActivityType.ProjectSubRemove:
        find1 = this.projectService.projects.find(
          p => p.id === notification.data.projectId,
        );
        if (find1) {
          find1.subProjects = find1.subProjects.filter(
            i => i.id !== notification.data.id,
          );
        }
        break;

      case ActivityType.ProjectSeasonAdd:
        find1 = this.projectService.projects.find(
          i => i.id === notification.data.projectId,
        );
        if (find1) {
          find1.seasons.push(notification.data);
        }
        break;
      case ActivityType.ProjectSeasonEdit:
        find1 = this.projectService.projects.find(
          i => i.id === notification.data.projectId,
        );
        if (find1) {
          find2 = find1.seasons.find(s => s.id === notification.data.id);
          if (find2) {
            Object.assign(find2, notification.data);
          }
        }
        break;
      case ActivityType.ProjectSeasonRemove:
        find1 = this.projectService.projects.find(
          i => i.id === notification.data.projectId,
        );
        if (find1) {
          find1.seasons = find1.seasons.filter(
            s => s.id !== notification.data.id,
          );
        }
        break;

      case ActivityType.WorkPackageMemberAdd:
        find1 = this.projectService.projects.find(
          p => p.id === notification.data.projectId,
        );
        if (!find1) {
          this.projectService.load();
          return;
        }
        find2 = find1.workPackages.find(wp => wp.id === notification.data.id);
        if (!find2) {
          this.projectService.load();
          return;
        }
        find2.members = [...find2.members, ...notification.data.members];
        find2.pending = [...find2.pending, ...notification.data.pending];

        break;
      case ActivityType.WorkPackageMemberPermission:
        if (notification.data.packageId) {
          find1 = this.findWorkPackage(notification.data.packageId);
          if (!find1) {
            return;
          }
          find2 = find1.members.find(m => m.id === notification.data.id);
          if (find2) {
            find2.access = notification.data.access;
            return;
          }
        }
        find1 = this.findWorkPackage(notification.data.recordId);
        find2 = find1.pending.find(m => m.id === notification.data.id);
        if (find2) {
          find2.access = notification.data.access;
          return;
        }
        break;
      case ActivityType.WorkPackageMemberRemove:
        if (notification.data.packageId) {
          find1 = this.findWorkPackage(notification.data.packageId);
          if (!find1) {
            return;
          }
          find1.members = find1.members.filter(
            m => m.id !== notification.data.id,
          );
          return;
        }
        find1 = this.findWorkPackage(notification.data.recordId);
        find1.pending = find1.pending.filter(
          m => m.id !== notification.data.id,
        );
        break;

      case ActivityType.WorkPackageTaskTime:
        if (this.identityService.identity.userId === notification.data.userId) {
          if (!notification.data.end) {
            this.identityService.profile.workingTaskId =
              notification.data.taskId;
            this.identityService.profile.workingProjectId =
              notification.data.projectId;
            this.identityService.profile.workingPackageId =
              notification.data.packageId;
          } else if (
            this.identityService.profile.workingTaskId ===
            notification.data.taskId
          ) {
            this.identityService.profile.workingTaskId = undefined;
            this.identityService.profile.workingProjectId = undefined;
            this.identityService.profile.workingPackageId = undefined;
          }
        }
        break;

      case ActivityType.WorkPackageArchive:
        find1 = this.findWorkPackage(notification.data);
        if (find1) {
          find2 = this.projectService.projects.find(
            p => p.id === find1.projectId,
          );
          if (find2.complex) {
            find2.workPackages = find2.workPackages.filter(
              p => p.id !== notification.data,
            );
          } else {
            this.projectService.projects = this.projectService.projects.filter(
              p => p.id !== find2.id,
            );
          }
        }
        break;
      case ActivityType.WorkPackageRestore:
        this.projectService.load();
        break;
    }
  }

  // urlBase64ToUint8Array(base64String) {
  //   const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/-/g, '+')
  //     .replace(/_/g, '/');
  //   const rawData = window.atob(base64);
  //   const outputArray = new Uint8Array(rawData.length);
  //   for (let i = 0; i < rawData.length; ++i) {
  //     outputArray[i] = rawData.charCodeAt(i);
  //   }
  //   return outputArray;
  // }

  private findWorkPackage(id: string): WorkPackageViewModel {
    for (const proj of this.projectService.projects) {
      for (const wp of proj.workPackages) {
        if (wp.id === id) {
          return wp;
        }
      }
    }
  }
}
