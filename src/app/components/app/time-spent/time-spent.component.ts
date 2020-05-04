import {Component, Input, OnInit} from '@angular/core';
import {TimeSpentMappedViewModel, TimeSpentViewModel} from '../../../view-models/projects/project-types';
import {ArrayHelpers} from '../../../helpers/array.helpers';
import {CulturedDateService} from '../../../services/core/cultured-date.service';
import {IDateConverter} from '../../../library/core/date-time/date-contracts';
import {NumberHelpers} from '../../../helpers/number.helpers';

@Component({
  selector: 'app-time-spent',
  templateUrl: './time-spent.component.html',
  styleUrls: ['./time-spent.component.scss']
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
  ) { }

  ngOnInit() {
    this.hours = Array(24).fill(0).map((e, i) => i);
    this.converter = this.culturedDateService.Converter();
    this.paint();
  }

  paint() {
    const data = {} as any;
    this.model.forEach(m => {
      const parsed = this.converter.FromDateTime(m.time.begin);
      const key = `${parsed.Day}/${parsed.Month}`;
      data[key] = data[key] || [];
      data[key].push({
        parsed,
        data: m
      });
    });
    const mappedByDate = Object.keys(data).map(k => {
      return {
        date: k,
        data: data[k]
      };
    });
    this.data = mappedByDate.map(m => {
      const grouped = {} as any;
      m.data.forEach((d) => {
        grouped[d.data.time.userId] = grouped[d.data.time.userId] || [];
        grouped[d.data.time.userId].push(d.data);
      });
      return {
        members: Object.keys(grouped).map(k => {
          return {
            userId: k,
            times: grouped[k]
          };
        }),
        title: m.date,
        date: m.data[0].parsed,
      } as TimeSpentMappedViewModel;
    }) as TimeSpentMappedViewModel[];
    console.log(this.data);
  }
}
