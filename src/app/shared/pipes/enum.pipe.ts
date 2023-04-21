import { Pipe, PipeTransform } from '@angular/core';
import { EnumsService } from '../services/enums.service';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'enum',
})
export class EnumPipe implements PipeTransform {
  constructor(
    private readonly enumsService: EnumsService,
    private readonly translateService: TranslateService,
  ) {}

  transform(value: any, name: string): string {
    const key = this.enumsService.translateKey(name, value);
    return this.translateService.fromKey(key);
  }
}
