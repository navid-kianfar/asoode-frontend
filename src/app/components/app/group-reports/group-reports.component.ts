import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../view-models/groups/group-types';
import { AccessType } from '../../../library/app/enums';
import { IDateConverter } from '../../../library/core/date-time/date-contracts';
import { CulturedDateService } from '../../../services/core/cultured-date.service';
import { ModalService } from '../../../services/core/modal.service';
import { GroupService } from '../../../services/groups/group.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { DayReportViewModel } from '../../../view-models/general/report-types';

@Component({
  selector: 'app-group-reports',
  templateUrl: './group-reports.component.html',
  styleUrls: ['./group-reports.component.scss'],
})
export class GroupReportsComponent implements OnInit {
  @Input() group: GroupViewModel;
  @Input() permission: AccessType;
  waiting: boolean;
  model: DayReportViewModel[];
  endDate: Date;
  beginDate: Date;
  converter: IDateConverter;
  constructor(
    readonly culturedDateService: CulturedDateService,
    readonly modalService: ModalService,
    private readonly groupService: GroupService,
  ) {}

  ngOnInit() {
    this.converter = this.culturedDateService.Converter();
    this.thisMonth();
    this.fetch();
  }

  thisMonth() {
    const now = new Date();
    const parsed = this.converter.FromDateTime(now);
    this.beginDate = this.converter.ToDateTime({
      Year: parsed.Year,
      Month: parsed.Month,
      Day: 1,
      Hours: 0,
      Minutes: 0,
    });
    const lastDayInMonth =
      this.culturedDateService.cultureService.current.daysInMonths[
        parsed.Month - 1
      ];
    this.endDate = this.converter.ToDateTime({
      Year: parsed.Year,
      Month: parsed.Month,
      Day: lastDayInMonth,
      Hours: 23,
      Minutes: 59,
    });
  }

  async fetch() {
    this.model = [];
    this.waiting = true;
    const op = await this.groupService.report(this.group.id, {
      begin: this.beginDate,
      end: this.endDate,
    });
    this.waiting = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.model = op.data;
  }
}
