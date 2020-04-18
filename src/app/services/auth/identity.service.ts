import { Injectable } from '@angular/core';
import {
  IdentityObject,
  ProfileViewModel,
} from '../../view-models/auth/identity-types';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import { OperationResultStatus } from '../../library/core/enums';
import {
  ForgotResultViewModel,
  LoginResultViewModel,
  RegisterResultViewModel,
} from '../../view-models/auth/identity-view-models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private readonly STORAGE_KEY = 'ASOODE_IDENTITY';
  private identityObject: IdentityObject;
  private profileObject: ProfileViewModel = {} as ProfileViewModel;

  constructor(
    private readonly httpService: HttpService,
    private readonly cookieService: CookieService,
  ) {
    this.identityObject = this.getIdentityInfo();
    // this.cookieService.deleteAll();
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
      this.setIdentityInfo({
        userId: op.data.userId,
        token: op.data.token,
        username: op.data.username,
      });
    }
    return op;
  }

  async register(
    model: any,
  ): Promise<OperationResult<RegisterResultViewModel>> {
    return await this.httpService.post<RegisterResultViewModel>(
      '/account/register',
      model,
    );
  }

  async load(): Promise<OperationResult<any>> {
    const op = await this.httpService.post<any>('/account/profile');
    if (op.status === OperationResultStatus.Success) {
      this.profileObject = op.data;
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
    return await this.httpService.post<boolean>(
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
      '/account/resend/verification/' + id
    );
  }
}
