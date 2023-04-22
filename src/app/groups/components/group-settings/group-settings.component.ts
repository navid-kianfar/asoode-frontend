import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { AccessType } from '../../../shared/lib/enums/enums';
import { GroupService } from '../../services/group.service';
import { ModalService } from '../../../shared/services/modal.service';
import { StringHelpers } from '../../../shared/helpers/string.helpers';
import { TranslateService } from '../../../shared/services/translate.service';
import { OperationResultStatus } from '../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss'],
})
export class GroupSettingsComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  deleting: boolean;
  AccessType = AccessType;
  constructor(
    private readonly groupService: GroupService,
    private readonly modalService: ModalService,
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit() {}

  async prepareDelete() {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_GROUP_CONFIRM_HEADING'),
      [this.group.title],
    );
    // this.modalService
    //   .confirm({
    //     title: 'REMOVE_GROUP',
    //     message: 'REMOVE_GROUP_CONFIRM',
    //     heading,
    //     actionLabel: 'REMOVE_GROUP',
    //     cancelLabel: 'CANCEL',
    //     action: async () => {
    //       this.deleting = true;
    //       const op = await this.groupService.remove(this.group.id);
    //       this.deleting = false;
    //       if (op.status !== OperationResultStatus.Success) {
    //         // TODO: handle error
    //         return;
    //       }
    //     },
    //   })
    //   .subscribe(() => {});
  }

  prepareArchive() {
    const heading = StringHelpers.format(
      this.translateService.fromKey('ARCHIVE_GROUP_CONFIRM_HEADING'),
      [this.group.title],
    );
    // this.modalService
    //   .confirm({
    //     title: 'ARCHIVE_GROUP',
    //     message: 'ARCHIVE_GROUP_CONFIRM',
    //     heading,
    //     actionLabel: 'ARCHIVE_GROUP',
    //     cancelLabel: 'CANCEL',
    //     action: async () => {
    //       this.deleting = true;
    //       const op = await this.groupService.archive(this.group.id);
    //       this.deleting = false;
    //       if (op.status !== OperationResultStatus.Success) {
    //         // TODO: handle error
    //         return;
    //       }
    //     },
    //   })
    //   .subscribe(() => {});
  }

  prepareRestore() {
    const heading = StringHelpers.format(
      this.translateService.fromKey('RESTORE_GROUP_CONFIRM_HEADING'),
      [this.group.title],
    );
    // this.modalService
    //   .confirm({
    //     title: 'RESTORE_GROUP',
    //     message: 'RESTORE_GROUP_CONFIRM',
    //     heading,
    //     actionLabel: 'RESTORE_GROUP',
    //     cancelLabel: 'CANCEL',
    //     action: async () => {
    //       this.deleting = true;
    //       const op = await this.groupService.restore(this.group.id);
    //       this.deleting = false;
    //       if (op.status !== OperationResultStatus.Success) {
    //         // TODO: handle error
    //         return;
    //       }
    //     },
    //   })
    //   .subscribe(() => {});
  }
}
