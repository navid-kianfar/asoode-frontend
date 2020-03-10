import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
})
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    const parts = name.split(' ');
    if (parts.length === 1) {
      return name.substring(0, 2);
    }
    return `${parts[0][0]}${parts[1][0] || ''}`;
  }
}
