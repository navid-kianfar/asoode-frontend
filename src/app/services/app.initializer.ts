import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CultureService} from './core/culture.service';
import {TranslateService} from './core/translate.service';
import {IdentityService} from './auth/identity.service';
import {EnumsService} from './core/enums.service';
import {MessengerService} from './communication/messenger.service';
import {GroupService} from './groups/group.service';
import {ProjectService} from './projects/project.service';
import {OperationResultStatus} from '../library/core/enums';

@Injectable()
export class AppInitializerProvider {
  loaded: boolean;

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
  }

  async load() {
    const lang = this.cultureService.lang;
    const promise1 = this.refresh();
    const promise2 = this.translateService.load(lang);
    const promise3 = this.enumsService.load();
    return Promise.all([promise1, promise2, promise3]);
  }

  refresh() {
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
        window.location.reload();
      }
    });

    return Promise.all([promise1, promise2, promise3, promise4]);
  }
}

export function AppInitializerFactory(provider: AppInitializerProvider) {
  return () => {
    provider.load().then(() => {
      provider.loaded = true;
    });
  };
}
