import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memberFilter',
})
export class MemberFilterPipe implements PipeTransform {
  public transform(value, term: string): any[] {
    if (!term || !term.trim()) {
      return value;
    }
    const exp = new RegExp(term, 'gi');
    return (value || []).filter((item) => {
      return (
        exp.test(item.member.fullName) ||
        exp.test(item.member.phone) ||
        exp.test(item.member.email)
      );
    });
  }
}
