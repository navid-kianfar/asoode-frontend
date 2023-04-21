import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CultureService } from './culture.service';
import { TranslateService } from './translate.service';
import { IdentityService } from '../../auth/services/identity.service';
import { EnumsService } from './enums.service';
import { MessengerService } from '../../messenger/services/messenger.service';
import { GroupService } from '../../groups/services/group.service';
import { ProjectService } from '../../project/services/project.service';

import { OperationResultStatus } from '../lib/enums/operation-result-status';

@Injectable()
export class AppInitializerProvider {
  loaded: boolean;
  profileLoaded: boolean;
  apiNotFound: boolean;

  constructor(
    private readonly http: HttpClient,
    private readonly translateService: TranslateService,
    private readonly identityService: IdentityService,
    private readonly cultureService: CultureService,
    private readonly messengerService: MessengerService,
    private readonly groupService: GroupService,
    private readonly projectService: ProjectService,
    private readonly enumsService: EnumsService,
  ) {
    this.loaded = false;
    this.profileLoaded = false;
  }

  async load() {
    const lang = this.cultureService.lang;
    const promise1 = this.refresh();
    const promise2 = this.translateService.load(lang);
    const promise3 = this.enumsService.load();
    return Promise.all([promise1, promise2, promise3]).catch((err) => {
      if (err.status === 404) {
        this.apiNotFound = true;
      }
    });
  }

  async refresh() {
    if (!this.identityService.identity.token) {
      return Promise.resolve();
    }

    const promise1 = this.identityService.load();
    const promise2 = this.messengerService.load();
    const promise3 = this.groupService.load();
    const promise4 = this.projectService.load();

    promise1.then(op => {
      if (op.status === OperationResultStatus.NotFound) {
        this.identityService.logout();
        window.location.href = '/';
        return;
      }
    });

    return Promise.all([promise1, promise2, promise3, promise4]).then(() => {
      this.profileLoaded = true;
      return Promise.resolve();
    });
  }
}

export function AppInitializerFactory(provider: AppInitializerProvider) {
  return () => {
    provider.load().then(() => {
      provider.loaded = true;
    });
  };
}