import { Component, Input, OnInit } from '@angular/core';
import {
  TimeSpentMappedViewModel,
  TimeSpentViewModel,
  WorkPackageTaskViewModel,
} from '../../../view-models/projects/project-types';
import { CulturedDateService } from '../../../services/core/cultured-date.service';
import { IDateConverter } from '../../../library/core/date-time/date-contracts';
import { NumberHelpers } from '../../../helpers/number.helpers';
import { TaskModalComponent } from '../../../modals/task-modal/task-modal.component';
import { ModalService } from '../../../services/core/modal.service';

@Component({
  selector: 'app-time-spent',
  templateUrl: './time-spent.component.html',
  styleUrls: ['./time-spent.component.scss'],
})
export class TimeSpentComponent implements OnInit {
  @Input() beginDate: Date;
  @Input() endDate: Date;
  @Input() model: TimeSpentViewModel[];

  hours: number[];
  data: TimeSpentMappedViewModel[];
  private converter: IDateConverter;
  NumberHelpers = NumberHelpers;
  constructor(
    readonly culturedDateService: CulturedDateService,
    readonly modalService: ModalService,
  ) {}

  ngOnInit() {
    this.hours = Array(24)
      .fill(0)
      .map((e, i) => i);
    this.converter = this.culturedDateService.Converter();
    this.paint();
  }

  calculateStyle(begin: Date, end: Date): any {
    const style = {} as any;
    if (this.culturedDateService.cultureService.rtl) {
      style.right = begin.getMinutes() + 'px';
    } else {
      style.left = begin.getMinutes() + 'px';
    }
    const gap = end.getTime() - begin.getTime();
    style.width = gap / 60 / 1000 + 'px';
    return style;
  }

  paint() {
    const data = {} as any;
    this.model.forEach(m => {
      m.time.begin = new Date(m.time.begin);
      m.time.end = new Date(m.time.end);
      m.style = this.calculateStyle(m.time.begin, m.time.end);
      m.parsed = this.converter.FromDateTime(m.time.begin);
      const key = `${m.parsed.Day}/${m.parsed.Month}`;
      data[key] = data[key] || [];
      data[key].push(m);
    });
    const mappedByDate = Object.keys(data).map(k => {
      return {
        date: k,
        data: data[k],
      };
    });
    this.data = mappedByDate.map(m => {
      const grouped = {} as any;
      m.data.forEach(d => {
        grouped[d.time.userId] = grouped[d.time.userId] || [];
        grouped[d.time.userId].push(d);
      });
      return {
        members: Object.keys(grouped).map(k => {
          return {
            userId: k,
            times: grouped[k],
          };
        }),
        title: m.date,
        date: m.data[0].parsed,
      } as TimeSpentMappedViewModel;
    }) as TimeSpentMappedViewModel[];
  }

  openTask($event: MouseEvent, task: WorkPackageTaskViewModel) {
    $event.stopPropagation();
    $event.preventDefault();
    this.modalService
      .show(TaskModalComponent, {
        id: task.id,
        projectId: task.projectId,
        packageId: task.packageId
      })
      .subscribe(() => {});
  }
}
