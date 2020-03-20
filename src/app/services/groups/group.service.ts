import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import { GroupViewModel } from '../../view-models/groups/group-types';
import { OperationResultStatus } from '../../library/core/enums';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  groups: GroupViewModel[] = [];

  constructor(private readonly httpService: HttpService) {}

  async load(): Promise<OperationResult<GroupViewModel[]>> {
    const op = await this.httpService.post<GroupViewModel[]>('/groups/list');
    if (op.status === OperationResultStatus.Success) {
      this.groups = op.data;
    }
    return op;
  }

  async create(model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>('/groups/create', model);
  }
}
