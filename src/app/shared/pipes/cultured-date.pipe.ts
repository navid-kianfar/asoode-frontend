import { Pipe, PipeTransform } from '@angular/core';
import { CulturedDateService } from '../services/cultured-date.service';

@Pipe({ name: 'culturedDate' })
export class CulturedDatePipe implements PipeTransform {
  constructor(readonly culturedDate: CulturedDateService) {}

  transform(value: string | Date, time?: boolean, format?: string): string {
    return this.culturedDate.toString(value, time, format);
  }
}
