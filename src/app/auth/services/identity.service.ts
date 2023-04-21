import { Injectable } from '@angular/core';
import {
  IdentityObject,
  MemberInfoViewModel,
  ProfileViewModel,
} from '../../view-models/auth/identity-types';
import { HttpService } from '../../shared/services/http.service';
import { OperationResult } from '../../shared/lib/operation-result';
import {
  DeviceViewModel,
  ForgotResultViewModel,
  LoginResultViewModel,
  RegisterResultViewModel,
} from '../../view-models/auth/identity-view-models';
import { CookieService } from 'ngx-cookie-service';
import {environment} from '../../../environments/environment';
import { OperationResultStatus } from '../../shared/lib/enums/operation-result-status';

let MARKETER;
try {
  MARKETER =
    new URLSearchParams(window.location.search).get('marketer') || undefined;
} catch (e) {}

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private readonly STORAGE_KEY = 'ASOODE_AUTH';
  private identityObject: IdentityObject;
  private profileObject: ProfileViewModel = {} as ProfileViewModel;

  constructor(
    private readonly httpService: HttpService,
    private readonly cookieService: CookieService,
  ) {
    this.identityObject = this.getIdentityInfo();
  }

  get profile(): ProfileViewModel {
    return this.profileObject;
  }

  private getIdentityInfo(): IdentityObject {
    if (localStorage) {
      const identityJson = localStorage.getItem(this.STORAGE_KEY);
      if (identityJson) {
        return JSON.parse(identityJson) as IdentityObject;
      }
    }
    return { token: null, username: null, userId: null };
  }

  setIdentityInfo(identity: IdentityObject) {
    this.identityObject = identity;
    if (localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(identity));
    }
  }

  private removeIdentityInfo() {
    if (localStorage) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.identityObject = { token: null, username: null, userId: null };
  }

  get identity(): IdentityObject {
    return this.identityObject;
  }

  logout() {
    this.removeIdentityInfo();
  }

  async login(model: any): Promise<OperationResult<LoginResultViewModel>> {
    const op = await this.httpService.post<LoginResultViewModel>(
      '/account/login',
      model,
    );
    if (op.status === OperationResultStatus.Success) {
      if (op.data.token) {
        this.setIdentityInfo({
          userId: op.data.userId,
          token: op.data.token,
          username: op.data.username,
        });
      }
    }
    return op;
  }

  async register(
    model: any,
  ): Promise<OperationResult<RegisterResultViewModel>> {
    const op = await this.httpService.post<RegisterResultViewModel>(
      '/account/register',
      model,
    );

    if (op.status === OperationResultStatus.Success) {
      if (op.data.token) {
        this.setIdentityInfo({
          userId: op.data.userId,
          token: op.data.token,
          username: op.data.username,
        });
      }
    }
    return op;
  }

  async load(): Promise<OperationResult<any>> {
    const op = await this.httpService.get<any>('/account/profile', false);
    if (op.status === OperationResultStatus.Success) {
      this.profileObject = op.data;
      document.body.classList.remove('dark-mode');
      if (op.data.darkMode) {
        document.body.classList.add('dark-mode');
      }
    } else if (environment.production) {
      // this.logout();
      // setTimeout(() => { window.location.href = '/'; }, 500);
      setTimeout(() => window.location.reload(), 500);
    }
    return op;
  }

  async verifyAccount(params): Promise<OperationResult<LoginResultViewModel>> {
    const op = await this.httpService.post<LoginResultViewModel>(
      '/account/confirm',
      params,
    );
    if (op.status === OperationResultStatus.Success) {
      this.setIdentityInfo({
        userId: op.data.userId,
        token: op.data.token,
        username: op.data.username,
      });
    }
    return op;
  }

  async forgot(params: any): Promise<OperationResult<ForgotResultViewModel>> {
    return await this.httpService.post<ForgotResultViewModel>(
      '/account/password/forget',
      params,
    );
  }

  async resetPassword(
    params: any,
  ): Promise<OperationResult<LoginResultViewModel>> {
    const op = await this.httpService.post<LoginResultViewModel>(
      '/account/password/recover',
      params,
    );
    if (op.status === OperationResultStatus.Success) {
      this.setIdentityInfo({
        userId: op.data.userId,
        token: op.data.token,
        username: op.data.username,
      });
    }
    return op;
  }

  async updateProfile(model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.formUpload<boolean>(
      '/account/profile/update',
      model,
    );
  }

  async changePassword(model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      '/account/password/change',
      model,
    );
  }

  async changeEmail(model: any): Promise<OperationResult<string>> {
    return await this.httpService.post<string>('/account/email/change', model);
  }

  async changePhone(model: any): Promise<OperationResult<string>> {
    return await this.httpService.post<string>('/account/phone/change', model);
  }

  async confirmPhone(model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      '/account/phone/change/confirm',
      model,
    );
  }

  async confirmEmail(model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      '/account/email/change/confirm',
      model,
    );
  }

  async resendVerification(id): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      '/account/resend/verification/' + id,
    );
  }

  async devices(): Promise<OperationResult<DeviceViewModel[]>> {
    return await this.httpService.post<DeviceViewModel[]>('/account/devices');
  }

  async addDevice(model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>('/account/devices/add', model);
  }

  async removeDevice(id): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      '/account/devices/remove/' + id,
    );
  }
  async toggleDevice(id): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      '/account/devices/toggle/' + id,
    );
  }
  async renameDevice(id, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      '/account/devices/rename/' + id,
      model,
    );
  }

  async getMemberInfo(
    userId: string,
  ): Promise<OperationResult<MemberInfoViewModel>> {
    return await this.httpService.post<MemberInfoViewModel>(
      '/account/profile/' + userId,
    );
  }
}
