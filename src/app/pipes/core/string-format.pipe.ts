import { Pipe, PipeTransform } from '@angular/core';
import { StringHelpers } from '../../helpers/string.helpers';

@Pipe({
  name: 'stringFormat',
})
export class StringFormatPipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    return StringHelpers.format(value, args);
  }
}
