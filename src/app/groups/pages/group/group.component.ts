import { Component, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { ModalService } from '../../../shared/services/modal.service';
import { GroupDetailComponent } from '../../../__/modals/group-detail/group-detail.component';
import { AccessType } from '../../../shared/lib/enums/enums';
import { Socket } from 'ngx-socket-io';
import { IdentityService } from '../../../auth/services/identity.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { TranslateService } from '../../../shared/services/translate.service';
import { ActivityType } from '../../../shared/lib/enums/activity-type';
import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  group: GroupViewModel;
  showDetail: boolean;
  permission: AccessType;
  AccessType = AccessType;
  waiting: boolean;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly groupService: GroupService,
    private readonly modalService: ModalService,
    private readonly socket: Socket,
    private readonly identityService: IdentityService,
    private readonly gaService: GoogleAnalyticsService,
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.fetch();
    this.bind();
  }

  async fetch() {
    this.showDetail = true;
    const id = this.activatedRoute.snapshot.params.id;
    this.group = this.groupService.groups.find(g => g.id === id);
    if (!this.group) {
      this.waiting = true;
      const op = await this.groupService.fetch(id);
      this.waiting = false;
      if (op.status !== OperationResultStatus.Success) {
        this.router.navigateByUrl('dashboard');
        return;
      }
      this.group = op.data;
    }

    this.gaService.pageView(
      window.location.pathname,
      this.translateService.fromKey('GROUP'),
      undefined,
      { user_id: this.identityService.identity.userId },
    );

    if (this.group.premium && this.identityService.profile.plan.expireAt) {
      const expired =
        new Date(this.identityService.profile.plan.expireAt).getTime() <
        new Date().getTime();
      if (expired) {
        await this.router.navigateByUrl('/dashboard');
        // this.modalService
        //   .show(UpgradeComponent, {} as CreateModalParameters)
        //   .subscribe(() => {});
        return;
      }
    }
    this.permission = this.groupService.getPermission(this.group);
  }

  bind() {
    this.socket.on('push-notification', (notification: any) => {
      switch (notification.type) {
        case ActivityType.GroupRestore:
          if (this.group.id === notification.data.id) {
            this.group = notification.data;
          }
          break;
        case ActivityType.GroupArchive:
        case ActivityType.GroupRemove:
          if (this.group.id === notification.data) {
            this.router.navigateByUrl('/');
          }
          break;
        case ActivityType.GroupMemberRemove:
          if (
            this.group.id === notification.data.groupId &&
            this.identityService.identity.userId === notification.data.userId
          ) {
            this.router.navigateByUrl('/');
          }
          break;
      }
    });
  }

  detail() {
    this.modalService
      .show(GroupDetailComponent, {
        group: this.group,
        canEdit:
          this.permission === AccessType.Admin ||
          this.permission === AccessType.Owner,
      })
      .subscribe(() => {});
  }
}
