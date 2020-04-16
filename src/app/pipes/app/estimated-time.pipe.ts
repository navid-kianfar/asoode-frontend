import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estimatedTime'
})
export class EstimatedTimePipe implements PipeTransform {

  transform(value: number): string {
    return '1:12:13';
  }

}
