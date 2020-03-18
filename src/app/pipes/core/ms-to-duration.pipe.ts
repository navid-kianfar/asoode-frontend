import { Pipe, PipeTransform } from '@angular/core';
import { NumberHelpers } from '../../helpers/number.helpers';

@Pipe({
  name: 'msToDuration',
})
export class MsToDurationPipe implements PipeTransform {
  transform(milliseconds: number): string {
    return NumberHelpers.msToDurationString(milliseconds);
  }
}
