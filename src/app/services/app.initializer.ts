import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {CultureService} from './core/culture.service';
import {TranslateService} from './core/translate.service';

@Injectable()
export class AppInitializerProvider {
  constructor(
    private readonly http: HttpClient,
    private readonly translateService: TranslateService,
    private readonly cultureService: CultureService,
  ) {}

  async load() {
    const lang = this.cultureService.lang;
    await this.translateService.loadTranslate(lang);
    return Promise.resolve();
  }
}

export function AppInitializerFactory(provider: AppInitializerProvider) {
  return () => provider.load();
}
