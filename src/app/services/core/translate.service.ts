import { Injectable } from '@angular/core';
import { CultureService } from './culture.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private readonly repository: any = null;

  constructor(
    readonly cultureService: CultureService,
    readonly client: HttpClient,
  ) {
    this.repository = {};
    this.repository[this.cultureService.lang] = {};
  }

  async loadTranslate(culture: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = `assets/i18n/${culture}.json`;
      this.client.get(path).subscribe(
        (response: string) => {
          this.repository[culture] = response;
          resolve();
        },
        (err: Error) => {
          this.repository[culture] = {};
          reject(err);
        },
      );
    });
  }

  public fromKey(
    value: string,
    skipLog: boolean = false,
    fallback: string = '',
  ): string {
    value = value || '';
    let result = this.repository[this.cultureService.lang][value];
    if ((result === null || result === undefined) && fallback) {
      result = this.repository[this.cultureService.lang][fallback];
    }
    if ((result === null || result === undefined) && !skipLog) {
      console.log('Translate not found : ', value);
    }
    return result || fallback || value;
  }
}
