import {Injectable} from '@angular/core';
import {HttpService} from '../core/http.service';
import {OperationResult} from '../../library/core/operation-result';
import {GroupViewModel} from '../../view-models/groups/group-types';
import {OperationResultStatus} from '../../library/core/enums';
import {AccessType} from '../../library/app/enums';
import {IdentityService} from '../auth/identity.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  groups: GroupViewModel[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly identityService: IdentityService,
  ) {}

  getPermission(groupId: string): AccessType {
    const grp = this.groups.find(g => g.id === groupId);
    const access = grp.members.find(m => m.id === this.identityService.identity.userId);
    if (access) {
      return access.access;
    }

    // TODO fix this

    return AccessType.Editor;
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
}
