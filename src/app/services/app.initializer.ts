import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CultureService } from './core/culture.service';
import { TranslateService } from './core/translate.service';
import { IdentityService } from './auth/identity.service';

@Injectable()
export class AppInitializerProvider {
  constructor(
    private readonly http: HttpClient,
    private readonly translateService: TranslateService,
    private readonly identityService: IdentityService,
    private readonly cultureService: CultureService,
  ) {}

  async load() {
    const lang = this.cultureService.lang;
    const promise1 = this.translateService.loadTranslate(lang);
    const promise2 = this.refresh();
    return Promise.all([promise1, promise2]);
  }

  refresh() {
    const promise1 = this.identityService.loadProfile();
    return Promise.all([promise1]);
  }
}

export function AppInitializerFactory(provider: AppInitializerProvider) {
  return () => provider.load();
}
