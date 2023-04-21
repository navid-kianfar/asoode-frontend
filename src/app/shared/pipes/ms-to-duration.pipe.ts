import { Pipe, PipeTransform } from '@angular/core';
import { NumberHelpers } from '../helpers/number.helpers';

@Pipe({
  name: 'msToDuration',
})
export class MsToDurationPipe implements PipeTransform {
  transform(milliseconds: number): string {
    const model = NumberHelpers.ticksToTimeSpan(milliseconds * 10000);
    return `${NumberHelpers.pad(model.day, 2)}:${NumberHelpers.pad(
      model.hour,
      2,
    )}:${NumberHelpers.pad(model.minute, 2)}`;
  }
}
