import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../../services/core/translate.service';
import { NumberHelpers } from '../../helpers/number.helpers';
import { StringHelpers } from '../../helpers/string.helpers';

@Pipe({
  name: 'estimatedTime',
})
export class EstimatedTimePipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  transform(value: number): string {
    const model = NumberHelpers.ticksToTimeSpan(value);
    return StringHelpers.format(
      this.translateService.fromKey('TIME_SPAN_DURATION'),
      [model.day, model.hour, model.minute],
    );
  }
}
