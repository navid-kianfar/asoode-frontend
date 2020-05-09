import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { AccessType } from '../../../library/app/enums';
import { GroupService } from '../../../services/groups/group.service';
import { ModalService } from '../../../services/core/modal.service';
import { OperationResult } from '../../../library/core/operation-result';
import { OperationResultStatus } from '../../../library/core/enums';
import { StringHelpers } from '../../../helpers/string.helpers';
import { TranslateService } from '../../../services/core/translate.service';

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss'],
})
export class GroupSettingsComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  deleting: boolean;
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
    this.modalService
      .confirm({
        title: 'REMOVE_GROUP',
        message: 'REMOVE_GROUP_CONFIRM',
        heading,
        actionLabel: 'REMOVE_GROUP',
        cancelLabel: 'CANCEL',
        action: async () => {
          this.deleting = true;
          const op = await this.groupService.remove(this.group.id);
          this.deleting = false;
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
        },
      })
      .subscribe(() => {});
  }
}
