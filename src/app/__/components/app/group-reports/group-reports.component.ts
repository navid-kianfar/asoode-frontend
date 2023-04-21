import { Component, Input, OnInit } from '@angular/core';
import { GroupViewModel } from '../../../../view-models/groups/group-types';
import { AccessType } from '../../../../shared/lib/enums/enums-2';
import { IDateConverter } from '../../../../shared/lib/date-time/date-contracts';
import { CulturedDateService } from '../../../../shared/services/cultured-date.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { GroupService } from '../../../../groups/services/group.service';
import { DayReportViewModel } from '../../../../view-models/general/report-types';
import { OperationResultStatus } from '../../../../shared/lib/enums/operation-result-status';

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
    const lastDayInMonth = this.culturedDateService.cultureService.current
      .daysInMonths[parsed.Month - 1];
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
