import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  public transform(value, keys: string[], term: any): any[] {
    if (!term) {
      return value;
    }
    if (typeof term === 'string') {
      const exp = new RegExp(term, 'gi');
      return (value || []).filter(item => {
        return keys.some(
          key =>
            (item.hasOwnProperty(key) && exp.test(item[key])) ||
            (!item.hasOwnProperty(key) && exp.test(item)),
        );
      });
    }
    return (value || []).filter(item => {
      return keys.some(
        key =>
          (item.hasOwnProperty(key) && item[key] === term) ||
          (!item.hasOwnProperty(key) && item[key] === term),
      );
    });
  }
}
