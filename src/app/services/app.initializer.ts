import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CultureService } from './core/culture.service';
import { TranslateService } from './core/translate.service';
import { IdentityService } from './auth/identity.service';
import { EnumsService } from './core/enums.service';

@Injectable()
export class AppInitializerProvider {
  constructor(
    private readonly http: HttpClient,
    private readonly translateService: TranslateService,
    private readonly identityService: IdentityService,
    private readonly cultureService: CultureService,
    private readonly enumsService: EnumsService,
  ) {}

  async load() {
    const lang = this.cultureService.lang;
    const promise1 = this.refresh();
    const promise2 = this.translateService.loadTranslate(lang);
    const promise3 = this.enumsService.load();
    return Promise.all([promise1, promise2, promise3]);
  }

  refresh() {
    const promise1 = this.identityService.loadProfile();
    return Promise.all([promise1]);
  }
}

export function AppInitializerFactory(provider: AppInitializerProvider) {
  return () => provider.load();
}
