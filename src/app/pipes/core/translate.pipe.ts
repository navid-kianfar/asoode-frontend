import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../../services/core/translate.service';

@Pipe({
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  transform(
    value: string,
    skipLog: boolean = false,
    fallback: string = '',
  ): string {
    return this.translateService.fromKey(value, skipLog, fallback);
  }
}
