import {Injectable} from '@angular/core';
import {IdentityObject} from '../../view-models/auth/identity-types';
import {HttpService} from '../core/http.service';
import {OperationResult} from "../../library/core/operation-result";
import {OperationResultStatus} from "../../library/core/enums";
import {LoginResultViewModel, RegisterResultViewModel} from "../../view-models/auth/identity-view-models";

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private readonly STORAGE_KEY = 'ASOODE_IDENTITY';
  private identityObject: IdentityObject;

  private getIdentityInfo(): IdentityObject {
    if (localStorage) {
      const identityJson = localStorage.getItem(this.STORAGE_KEY);
      if (identityJson) {
        return JSON.parse(identityJson) as IdentityObject;
      }
    }
    return { token: null, username: null, userId: null };
  }
  private setIdentityInfo(identity: IdentityObject) {
    if (localStorage) {
      this.identityObject = identity;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(identity));
    }
  }
  private removeIdentityInfo() {
    if (localStorage) {
      this.identityObject = null;
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
  constructor(private readonly httpService: HttpService) {
    this.identityObject = this.getIdentityInfo();
  }

  get identity(): IdentityObject {
    return this.identityObject;
  }

  logout() {
    this.removeIdentityInfo();
  }

  async login(model: any): Promise<OperationResult<LoginResultViewModel>> {
    const op = await this.httpService
      .post<LoginResultViewModel>('/account/login', model);
    if (op.status === OperationResultStatus.Success) {
      this.setIdentityInfo({
        userId: op.data.userId,
        token: op.data.token,
        username: op.data.username,
      });
    }
    return op;
  }

  async register(model: any): Promise<OperationResult<RegisterResultViewModel>> {
    return await this.httpService
      .post<RegisterResultViewModel>('/account/register', model);
  }
}
