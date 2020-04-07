import {Injectable} from '@angular/core';
import {HttpService} from '../core/http.service';
import {OperationResult} from '../../library/core/operation-result';
import {ExplorerViewModel, UploadViewModel,} from '../../view-models/storage/files-types';
import {OperationResultStatus} from '../../library/core/enums';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  uploading: UploadViewModel[] = [];

  getFileExtension(filename: string): string {
    const ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? '' : '.' + ext[1];
  }

  constructor(private readonly httpService: HttpService) {}

  async myFiles(path: string): Promise<OperationResult<ExplorerViewModel>> {
    return this.httpService.post<ExplorerViewModel>('/files/mine', { path });
  }

  async sharedByMe(path: string): Promise<OperationResult<ExplorerViewModel>> {
    return this.httpService.post<ExplorerViewModel>('/files/shared-by-me', {
      path,
    });
  }
  async sharedByOthers(
    path: string,
  ): Promise<OperationResult<ExplorerViewModel>> {
    return this.httpService.post<ExplorerViewModel>('/files/shared-by-others', {
      path,
    });
  }

  async newFolder(param: any): Promise<OperationResult<boolean>> {
    return this.httpService.post<boolean>('/files/new-folder', param, false);
  }

  getExtensionLessFileName(name: any) {
    return (name || '').replace(/\.[^/.]+$/, '');
  }

  upload(upload: UploadViewModel[], path: string) {
    upload.forEach(u => {
      u.promise = new Promise<OperationResult<boolean>>((resolve, reject) => {
        this.httpService.formUpload(
          '/files/upload',
          { path, file: u.file },
          (percent) => { u.progress = percent; }
        )
          .then((op) => {
            if (op.status !== OperationResultStatus.Success) {
              u.uploading = false;
              u.failed = true;
              return;
            }
            u.progress = 100;
            u.success = true;
            u.uploading = false;
          }, (err) => {
            reject(err);
            u.uploading = false;
            u.failed = true;
          });
      });
    });
  }
}
