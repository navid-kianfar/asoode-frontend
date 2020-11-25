import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TaskService } from '../../../services/projects/task.service';
import {
  KartablViewModel,
  TimeSpentViewModel,
  WorkPackageTaskViewModel,
} from '../../../view-models/projects/project-types';
import {TranslateService} from '../../../services/core/translate.service';
import {IdentityService} from '../../../services/auth/identity.service';
import {GoogleAnalyticsService} from 'ngx-google-analytics';

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
  constructor(
    private readonly taskService: TaskService,
    private readonly translateService: TranslateService,
    readonly identityService: IdentityService,
    private readonly gaService: GoogleAnalyticsService,
  ) {}

  ngOnInit() {
    this.gaService.pageView(
      window.location.pathname,
      this.translateService.fromKey('FILES'),
      undefined,
      { user_id: this.identityService.identity.userId },
    );
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

  onBeginChange($event: Date) {
    if (!$event) {
      return;
    }
    setTimeout(() => {
      if (!this.beginDate || this.beginDate.getTime() !== $event.getTime()) {
        this.beginDate = $event;
        if (this.tab === undefined) {
          this.switchTab(TaskTab.Calendar);
        } else {
          this.switchTab(this.tab);
        }
      }
    }, 100);
  }

  onEndChange($event: Date) {
    setTimeout(() => {
      this.endDate = $event;
    }, 10);
  }
}
export enum TaskTab {
  Calendar = 0,
  TimeSpent = 1,
  Kartabl = 2,
}
