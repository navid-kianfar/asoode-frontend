import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import { GroupViewModel } from '../../view-models/groups/group-types';
import { OperationResultStatus } from '../../library/core/enums';
import { AccessType } from '../../library/app/enums';
import { IdentityService } from '../auth/identity.service';
import {ProjectViewModel, TimeSpentViewModel} from '../../view-models/projects/project-types';
import {DayReportViewModel} from '../../view-models/general/report-types';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  groups: GroupViewModel[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly identityService: IdentityService,
  ) {}

  getPermission(group: GroupViewModel | string): AccessType {
    const grp =
      typeof group === 'string' ? this.groups.find(g => g.id === group) : group;
    const access = grp.members.find(
      m => m.userId === this.identityService.identity.userId,
    );
    if (access) {
      return access.access;
    }

    return AccessType.Visitor;
  }

  async load(): Promise<OperationResult<GroupViewModel[]>> {
    const op = await this.httpService.post<GroupViewModel[]>('/groups/list');
    if (op.status === OperationResultStatus.Success) {
      this.groups = op.data;
    }
    return op;
  }

  async archived(): Promise<OperationResult<GroupViewModel[]>> {
    return await this.httpService.post<GroupViewModel[]>('/groups/archived');
  }

  async create(model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>('/groups/create', model);
  }

  async edit(id: string, model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/groups/${id}/edit`, model);
  }

  async remove(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/groups/${id}/remove`);
  }

  async removeAccess(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/groups/remove-access/${id}`);
  }
  async addAccess(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/groups/${id}/add-access`,
      model,
    );
  }

  async changeAccess(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/groups/change-access/${id}`,
      model,
    );
  }

  async changePendingAccess(
    id: string,
    model,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/groups/change-pending-access/${id}`,
      model,
    );
  }

  async removePendingAccess(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/groups/remove-pending-access/${id}`,
    );
  }

  async timeSpent(id: string, model): Promise<OperationResult<TimeSpentViewModel[]>> {
    return await this.httpService.post<TimeSpentViewModel[]>(
      `/times/group/${id}`, model
    );
  }
  async report(id: string, model): Promise<OperationResult<DayReportViewModel[]>> {
    return await this.httpService.post<DayReportViewModel[]>(
      `/groups/${id}/report`, model
    );
  }
}
