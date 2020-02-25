import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EnumsService {
  repository: any = {};
  constructor(
    private readonly client: HttpClient,
    private readonly config: ConfigService,
  ) { }

  async load(): Promise<void> {
    return new Promise((resolve, reject) => {
      const path = `${this.config.backend}/enums`;
      this.client.get(path).subscribe(
        (response: string) => {
          this.repository = response;
          resolve();
        },
        (err: Error) => {
          this.repository = {};
          reject(err);
        },
      );
    });
  }
}
