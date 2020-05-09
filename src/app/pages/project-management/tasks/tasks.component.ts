import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/projects/task.service';
import {
  KartablViewModel,
  TimeSpentViewModel,
  WorkPackageTaskViewModel,
} from '../../../view-models/projects/project-types';
import { CulturedDateService } from '../../../services/core/cultured-date.service';
import { IDateConverter } from '../../../library/core/date-time/date-contracts';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tab: number;
  endDate: Date;
  beginDate: Date;
  waiting: boolean;
  TaskTab = TaskTab;
  calendarData: WorkPackageTaskViewModel[];
  timeSpentData: TimeSpentViewModel[];
  kartablData: KartablViewModel;
  converter: IDateConverter;
  constructor(
    private readonly taskService: TaskService,
    private readonly culturedDateService: CulturedDateService,
  ) {}

  ngOnInit() {
    this.converter = this.culturedDateService.Converter();
    this.thisMonth();
    this.switchTab(TaskTab.Calendar);
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

  async switchTab(tab: TaskTab) {
    this.waiting = true;
    switch (tab) {
      case TaskTab.Calendar:
        const op1 = await this.taskService.calendar({
          begin: this.beginDate,
          end: this.endDate,
        });
        this.calendarData = op1.data || [];
        break;
      case TaskTab.TimeSpent:
        const op2 = await this.taskService.timeSpents({
          begin: this.beginDate,
          end: this.endDate,
        });
        this.timeSpentData = op2.data || [];
        break;
      case TaskTab.Kartabl:
        const op3 = await this.taskService.kartabl({
          begin: this.beginDate,
          end: this.endDate,
        });
        this.kartablData = op3.data;
        break;
    }
    this.waiting = false;
    this.tab = tab;
  }
}
export enum TaskTab {
  Calendar = 0,
  TimeSpent = 1,
  Kartabl = 2,
}
