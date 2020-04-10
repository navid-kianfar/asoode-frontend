import { Injectable } from '@angular/core';
import {OperationResult} from '../../library/core/operation-result';
import {HttpService} from '../core/http.service';

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
}
