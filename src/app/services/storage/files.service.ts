import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import {
  ExplorerViewModel,
  UploadViewModel,
} from '../../view-models/storage/files-types';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  uploading: UploadViewModel[] = [];

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
}
