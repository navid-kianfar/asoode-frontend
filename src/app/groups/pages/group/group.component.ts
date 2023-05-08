import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { ModalService } from '../../../shared/services/modal.service';
import { AccessType } from '../../../shared/lib/enums/enums';
import { IdentityService } from '../../../auth/services/identity.service';

import { TranslateService } from '../../../shared/services/translate.service';
import { ActivityType } from '../../../shared/lib/enums/activity-type';
import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';
import { SocketListenerService } from '../../../shared/services/socket-listener.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit, OnDestroy {
  group: GroupViewModel;
  showDetail: boolean;
  permission: AccessType;
  AccessType = AccessType;
  waiting: boolean;
  private listener: Subscription;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly groupService: GroupService,
    private readonly modalService: ModalService,
    private readonly socket: SocketListenerService,
    private readonly identityService: IdentityService,
    private readonly translateService: TranslateService,
  ) {}

  ngOnDestroy(): void {
        this.listener.unsubscribe();
    }

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
    this.permission = this.groupService.getPermission(this.group);
  }

  bind() {
    this.listener = this.socket.listener.subscribe((notification: any) => {
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
    // this.modalService
    //   .show(GroupDetailComponent, {
    //     group: this.group,
    //     canEdit:
    //       this.permission === AccessType.Admin ||
    //       this.permission === AccessType.Owner,
    //   });
  }
}
