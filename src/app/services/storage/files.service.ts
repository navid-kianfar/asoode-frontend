import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import {
  ExplorerViewModel,
  UploadViewModel,
} from '../../view-models/storage/files-types';
import { OperationResultStatus } from '../../library/core/enums';
import { StringDictionary } from '../../library/core/dictionary';
import { ModalService } from '../core/modal.service';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  hidePlate: boolean;
  uploading: UploadViewModel[] = [];
  attaching: UploadViewModel[] = [];
  chatAttaching: UploadViewModel[] = [];
  private readonly imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  private readonly audioExtensions = ['.mp3', '.wave', '.wav', '.ogg'];
  private readonly videoExtensions = ['.mp4'];

  constructor(
    private readonly modalService: ModalService,
    private readonly httpService: HttpService,
  ) {
    this.hidePlate = false;
  }

  getFileExtension(filename: string): string {
    const ext = /^.+\.([^.]+)$/.exec(filename);
    return (ext == null ? '' : '.' + ext[1]).toLowerCase();
  }

  getExtensionLessFileName(name: any) {
    return (name || '').replace(/\.[^/.]+$/, '');
  }

  isImage(file: string | File): boolean {
    const name = file instanceof File ? file.name : file;
    const ext = this.getFileExtension(name);
    return this.imageExtensions.indexOf(ext) !== -1;
  }
  isAudio(file: string | File) {
    const name = file instanceof File ? file.name : file;
    const ext = this.getFileExtension(name);
    return this.audioExtensions.indexOf(ext) !== -1;
  }
  isVideo(file: string | File) {
    const name = file instanceof File ? file.name : file;
    const ext = this.getFileExtension(name);
    return this.videoExtensions.indexOf(ext) !== -1;
  }

  icon(input: string): string {
    switch (this.getFileExtension(input)) {
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif':
      case '.bmp':
        return 'icon-image2';
      case '.mp3':
      case '.wave':
      case '.wav':
      case '.ogg':
        return 'ikon-music5';
      case '.mp4':
      case '.mkv':
      case '.flv':
      case '.web':
        return 'ikon-film4';
      case '.zip':
      case '.rar':
      case '.7z':
      case '.tar':
      case '.gz':
        return 'icon-file-zip';
      case '.pdf':
        return 'icon-file-pdf';
      case '.doc':
      case '.docx':
      case '.rtf':
      case '.txt':
        return 'icon-file-word';
      case '.xls':
      case '.xlsx':
      case '.csv':
        return 'icon-file-word';
      case '.ppt':
      case '.pptx':
        return 'icon-file-presentation';
      default:
        return 'icon-files-empty';
    }
  }

  blob(element: HTMLImageElement, file: File) {
    const reader = new FileReader();
    reader.onload = e => (element.src = reader.result.toString());
    reader.readAsDataURL(file);
  }

  download(
    path: string,
    params: StringDictionary<any> = null,
    method: string = 'get',
  ) {
    const form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);
    form.setAttribute('target', '_blank');
    if (params) {
      params.Keys().forEach(key => {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key]);
        form.appendChild(hiddenField);
      });
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

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

  async rename(model): Promise<OperationResult<boolean>> {
    return this.httpService.post<boolean>('/files/rename', model, false);
  }

  async upload(
    filtered: UploadViewModel[],
    path: string,
  ): Promise<UploadViewModel[]> {
    if (filtered.length) {
      this.hidePlate = false;
    }
    filtered.forEach(u => {
      u.promise = new Promise<OperationResult<boolean>>((resolve, reject) => {
        this.httpService
          .formUpload('/files/upload', { path, file: u.file }, percent => {
            u.progress = percent;
          })
          .then(
            op => {
              if (op.status !== OperationResultStatus.Success) {
                u.uploading = false;
                u.failed = true;
                resolve(OperationResult.Failed());
                return;
              }
              u.progress = 100;
              u.success = true;
              u.uploading = false;
              resolve(OperationResult.Success(true));
            },
            err => {
              reject(err);
              u.uploading = false;
              u.failed = true;
            },
          );
      });
    });
    return filtered;
  }

  async attach(filtered: UploadViewModel[], taskId: string) {
    if (filtered.length) {
      this.hidePlate = false;
    }
    filtered.forEach(u => {
      const removeFromList = () => {
        const index = this.attaching.indexOf(u);
        const removed = this.attaching.splice(index, 1);
        console.log(index, removed, u);
      };
      u.promise = new Promise<OperationResult<boolean>>((resolve, reject) => {
        this.httpService
          .formUpload(`/tasks/${taskId}/attach`, { file: u.file }, percent => {
            u.progress = percent;
          })
          .then(
            op => {
              removeFromList();
              if (op.status !== OperationResultStatus.Success) {
                u.uploading = false;
                u.failed = true;
                resolve(OperationResult.Failed());
                return;
              }
              u.progress = 100;
              u.success = true;
              u.uploading = false;
              resolve(OperationResult.Success(true));
            },
            err => {
              reject(err);
              u.uploading = false;
              u.failed = true;
            },
          );
      });
    });
    return filtered;
  }

  async attachChat(filtered: UploadViewModel[], recordId: string) {
    if (filtered.length) {
      this.hidePlate = false;
    }
    filtered.forEach(u => {
      const removeFromList = () => {
        const index = this.chatAttaching.indexOf(u);
        const removed = this.chatAttaching.splice(index, 1);
        console.log(index, removed, u);
      };
      u.promise = new Promise<OperationResult<boolean>>((resolve, reject) => {
        this.httpService
          .formUpload(
            `/messenger/channel/${recordId}/attach`,
            { file: u.file },
            percent => {
              u.progress = percent;
            },
          )
          .then(
            op => {
              removeFromList();
              if (op.status !== OperationResultStatus.Success) {
                u.uploading = false;
                u.failed = true;
                resolve(OperationResult.Failed());
                return;
              }
              u.progress = 100;
              u.success = true;
              u.uploading = false;
              resolve(OperationResult.Success(true));
            },
            err => {
              reject(err);
              u.uploading = false;
              u.failed = true;
            },
          );
      });
    });
    return filtered;
  }

  async delete(model): Promise<OperationResult<boolean>> {
    return this.httpService.post<boolean>('/files/delete', model, false);
  }
}
