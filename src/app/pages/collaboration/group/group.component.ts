import { Component, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../../services/groups/group.service';
import { ModalService } from '../../../services/core/modal.service';
import { GroupDetailComponent } from '../../../modals/group-detail/group-detail.component';
import { AccessType, ActivityType } from '../../../library/app/enums';
import { Socket } from 'ngx-socket-io';
import { OperationResultStatus } from '../../../library/core/enums';

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
