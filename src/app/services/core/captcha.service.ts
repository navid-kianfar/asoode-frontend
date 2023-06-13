import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { CaptchaResult } from '../../view-models/core/captcha-types';
import { OperationResult } from '../../library/core/operation-result';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  subject = new Subject<void>();

  constructor(private readonly http: HttpService) {}

  public get trigger(): Observable<any> {
    return this.subject.asObservable();
  }

  public reset() {
    this.subject.next();
  }

  async generate(): Promise<OperationResult<CaptchaResult>> {
    return await this.http.post<CaptchaResult>('/captcha');
  }
}
