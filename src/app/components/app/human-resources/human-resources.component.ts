import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {GroupViewModel} from '../../../view-models/groups/group-types';
import {AccessType} from '../../../library/app/enums';
import {IdentityService} from '../../../services/auth/identity.service';
import {GridCommand} from '../../../view-models/core/grid-types';
import {ModalService} from '../../../services/core/modal.service';
import {StringHelpers} from '../../../helpers/string.helpers';
import {TranslateService} from '../../../services/core/translate.service';
import {GroupService} from '../../../services/groups/group.service';
import {OperationResultStatus} from '../../../library/core/enums';
import {CulturedDateService} from '../../../services/core/cultured-date.service';

@Component({
  selector: 'app-human-resources',
  templateUrl: './human-resources.component.html',
  styleUrls: ['./human-resources.component.scss'],
})
export class HumanResourcesComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  entryCommander = new EventEmitter<GridCommand<any>>();
  AccessType = AccessType;
  constructor(
    readonly identityService: IdentityService,
    private readonly modalService: ModalService,
    private readonly translateService: TranslateService,
    private readonly groupService: GroupService,
    private readonly culturedDateService: CulturedDateService,
  ) {}

  ngOnInit() {}

  createEntry() {
    const canStart = this.identityService.profile.workingGroupId !== this.group.id;
    const str1 = canStart ? 'BEGIN_ENTRY_CONFIRM_HEADING' : 'END_ENTRY_CONFIRM_HEADING';
    const str2 = canStart ? 'BEGIN_ENTRY' : 'END_ENTRY';
    const str3 = canStart ? 'BEGIN_ENTRY_CONFIRM' : 'END_ENTRY_CONFIRM';
    const heading = StringHelpers.format(this.translateService.fromKey(str1), [this.group.title]);
    this.modalService
      .confirm({
        heading,
        title: str2,
        message: str3,
        actionLabel: str2,
        cancelLabel: 'CANCEL',
        action: async () => {
          const op = await this.groupService.toggleEntry(this.group.id);
          if (op.status === OperationResultStatus.Success) {
            this.entryCommander.emit({reload: true});
          }
          return op;
        },
      })
      .subscribe(confirmed => {});
  }

  edit(element: any) {

  }

  delete(element: any) {
    const converter = this.culturedDateService.Converter();
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_ENTRY_CONFIRM_HEADING'),
      [element.fullName]
    );
    const message = StringHelpers.format(
      this.translateService.fromKey('REMOVE_ENTRY_CONFIRM'),
      [
        converter.Format(element.beginAt, 'YYYY/MM/DD HH:mm'),
        converter.Format(element.endAt || new Date(), 'YYYY/MM/DD HH:mm'),
      ]
    );
    this.modalService
      .confirm({
        title: 'REMOVE_ENTRY',
        message,
        heading,
        actionLabel: 'REMOVE_ENTRY',
        cancelLabel: 'CANCEL',
        action: async () => {
          const op = await this.groupService.removeEntry(element.id);
          if (op.status === OperationResultStatus.Success) {
            this.entryCommander.emit({reload: true});
          }
          return op;
        },
      })
      .subscribe(() => {});
  }
}
