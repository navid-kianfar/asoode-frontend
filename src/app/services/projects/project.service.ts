import {Injectable} from '@angular/core';
import {HttpService} from '../core/http.service';
import {OperationResult} from '../../library/core/operation-result';
import {ProjectViewModel} from '../../view-models/projects/project-types';
import {OperationResultStatus} from '../../library/core/enums';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projects: ProjectViewModel[] = [];

  constructor(private readonly httpService: HttpService) { }

  async load(): Promise<OperationResult<ProjectViewModel[]>> {
    const op = await this.httpService.post<ProjectViewModel[]>('/projects/list');
    if (op.status === OperationResultStatus.Success) {
      this.projects = op.data;
    }
    return op;
  }
}
