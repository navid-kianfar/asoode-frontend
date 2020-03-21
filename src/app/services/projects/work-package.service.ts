import { Injectable } from '@angular/core';
import {OperationResult} from '../../library/core/operation-result';
import {WorkPackageViewModel} from '../../view-models/projects/project-types';
import {HttpService} from '../core/http.service';

@Injectable({
  providedIn: 'root'
})
export class WorkPackageService {

  constructor(private readonly httpService: HttpService) { }

  async fetch(id: string): Promise<OperationResult<WorkPackageViewModel>> {
    return await this.httpService.post<WorkPackageViewModel>('/work-packages/get/' + id);
  }
}