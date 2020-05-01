import { Component, OnInit } from '@angular/core';
import {TaskService} from '../../../services/projects/task.service';
import {KartablViewModel, TimeSpentViewModel, WorkPackageTaskViewModel} from '../../../view-models/projects/project-types';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tab: number;
  beginDate: Date;
  waiting: boolean;
  TaskTab = TaskTab;
  calendarData: WorkPackageTaskViewModel[];
  timeSpentData: TimeSpentViewModel[];
  kartablData: KartablViewModel[];
  constructor(private readonly taskService: TaskService) {}

  ngOnInit() {
    this.beginDate = new Date();
    this.switchTab(TaskTab.Calendar);
  }

  async switchTab(tab: TaskTab) {
    // TODO: fix this
    const beginDate = new Date();
    const endDate = new Date();
    this.waiting = true;
    switch (tab) {
      case TaskTab.Calendar:
        const op1 = await this.taskService.calendar({
          begin: beginDate,
          end: endDate
        });
        this.calendarData = op1.data || [];
        break;
      case TaskTab.TimeSpent:
        const op2 = await this.taskService.timeSpents({
          begin: beginDate,
          end: endDate
        });
        this.timeSpentData = op2.data || [];
        break;
      case TaskTab.Kartabl:
        const op3 = await this.taskService.kartabl({
          begin: beginDate,
          end: endDate
        });
        this.kartablData = op3.data || [];
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
