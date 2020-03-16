import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TranslateService } from './translate.service';
import { StringHelpers } from '../../helpers/string.helpers';

@Injectable({
  providedIn: 'root',
})
export class MaterialTranslatorService {
  constructor(private readonly translateService: TranslateService) {}

  paginator(paginator: MatPaginator) {
    paginator._intl.firstPageLabel = this.translateService.fromKey(
      'PAGINATOR_FIRST',
    );
    paginator._intl.itemsPerPageLabel = this.translateService.fromKey(
      'PAGINATOR_PER_PAGE',
    );
    paginator._intl.lastPageLabel = this.translateService.fromKey(
      'PAGINATOR_LAST',
    );
    paginator._intl.nextPageLabel = this.translateService.fromKey(
      'PAGINATOR_NEXT',
    );
    paginator._intl.previousPageLabel = this.translateService.fromKey(
      'PAGINATOR_PREV',
    );
    paginator._intl.getRangeLabel = (page, pageSize, length) => {
      const from = page * pageSize;
      const to = from + pageSize;
      return StringHelpers.format(
        this.translateService.fromKey('PAGINATOR_OF'),
        [from + 1, to, length],
      );
    };
  }
}
