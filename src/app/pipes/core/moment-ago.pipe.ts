import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'momentAgo'
})
export class MomentAgoPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
