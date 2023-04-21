import { Component, Input, OnInit } from '@angular/core';
import {
  ProjectViewModel,
  WorkPackageTaskViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { AccessType, DurationMode } from '../../../shared/lib/enums/enums';
import { CultureService } from '../../../shared/services/culture.service';
import { NumberHelpers } from '../../../shared/helpers/number.helpers';
import { CulturedDateService } from '../../../shared/services/cultured-date.service';
import { IDateConverter } from '../../../shared/lib/date-time/date-contracts';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-work-package-calendar',
  templateUrl: './work-package-calendar.component.html',
  styleUrls: ['./work-package-calendar.component.scss'],
})
export class WorkPackageCalendarComponent implements OnInit {
  @Input() project: ProjectViewModel;
  @Input() model: WorkPackageViewModel;
  @Input() permission: AccessType;
  calendarData: WorkPackageTaskViewModel[];
  DurationMode = DurationMode;
  ViewMode = ViewMode;
  mode: ViewMode;
  beginDate: Date;
  endDate: Date;
  hours: number[];
  NumberHelpers = NumberHelpers;
  days: { date: string; events: any }[];
  private converter: IDateConverter;
  constructor(
    readonly cultureService: CultureService,
    private readonly culturedDateService: CulturedDateService,
    private readonly modalService: ModalService,
  ) {}

  allTasks(): WorkPackageTaskViewModel[] {
    return this.model.lists
      .map(l => l.tasks)
      .reduce((prev, curr) => prev.concat(curr), []);
  }

  ngOnInit() {
    this.converter = this.culturedDateService.Converter();
    this.hours = Array(24)
      .fill(0)
      .map((e, i) => i + 1);

    this.mode = ViewMode.Month;
  }

  switchMode(mode: ViewMode) {
    const data = {};
    this.calendarData = this.allTasks()
      .filter(f => f.dueAt)
      .map(t => {
        t.dueAt = new Date(t.dueAt);
        t.dueAtFormatted = this.converter.Format(t.dueAt, 'YYYY/MM/DD');
        return t;
      });

    let condition = true;
    const begin = new Date(this.beginDate);
    const endParsed = this.converter.Format(this.endDate, 'YYYY/MM/DD');
    do {
      let beginParsed = this.converter.Format(begin, 'YYYY/MM/DD');

      data[beginParsed] = this.calendarData.filter(f => {
        return beginParsed === f.dueAtFormatted;
      });
      condition = beginParsed !== endParsed;

      begin.setDate(begin.getDate() + 1);
      beginParsed = this.converter.Format(begin, 'YYYY/MM/DD');
    } while (condition);

    this.days = Object.keys(data).map(k => {
      return {
        date: k,
        events: data[k],
      };
    });
    console.log(this.days);
    this.mode = mode;
  }

  onBeginChange($event: Date) {
    if (!$event) {
      return;
    }
    setTimeout(() => {
      if (!this.beginDate || this.beginDate.getTime() !== $event.getTime()) {
        this.beginDate = $event;
        this.switchMode(this.mode);
      }
    }, 100);
  }

  onEndChange($event: Date) {
    setTimeout(() => {
      this.endDate = $event;
    }, 10);
  }

  async openTask($event, task) {
    $event.stopPropagation();
    $event.preventDefault();
    // await this.modalService
    //   .show(TaskModalComponent, {
    //     id: task.id,
    //     project: this.project,
    //     workPackage: this.model,
    //   });
  }
}
export enum ViewMode {
  Day = 1,
  Week = 2,
  Month = 3,
}
