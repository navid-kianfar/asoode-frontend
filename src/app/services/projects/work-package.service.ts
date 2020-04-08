import { Injectable } from '@angular/core';
import { OperationResult } from '../../library/core/operation-result';
import { WorkPackageViewModel } from '../../view-models/projects/project-types';
import { HttpService } from '../core/http.service';

@Injectable({
  providedIn: 'root',
})
export class WorkPackageService {
  constructor(private readonly httpService: HttpService) {}

  async fetch(id: string): Promise<OperationResult<WorkPackageViewModel>> {
    return await this.httpService.post<WorkPackageViewModel>(
      '/work-packages/get/' + id,
    );
  }

  async repositionList(id: any, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      '/work-packages/lists/reposition/' + id, model
    );
  }

  async addWorkPackageAccess(id: string, model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/add-access`,
      model,
    );
  }
}
