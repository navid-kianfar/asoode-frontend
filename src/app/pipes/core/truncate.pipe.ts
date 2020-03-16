import { Pipe, PipeTransform } from '@angular/core';
import {StringHelpers} from '../../helpers/string.helpers';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(input: string, limit: number, middle?: boolean): any {
    return StringHelpers.truncate(input, limit, middle);
  }

}
