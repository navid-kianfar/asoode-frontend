import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../../view-models/groups/group-types';
import {
  AccessType,
  RequestStatus,
  ShiftType,
} from '../../../../shared/lib/enums/enums';
import { IdentityService } from '../../../../auth/services/identity.service';
import { GridCommand } from '../../../../view-models/core/grid-types';
import { ModalService } from '../../../../shared/services/modal.service';
import { StringHelpers } from '../../../../shared/helpers/string.helpers';
import { TranslateService } from '../../../../shared/services/translate.service';
import { GroupService } from '../../../../groups/services/group.service';
import { CulturedDateService } from '../../../../shared/services/cultured-date.service';
import { PromptComponent } from '../../../modals/prompt/prompt.component';
import { FormViewModel } from '../../../../shared/components/form/contracts';
import { FormService } from '../../../../shared/services/form.service';
import { ListViewModel } from '../../../../view-models/core/list-types';
import { IDateConverter } from '../../../../shared/lib/date-time/date-contracts';
import { TimeOffApproveModalComponent } from '../../../modals/time-off-approve-modal/time-off-approve-modal.component';
import { TimeOffHistoryModalComponent } from '../../../modals/time-off-history-modal/time-off-history-modal.component';
import { OperationResultStatus } from '../../../../shared/lib/enums/operation-result-status';

