import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import { GroupViewModel } from '../../view-models/groups/group-types';
import { OperationResultStatus } from '../../library/core/enums';
import { AccessType } from '../../library/app/enums';
import { IdentityService } from '../auth/identity.service';

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
      m => m.recordId === this.identityService.identity.userId,
    );
    if (access) {
      return access.access;
    }

    const multiple = [];
    for (const ga of grp.members.filter(m => m.isGroup)) {
      const found = this.groups.find(k => k.id === ga.recordId);
      if (found) {
        multiple.push(found.access);
      }
    }
    return multiple.sort()[0];
  }

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

  async edit(id: string, model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/groups/${id}/edit`, model);
  }

  async removeAccess(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/groups/remove-access/${id}`);
  }
  async addAccess(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/groups/${id}/add-access`, model);
  }

  async changeAccess(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/groups/change-access/${id}`, model);
  }
}
