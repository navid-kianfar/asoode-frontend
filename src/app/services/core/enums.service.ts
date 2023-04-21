import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class EnumsService {
  repository: any = {};
  constructor(
    private readonly client: HttpClient,
    private readonly config: ConfigService,
  ) {}

  load(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const path = `${this.config.backend}/enums`;
      this.client.get(path).subscribe(
        (response: string) => {
          this.repository = response;
        },
        (err: Error) => {
          this.repository = {};
          // console.log(err);
          reject(err);
        },
        () => resolve()
      );
    });
  }

  translateKey(name: string, value: any): string {
    const enumName = name[0].toLowerCase() + name.substring(1);
    const enumKey =
      Object.keys(this.repository[enumName]).find(k => {
        return this.repository[enumName][k] === value;
      }) || '';
    const keyFixed = enumKey
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/-/g, '_');
    const nameFixed = enumName
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/-/g, '_');
    return `ENUMS_${nameFixed}_${keyFixed}`.toUpperCase();
  }
}
