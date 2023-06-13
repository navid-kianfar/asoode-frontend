import { Injectable } from '@angular/core';
import { TranslateService } from './translate.service';
import { StringHelpers } from '../../helpers/string.helpers';
import { MatPaginator } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root',
})
export class MaterialTranslatorService {
  constructor(private readonly translateService: TranslateService) {}

  paginator(paginator: MatPaginator) {
    paginator._intl.firstPageLabel =
      this.translateService.fromKey('PAGINATOR_FIRST');
    paginator._intl.itemsPerPageLabel =
      this.translateService.fromKey('PAGINATOR_PER_PAGE');
    paginator._intl.lastPageLabel =
      this.translateService.fromKey('PAGINATOR_LAST');
    paginator._intl.nextPageLabel =
      this.translateService.fromKey('PAGINATOR_NEXT');
    paginator._intl.previousPageLabel =
      this.translateService.fromKey('PAGINATOR_PREV');
    paginator._intl.getRangeLabel = (page, pageSize, length) => {
      let from = 0;
      let to = 0;
      if (length) {
        from = page * pageSize + 1;
        to = from + pageSize - 1;
        if (to > length) {
          to = length;
        }
      }
      return StringHelpers.format(
        this.translateService.fromKey('PAGINATOR_OF'),
        [from, to, length],
      );
    };
  }
}