@Component({
  selector: 'app-human-resources',
  templateUrl: './human-resources.component.html',
  styleUrls: ['./human-resources.component.scss'],
})
export class HumanResourcesComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  entryCommander = new EventEmitter<GridCommand<any>>();
  timeOffCommander = new EventEmitter<GridCommand<boolean>>();
  shiftsCommander = new EventEmitter<GridCommand<boolean>>();
  RequestStatus = RequestStatus;
  AccessType = AccessType;
  ShiftType = ShiftType;
  converter: IDateConverter;
  waiting: boolean;
  constructor(
    readonly identityService: IdentityService,
    private readonly modalService: ModalService,
    private readonly translateService: TranslateService,
    private readonly groupService: GroupService,
    private readonly formService: FormService,
    private readonly culturedDateService: CulturedDateService,
  ) {}

  ngOnInit() {
    this.converter = this.culturedDateService.Converter();
  }

  async goPremium() {
    this.waiting = true;
    const op = await this.groupService.upgrade(this.group.id);
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
  }

  createEntry() {
    const canStart =
      this.identityService.profile.workingGroupId !== this.group.id;
    const str1 = canStart
      ? 'BEGIN_ENTRY_CONFIRM_HEADING'
      : 'END_ENTRY_CONFIRM_HEADING';
    const str2 = canStart ? 'BEGIN_ENTRY' : 'END_ENTRY';
    const str3 = canStart ? 'BEGIN_ENTRY_CONFIRM' : 'END_ENTRY_CONFIRM';
    const heading = StringHelpers.format(this.translateService.fromKey(str1), [
      this.group.title,
    ]);
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
            this.entryCommander.emit({ reload: true });
          }
          return op;
        },
      })
      .subscribe(confirmed => {});
  }

  createEntryForm(beginAt: Date, endAt: Date): FormViewModel[] {
    return [
      {
        size: 6,
        elements: [
          this.formService.createDatePicker({
            config: {
              field: 'beginAt',
              label: 'BEGIN_AT',
            },
            params: {
              model: beginAt,
              pickButton: true,
            },
          }),
        ],
      },
      {
        size: 6,
        elements: [
          this.formService.createTimePicker({
            config: {
              field: 'startAt',
              label: '',
            },
            params: {
              model: `${beginAt.getHours()}:${beginAt.getMinutes()}`,
            },
          }),
        ],
      },
      {
        size: 6,
        elements: [
          this.formService.createDatePicker({
            config: {
              field: 'endAt',
              label: 'END_AT',
            },
            params: {
              model: endAt,
            },
          }),
        ],
      },
      {
        size: 6,
        elements: [
          this.formService.createTimePicker({
            config: {
              field: 'finishAt',
              label: '',
            },
            params: {
              model: `${endAt.getHours()}:${endAt.getMinutes()}`,
            },
          }),
        ],
      },
    ];
  }

  edit(element: any) {
    element.beginAt = new Date(element.beginAt);
    element.endAt = element.endAt ? new Date(element.endAt) : new Date();
    const form = this.createEntryForm(element.beginAt, element.endAt);
    this.modalService
      .show(PromptComponent, {
        form,
        actionLabel: 'EDIT_ENTRY',
        action: async (model, frm) => {
          const converter = this.culturedDateService.Converter();
          const beginParts = model.startAt.split(':');
          const endParts = model.finishAt.split(':');

          let parsed = converter.FromDateTime(model.beginAt);
          model.beginAt = converter.ToDateTime({
            Year: parsed.Year,
            Month: parsed.Month,
            Day: parsed.Day,
            Hours: +beginParts[0],
            Minutes: +beginParts[1],
          });

          parsed = converter.FromDateTime(model.endAt);
          model.endAt = converter.ToDateTime({
            Year: parsed.Year,
            Month: parsed.Month,
            Day: parsed.Day,
            Hours: +endParts[0],
            Minutes: +endParts[1],
          });

          const op = await this.groupService.editEntry(element.id, {
            begin: model.beginAt,
            end: model.endAt,
          });
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          this.entryCommander.emit({ reload: true });
          return op;
        },
        actionColor: 'primary',
        title: 'EDIT_ENTRY',
      })
      .subscribe(() => {});
  }

  createManualEntry() {
    const now = new Date();
    const later = new Date();
    now.setHours(8);
    now.setMinutes(0);
    later.setHours(17);
    later.setMinutes(0);
    const form = this.createEntryForm(now, later);
    const users = this.group.members.map(m => {
      return {
        text: m.member.fullName,
        value: m.userId,
      };
    });
    form.unshift({
      size: 12,
      elements: [
        this.formService.createDropDown({
          config: {
            label: 'MANUAL_ENTRY_FOR',
            field: 'userId',
          },
          params: {
            model: this.identityService.profile.id,
            items: users,
          },
        }),
      ],
    });
    this.modalService
      .show(PromptComponent, {
        form,
        actionLabel: 'MANUAL_ENTRY',
        action: async (model, frm) => {
          const converter = this.culturedDateService.Converter();
          const beginParts = model.startAt.split(':');
          const endParts = model.finishAt.split(':');

          let parsed = converter.FromDateTime(model.beginAt);
          model.beginAt = converter.ToDateTime({
            Year: parsed.Year,
            Month: parsed.Month,
            Day: parsed.Day,
            Hours: +beginParts[0],
            Minutes: +beginParts[1],
          });

          parsed = converter.FromDateTime(model.endAt);
          model.endAt = converter.ToDateTime({
            Year: parsed.Year,
            Month: parsed.Month,
            Day: parsed.Day,
            Hours: +endParts[0],
            Minutes: +endParts[1],
          });

          const op = await this.groupService.manualEntry(this.group.id, {
            begin: model.beginAt,
            end: model.endAt,
            userId: model.userId,
          });
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          this.entryCommander.emit({ reload: true });
          return op;
        },
        actionColor: 'primary',
        title: 'MANUAL_ENTRY',
      })
      .subscribe(() => {});
  }

  delete(element: any) {
    const converter = this.culturedDateService.Converter();
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_ENTRY_CONFIRM_HEADING'),
      [element.fullName],
    );
    const message = StringHelpers.format(
      this.translateService.fromKey('REMOVE_ENTRY_CONFIRM'),
      [
        converter.Format(element.beginAt, 'YYYY/MM/DD HH:mm'),
        converter.Format(element.endAt || new Date(), 'YYYY/MM/DD HH:mm'),
      ],
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
            this.entryCommander.emit({ reload: true });
          }
          return op;
        },
      })
      .subscribe(() => {});
  }

  createShiftForm(create: boolean): FormViewModel[] {
    const result = [
      {
        size: 12,
        elements: [
          this.formService.createInput({
            config: { field: 'title' },
            params: {
              model: '',
              placeHolder: 'TITLE',
            },
            validation: {
              required: { value: true, message: 'TITLE_REQUIRED' },
            },
          }),
        ],
      },
      {
        size: 3,
        elements: [
          this.formService.createNumber({
            config: { field: 'workingHours', label: 'SHIFTS_WORKING_HOURS' },
            params: {
              model: 8,
            },
            validation: {
              required: {
                value: true,
                message: 'SHIFTS_WORKING_HOURS_REQUIRED',
              },
              max: { value: 12, message: 'SHIFTS_WORKING_HOURS_MAX' },
              min: { value: 1, message: 'SHIFTS_WORKING_HOURS_MIN' },
            },
          }),
        ],
      },
      {
        size: 3,
        elements: [
          this.formService.createNumber({
            config: { field: 'restHours', label: 'SHIFTS_REST_HOURS' },
            params: {
              model: 1,
            },
            validation: {
              required: { value: true, message: 'SHIFTS_REST_HOURS_REQUIRED' },
              max: { value: 5, message: 'SHIFTS_REST_HOURS_MAX' },
              min: { value: 1, message: 'SHIFTS_REST_HOURS_MIN' },
            },
          }),
        ],
      },
      {
        size: 3,
        elements: [
          this.formService.createNumber({
            config: { field: 'penaltyRate', label: 'SHIFTS_PENALTY_RATE' },
            params: {
              model: 2,
            },
            validation: {
              required: {
                value: true,
                message: 'SHIFTS_PENALTY_RATE_REQUIRED',
              },
              max: { value: 10, message: 'SHIFTS_PENALTY_RATE_MAX' },
              min: { value: 1, message: 'SHIFTS_PENALTY_RATE_MIN' },
            },
          }),
        ],
      },
      {
        size: 3,
        elements: [
          this.formService.createNumber({
            config: { field: 'rewardRate', label: 'SHIFTS_REWARD_RATE' },
            params: {
              model: 1.4,
            },
            validation: {
              required: { value: true, message: 'SHIFTS_REWARD_RATE_REQUIRED' },
              max: { value: 10, message: 'SHIFTS_REWARD_RATE_MAX' },
              min: { value: 1, message: 'SHIFTS_REWARD_RATE_MIN' },
            },
          }),
        ],
      },
      {
        size: 12,
        elements: [
          this.formService.createDropDown({
            config: { field: 'type', label: 'SHIFT_TYPE' },
            params: {
              enum: 'ShiftType',
              items: [],
              model: ShiftType.Fixed,
              picked: val => {
                result[6].elements[0].config.visible = false;
                result[7].elements[0].config.visible = false;
                result[8].elements[0].config.visible = false;

                switch (val) {
                  case ShiftType.Fixed:
                    result[6].elements[0].config.visible = true;
                    result[7].elements[0].config.visible = true;
                    break;
                  case ShiftType.Float:
                    result[6].elements[0].config.visible = true;
                    result[7].elements[0].config.visible = true;
                    result[8].elements[0].config.visible = true;
                    break;
                  case ShiftType.Open:
                    break;
                }
              },
            },
          }),
        ],
      },
      {
        size: 4,
        elements: [
          this.formService.createTimePicker({
            config: { field: 'start', label: 'SHIFT_START' },
            params: {
              model: '08:30',
            },
          }),
        ],
      },
      {
        size: 4,
        elements: [
          this.formService.createTimePicker({
            config: { field: 'end', label: 'SHIFT_END' },
            params: {
              model: '17:30',
            },
          }),
        ],
      },
      {
        size: 4,
        elements: [
          this.formService.createTimePicker({
            config: { field: 'float', label: 'SHIFT_FLOAT', visible: false },
            params: {
              model: '00:45',
            },
          }),
        ],
      },
      {
        size: 3,
        elements: [
          this.formService.createCheckbox({
            config: {
              field: 'saturday',
              label: '',
            },
            params: {
              model: true,
              label: 'ENUMS_WEEKDAY_SATURDAY',
            },
          }),
        ],
      },
      {
        size: 3,
        elements: [
          this.formService.createCheckbox({
            config: {
              field: 'sunday',
              label: '',
            },
            params: {
              model: true,
              label: 'ENUMS_WEEKDAY_SUNDAY',
            },
          }),
        ],
      },
      {
        size: 3,
        elements: [
          this.formService.createCheckbox({
            config: {
              field: 'monday',
              label: '',
            },
            params: {
              model: true,
              label: 'ENUMS_WEEKDAY_MONDAY',
            },
          }),
        ],
      },
      {
        size: 3,
        elements: [
          this.formService.createCheckbox({
            config: {
              field: 'tuesday',
              label: '',
            },
            params: {
              model: true,
              label: 'ENUMS_WEEKDAY_TUESDAY',
            },
          }),
        ],
      },
      {
        size: 3,
        elements: [
          this.formService.createCheckbox({
            config: {
              field: 'wednesday',
              label: '',
            },
            params: {
              model: true,
              label: 'ENUMS_WEEKDAY_WEDNESDAY',
            },
          }),
        ],
      },
      {
        size: 3,
        elements: [
          this.formService.createCheckbox({
            config: {
              field: 'thursday',
              label: '',
            },
            params: {
              model: true,
              label: 'ENUMS_WEEKDAY_THURSDAY',
            },
          }),
        ],
      },
      {
        size: 3,
        elements: [
          this.formService.createCheckbox({
            config: {
              field: 'friday',
              label: '',
            },
            params: {
              model: true,
              label: 'ENUMS_WEEKDAY_FRIDAY',
            },
          }),
        ],
      },
      {
        size: 12,
        elements: [
          this.formService.createInput({
            config: { field: 'description' },
            params: {
              model: '',
              placeHolder: 'DESCRIPTION',
            },
          }),
        ],
      },
    ] as FormViewModel[];
    return result;
  }

  createShift() {
    this.modalService
      .show(PromptComponent, {
        form: this.createShiftForm(true),
        actionLabel: 'CREATE_SHIFT',
        action: async (model, form) => {
          const op = await this.groupService.createShift(this.group.id, model);
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          this.shiftsCommander.emit({ reload: true });
          return op;
        },
        actionColor: 'primary',
        title: 'CREATE_SHIFT',
      })
      .subscribe(() => {});
  }

  createTimeOff() {
    const form = [
      {
        elements: [
          this.formService.createDropDown({
            config: { field: 'isHourly' },
            params: {
              model: true,
              items: [
                {
                  text: 'TIME_OFF_HOURLY',
                  value: true,
                },
                {
                  text: 'TIME_OFF_DAILY',
                  value: false,
                },
              ] as ListViewModel[],
              picked: value => {
                form[2].elements[0].config.visible = value;
                form[3].elements[0].config.visible = value;
              },
            },
          }),
        ],
      },
      {
        elements: [
          this.formService.createDatePicker({
            config: { field: 'beginAt', label: 'TIME_OFF_BEGIN_AT' },
            params: {
              model: new Date(),
            },
            validation: {
              required: {
                message: 'TIME_OFF_BEGIN_AT_REQUIRED',
                value: true,
              },
            },
          }),
        ],
      },
      {
        size: 6,
        elements: [
          this.formService.createTimePicker({
            config: { field: 'beginAt_time', label: 'TIME_OFF_BEGIN_AT_TIME' },
            params: {
              model: '10:00',
            },
          }),
        ],
      },
      {
        size: 6,
        elements: [
          this.formService.createTimePicker({
            config: { field: 'endAt_time', label: 'TIME_OFF_END_AT_TIME' },
            params: {
              model: '13:00',
            },
          }),
        ],
      },
      {
        elements: [
          this.formService.createInput({
            config: { field: 'description' },
            params: {
              model: '',
              textArea: true,
              placeHolder: 'TIME_OFF_DESCRIPTION',
            },
            validation: {
              required: {
                message: 'TIME_OFF_DESCRIPTION_REQUIRED',
                value: false,
              },
            },
          }),
        ],
      },
    ] as FormViewModel[];

    this.modalService
      .show(PromptComponent, {
        form,
        actionLabel: 'CREATE_TIME_OFF',
        action: async (model, frm) => {
          const beginAtParsed = this.converter.FromDateTime(model.beginAt);
          const beginHourParts = (model.isHourly
            ? model.beginAt_time
            : '00:00'
          ).split(':');
          const endHourParts = (model.isHourly
            ? model.endAt_time
            : '23:59'
          ).split(':');
          const beginAt = this.converter.ToDateTime({
            Year: beginAtParsed.Year,
            Month: beginAtParsed.Month,
            Day: beginAtParsed.Day,
            Hours: +beginHourParts[0],
            Minutes: +beginHourParts[1],
          });
          const endAt = this.converter.ToDateTime({
            Year: beginAtParsed.Year,
            Month: beginAtParsed.Month,
            Day: beginAtParsed.Day,
            Hours: +endHourParts[0],
            Minutes: +endHourParts[1],
          });
          const op = await this.groupService.createTimeOff(this.group.id, {
            beginAt,
            endAt,
            isHourly: model.isHourly,
            description: model.description,
          });
          if (op.status === OperationResultStatus.Success) {
            this.timeOffCommander.emit({ reload: true });
          }
          return op;
        },
        actionColor: 'primary',
        title: 'REQUEST_TIME_OFF',
      })
      .subscribe(() => {});
  }

  editShift(element: any) {
    const form = this.createShiftForm(false);
    this.formService.setModel(form, element);

    switch (element.type) {
      case ShiftType.Float:
        form[8].elements[0].config.visible = true;
        break;
      case ShiftType.Open:
        form[6].elements[0].config.visible = false;
        form[7].elements[0].config.visible = false;
        form[8].elements[0].config.visible = false;
        break;
    }

    this.modalService
      .show(PromptComponent, {
        form,
        actionLabel: 'EDIT_SHIFT',
        action: async (model, frm) => {
          const op = await this.groupService.editShift(element.id, model);
          if (op.status !== OperationResultStatus.Success) {
            // TODO: handle error
            return;
          }
          this.shiftsCommander.emit({ reload: true });
          return op;
        },
        actionColor: 'primary',
        title: 'EDIT_SHIFT',
      })
      .subscribe(() => {});
  }

  shiftMembers(element: any) {}

  deleteShift(element: any) {
    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_SHIFT_CONFIRM_HEADING'),
      [element.title],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_SHIFT',
        message: 'REMOVE_SHIFT_CONFIRM',
        heading,
        actionLabel: 'REMOVE_SHIFT',
        cancelLabel: 'CANCEL',
        action: async () => {
          const op = await this.groupService.removeShift(element.id);
          if (op.status === OperationResultStatus.Success) {
            this.shiftsCommander.emit({ reload: true });
          }
          return op;
        },
      })
      .subscribe(() => {});
  }

  deleteTimeOff(element: any) {
    this.modalService
      .confirm({
        title: 'TIME_OFF_DELETE',
        message: 'TIME_OFF_DELETE_CONFIRM',
        heading: 'TIME_OFF_DELETE_HEADING',
        actionLabel: 'TIME_OFF_DELETE',
        cancelLabel: 'CANCEL',
        action: async () => {
          const op = await this.groupService.deleteTimeOff(element.id);
          if (op.status === OperationResultStatus.Success) {
            this.timeOffCommander.emit({ reload: true });
            return;
          }
          // TODO: handle error
        },
      })
      .subscribe(confirmed => {});
  }

  respondTimeOff(timeOff: any, status: boolean) {
    if (!status) {
      this.modalService
        .confirm({
          title: 'TIME_OFF_DECLINE',
          message: 'TIME_OFF_DECLINE_CONFIRM',
          heading: 'TIME_OFF_DECLINE_HEADING',
          actionLabel: 'TIME_OFF_DECLINE',
          cancelLabel: 'CANCEL',
          action: async () => {
            const op = await this.groupService.declineTimeOff(timeOff.id);
            if (op.status === OperationResultStatus.Success) {
              this.timeOffCommander.emit({ reload: true });
              return;
            }
            // TODO: handle error
          },
        })
        .subscribe(confirmed => {});
      return;
    }

    this.modalService
      .show(TimeOffApproveModalComponent, { timeOff })
      .subscribe(refresh => {
        if (refresh) {
          this.timeOffCommander.emit({ reload: true });
        }
      });
  }

  historyTimeOff(timeOff: any) {
    this.modalService
      .show(TimeOffHistoryModalComponent, { timeOff })
      .subscribe(() => {});
  }
}
