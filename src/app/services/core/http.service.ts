import { Injectable } from '@angular/core';
import { OperationResult } from '../../library/core/operation-result';
import { OperationResultStatus } from '../../library/core/enums';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { ConfigService } from './config.service';
import { NotificationService } from './notification.service';
import { GridFilter, GridResult } from '../../view-models/core/grid-types';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(
    private readonly client: HttpClient,
    private readonly config: ConfigService,
    private readonly notificationService: NotificationService,
  ) {}

  async post<T>(
    section: string,
    data?: any,
    handleNoneSuccess?: boolean,
  ): Promise<OperationResult<T>> {
    return new Promise<OperationResult<T>>(resolve => {
      try {
        const path = this.config.backend + section;
        data = data || {};
        this.client.post(path, data).subscribe(
          (op: OperationResult<T>) => {
            if (
              op.status !== OperationResultStatus.Success &&
              handleNoneSuccess !== false
            ) {
              this.notificationService.handleRequest(op.status);
            }
            resolve(op);
          },
          (err: Error) => {
            this.notificationService.error('GENERAL_FAILED');
            resolve(OperationResult.Failed<T>(err));
          },
        );
      } catch (e) {
        this.notificationService.error('GENERAL_FAILED');
        resolve(OperationResult.Failed<T>(e));
      }
    });
  }

  async upload<T>(
    section: string,
    files: File[] | File,
    data: any,
    onProgress: (percent: number) => void,
    handleNoneSuccess?: boolean,
  ): Promise<OperationResult<T>> {
    return new Promise<OperationResult<T>>(resolve => {
      try {
        const path = this.config.backend + section;
        data = data || {};

        const formData = new FormData();

        if (!Array.isArray(files)) {
          files = [files];
        }

        files.forEach(file => {
          formData.append('$FILES_' + file.name, file);
        });

        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });

        const uploadReq = new HttpRequest('POST', path, formData, {
          reportProgress: true,
        });

        this.client.request(uploadReq).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round((100 * event.loaded) / event.total);
            onProgress(progress);
          } else if (event.type === HttpEventType.Response) {
            const op = event.body as Response;
            if (
              op.status !== OperationResultStatus.Success &&
              handleNoneSuccess !== false
            ) {
              this.notificationService.handleRequest(op.status);
            }
            resolve(OperationResult.Success<T>(event.body as T));
          }
        });
      } catch (e) {
        this.notificationService.error('GENERAL_FAILED');
        resolve(OperationResult.Failed<T>(e));
      }
    });
  }

  grid<T>(param: GridFilter): Promise<OperationResult<GridResult<T>>> {
    const data = {
      page: param.page,
      pageSize: param.pageSize,
      params: param.params || {},
    };
    return this.post<GridResult<T>>(param.backend, data);
  }

  download(section: string, data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const path = this.config.backend + section;
        data = data || {};
        this.client
          .post(path, data, {
            responseType: 'blob',
            observe: 'body',
          })
          .subscribe(
            (res: Blob) => {
              const a = document.createElement('a');
              a.href = URL.createObjectURL(res);
              a.download = 'download.zip';
              a.click();
              resolve();
            },
            (err: Error) => {
              reject(err);
            },
          );
      } catch (e) {
        this.notificationService.error('GENERAL_FAILED');
        reject(e);
      }
    });
  }

  async formUpload<T>(
    section: string,
    model: any,
    onProgress?: (percent: number) => void,
    handleNoneSuccess?: boolean,
  ): Promise<OperationResult<T>> {
    if (!onProgress) {
      onProgress = () => {};
    }
    return new Promise((resolve, reject) => {
      try {
        const filesNames = [];
        const files = [];
        Object.keys(model).forEach(k => {
          if (model[k] instanceof File) {
            filesNames.push(k);
            files.push(model[k]);
            delete model[k];
          } else if (Array.isArray(model[k]) && model[k][0] instanceof File) {
            (model[k] as any[]).forEach((f, i) => {
              filesNames.push(k + '_' + i);
              files.push(f);
            });
            delete model[k];
          }
        });
        model.filesNames = filesNames;
        const data = { data: JSON.stringify(model) };
        const path = this.config.backend + section;
        const formData = new FormData();
        for (let i = 0; i < filesNames.length; i++) {
          formData.append(filesNames[i], files[i]);
        }
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });
        const uploadReq = new HttpRequest('POST', path, formData, {
          reportProgress: true,
        });
        this.client.request(uploadReq).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round((100 * event.loaded) / event.total);
            onProgress(progress);
          } else if (event.type === HttpEventType.Response) {
            const op = event.body as Response;
            if (
              op.status !== OperationResultStatus.Success &&
              handleNoneSuccess !== false
            ) {
              this.notificationService.handleRequest(op.status);
            }
            resolve(OperationResult.Success<T>(event.body as T));
          }
        });
      } catch (e) {
        this.notificationService.error('GENERAL_FAILED');
        resolve(OperationResult.Failed<T>(e));
      }
    });
  }
}
