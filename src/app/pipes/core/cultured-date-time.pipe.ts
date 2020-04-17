import { Pipe, PipeTransform } from '@angular/core';
import { CulturedDateService } from '../../services/core/cultured-date.service';

@Pipe({
  name: 'culturedDateTime',
})
export class CulturedDateTimePipe implements PipeTransform {
  constructor(readonly culturedDate: CulturedDateService) {}

  transform(value: string | Date, format?: string): string {
    return this.culturedDate.toString(value, false, format || 'WW YYYY/MM/DD');
  }
}
