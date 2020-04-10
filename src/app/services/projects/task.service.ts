import { Injectable } from '@angular/core';
import {OperationResult} from '../../library/core/operation-result';
import {HttpService} from '../core/http.service';
import {WorkPackageTaskViewModel} from '../../view-models/projects/project-types';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private readonly httpService: HttpService) {}

  async create(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${id}/create`, model);
  }

  async reposition(id: any, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${id}/reposition`, model);
  }

  async move(id: any, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${id}/move`, model);
  }

  async comment(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${id}/comment`, model);
  }

  async fetch(id: string): Promise<OperationResult<WorkPackageTaskViewModel>> {
    return await this.httpService.post<WorkPackageTaskViewModel>(`/tasks/${id}/detail`);
  }

  async changeTitle(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${id}/change-title`, model);
  }
  async changeDescription(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${id}/change-description`, model);
  }
}