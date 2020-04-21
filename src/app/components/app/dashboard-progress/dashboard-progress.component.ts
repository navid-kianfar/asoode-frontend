import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import {
  DayReportViewModel,
  OverallViewModel,
} from '../../../view-models/general/report-types';
import { CulturedDateService } from '../../../services/core/cultured-date.service';
import { TranslateService } from '../../../services/core/translate.service';

@Component({
  selector: 'app-dashboard-progress',
  templateUrl: './dashboard-progress.component.html',
  styleUrls: ['./dashboard-progress.component.scss'],
})
export class DashboardProgressComponent implements OnInit, AfterViewInit {
  @Input() model: DayReportViewModel[];
  @Input() begin: Date;
  @Input() end: Date;
  chartData: any;
  view: number[];
  timer: number;
  hidden: any;

  constructor(
    private element: ElementRef,
    private readonly culturedDateService: CulturedDateService,
    private readonly translateService: TranslateService,
  ) {}

  onResize(event?: any) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.hidden = true;
      setTimeout(() => {
        this.calculateView();
        this.hidden = false;
      }, 150);
    }, 500);
  }

  calculateView() {
    const bound = this.element.nativeElement.parentNode.getBoundingClientRect();
    let width = bound.width - 50;
    if (width < 300) {
      width = 300;
    }
    this.view = [width, 200];
  }

  ngOnInit() {
    this.hidden = true;

    const totalLabel = this.translateService.fromKey('CREATED_CARDS');
    const doneLabel = this.translateService.fromKey('DONE_CARDS');
    const blockedLabel = this.translateService.fromKey('BLOCKED_CARDS');

    const data = {};
    const begin = new Date(this.begin.getTime());
    const converter = this.culturedDateService.Converter();
    let condition = true;
    do {
      const date = converter.FromDateTime(begin);
      const key = `${date.Month}/${date.Day}`;
      const info = this.model.find(i => this.sameDay(i.date, begin)) || {
        total: 0,
        done: 0,
        blocked: 0,
        date: undefined,
      };
      data[key] = data[key] || [
        {
          name: blockedLabel,
          value: info.blocked,
        },
        {
          name: doneLabel,
          value: info.done,
        },
        {
          name: totalLabel,
          value: info.total,
        },
      ];

      begin.setDate(begin.getDate() + 1);
      condition = this.sameDay(begin, this.end);
    } while (!condition);

    this.chartData = Object.keys(data).map(k => {
      return {
        name: k,
        series: data[k],
      };
    });
    this.onResize();
  }

  sameDay(begin: Date | string, end: Date | string): boolean {
    if (typeof begin === 'string') {
      begin = new Date(begin);
    }
    if (typeof end === 'string') {
      end = new Date(end);
    }
    return (
      begin.getDate() === end.getDate() &&
      begin.getMonth() === end.getMonth() &&
      begin.getFullYear() === end.getFullYear()
    );
  }

  formatY(val) {
    if ((val * 10) % 10) {
      return '';
    }
    return Math.floor(val);
  }
  ngAfterViewInit(): void {}
}
