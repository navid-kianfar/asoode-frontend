import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'culturedDateTime',
})
export class CulturedDateTimePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return null;
  }
}
