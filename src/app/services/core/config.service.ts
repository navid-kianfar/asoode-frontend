import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {}

  public get backend(): string {
    return environment.api_endpoint;
  }
}
