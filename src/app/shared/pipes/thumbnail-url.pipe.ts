import { Pipe, PipeTransform } from '@angular/core';
import {StringHelpers} from '../helpers/string.helpers';
import {environment} from '../../../environments/environment';

const emptyImage = '';

@Pipe({
  name: 'thumbnailUrl'
})
export class ThumbnailUrlPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) { return emptyImage; }

    const encoded = StringHelpers.base64encode(value);
    return `${environment.office_endpoint}/document/thumbnail/${encoded}`
  }

}
