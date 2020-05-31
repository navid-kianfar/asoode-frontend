import { Component, Input, OnInit } from '@angular/core';
import { ProjectViewModel } from '../../../view-models/projects/project-types';
import { AccessType } from 'src/app/library/app/enums';
import { InviteModalComponent } from '../../../modals/invite-modal/invite-modal.component';
import { ProjectMemberViewModel } from '../../../view-models/projects/project-types';
import { StringHelpers } from '../../../helpers/string.helpers';
import { OperationResult } from '../../../library/core/operation-result';
import { OperationResultStatus } from '../../../library/core/enums';
import { ModalService } from '../../../services/core/modal.service';
import { TranslateService } from '../../../services/core/translate.service';
import { ProjectService } from '../../../services/projects/project.service';
import { GroupService } from '../../../services/groups/group.service';
import {
  GroupMemberViewModel,
  PendingInvitationViewModel,
} from '../../../view-models/groups/group-types';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project-setting',
  templateUrl: './project-setting.component.html',
  styleUrls: ['./project-setting.component.scss'],
})
export class ProjectSettingComponent implements OnInit {
  AccessType = AccessType;
  @Input() model: ProjectViewModel;
  @Input() permission: AccessType;
  archiving: boolean;
  deleting: boolean;
  constructor(
    private readonly modalService: ModalService,
    private readonly projectService: ProjectService,
    private readonly groupService: GroupService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
  ) {}

  ngOnInit() {}
  invite() {
    this.modalService
      .show(InviteModalComponent, {
        noProject: true,
        existing: this.model.members,
        exclude: [
          this.model.userId,
          this.model.id,
          ...this.model.pending.map(p => p.identifier),
        ],
        handler: async access => {
          return this.projectService.addAccess(this.model.id, access);
        },
      })
      .subscribe(() => {});
  }

  removeAccess(member: ProjectMemberViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_MEMBER_CONFIRM_HEADING'),
      [
        member.isGroup
          ? this.groupService.groups.find(g => g.id === member.recordId).title
          : member.member.fullName,
      ],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_ACCESS',
        message: 'REMOVE_MEMBER_CONFIRM',
        heading,
        actionLabel: 'REMOVE_ACCESS',
        cancelLabel: 'CANCEL',
        action: async () => OperationResult.Success(true),
      })
      .subscribe(async confirmed => {
        if (!confirmed) {
          return;
        }
        member.waiting = true;
        const op = await this.projectService.removeAccess(member.id);
        member.waiting = false;
        if (op.status !== OperationResultStatus.Success) {
          // TODO: handle error
          return;
        }
      });
  }

  async accessChange(member: ProjectMemberViewModel, access: AccessType) {
    member.access = access;
    member.waiting = true;
    const op = await this.projectService.changeAccess(member.id, { access });
    member.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }
  transferOwnership(member: ProjectMemberViewModel) {}

  canRemoveAccess(member: ProjectMemberViewModel): boolean {
    if (member.access === AccessType.Owner) {
      return false;
    }
    return (
      this.permission === AccessType.Owner ||
      this.permission === AccessType.Admin
    );
  }

  canRemovePendingAccess(member: PendingInvitationViewModel) {
    if (member.access === AccessType.Owner) {
      return false;
    }
    return (
      this.permission === AccessType.Owner ||
      this.permission === AccessType.Admin
    );
  }

  async accessPendingChange(
    member: PendingInvitationViewModel,
    access: AccessType,
  ) {
    member.access = access;
    member.waiting = true;
    const op = await this.projectService.changePendingAccess(member.id, {
      access,
    });
    member.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  removePendingAccess(member: PendingInvitationViewModel) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_MEMBER_CONFIRM_HEADING'),
      [member.identifier],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_ACCESS',
        message: 'REMOVE_MEMBER_CONFIRM',
        heading,
        actionLabel: 'REMOVE_ACCESS',
        cancelLabel: 'CANCEL',
        action: async () => OperationResult.Success(true),
      })
      .subscribe(async confirmed => {
        if (!confirmed) {
          return;
        }
        member.deleting = true;
        const op = await this.projectService.removePendingAccess(member.id);
        member.deleting = false;
        if (op.status !== OperationResultStatus.Success) {
          // TODO: handle error
          return;
        }
        this.model.pending = this.model.pending.filter(g => g !== member);
      });
  }

  prepareArchive() {
    const heading = StringHelpers.format(
      this.translateService.fromKey('ARCHIVE_PROJECT_CONFIRM_HEADING'),
      [this.model.title],
    );
    this.modalService
      .confirm({
        title: 'ARCHIVE_PROJECT',
        message: 'ARCHIVE_PROJECT_CONFIRM',
        heading,
        actionLabel: 'ARCHIVE_PROJECT',
        cancelLabel: 'CANCEL',
        action: async () => {
          this.archiving = true;
          const op = await this.projectService.archiveProject(this.model.id);
          this.archiving = false;
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          return this.router.navigateByUrl('/dashboard');
        },
      })
      .subscribe(confirmed => {});
  }

  prepareDelete() {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_PROJECT_CONFIRM_HEADING'),
      [this.model.title],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_PROJECT',
        message: 'REMOVE_PROJECT_DESCRIPTION',
        heading,
        actionLabel: 'REMOVE_PROJECT',
        cancelLabel: 'CANCEL',
        action: async () => {
          this.deleting = true;
          const op = await this.projectService.remove(this.model.id);
          this.deleting = false;
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          return this.router.navigateByUrl('/dashboard');
        },
      })
      .subscribe(confirmed => {});
  }
}
