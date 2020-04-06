import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import {
  ProjectTemplateViewModel,
  ProjectViewModel,
  WorkPackageViewModel,
} from '../../view-models/projects/project-types';
import { OperationResultStatus } from '../../library/core/enums';
import { GroupViewModel } from '../../view-models/groups/group-types';
import { AccessType } from '../../library/app/enums';
import { GroupService } from '../groups/group.service';
import { IdentityService } from '../auth/identity.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  projects: ProjectViewModel[] = [];
  templates: ProjectTemplateViewModel[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly groupService: GroupService,
    private readonly identityService: IdentityService,
  ) {}

  async load(): Promise<OperationResult<ProjectViewModel[]>> {
    const op = await this.httpService.post<ProjectViewModel[]>(
      '/projects/list',
    );
    if (op.status === OperationResultStatus.Success) {
      this.projects = op.data;
    }
    return op;
  }

  async create(model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>('/projects/create', model);
  }

  async removeAccess(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/remove-access/${id}`,
    );
  }
  async addAccess(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/${id}/add-access`,
      model,
    );
  }

  async createSubProject(
    id: string,
    params: any,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/${id}/sub/create`,
      params,
    );
  }
  async changeAccess(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/change-access/${id}`,
      model,
    );
  }
  async createWorkPackage(
    id: string,
    parmas: any,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/create/${id}`,
      parmas,
    );
  }

  getPermission(project: ProjectViewModel | string): AccessType {
    const proj =
      typeof project === 'string'
        ? this.groupService.groups.find(g => g.id === project)
        : project;
    const access = proj.members.find(
      m => m.recordId === this.identityService.identity.userId,
    );
    if (access) {
      return access.access;
    }

    const multiple = [];
    for (const ga of proj.members.filter(m => m.isGroup)) {
      const found = this.groupService.groups.find(k => k.id === ga.recordId);
      if (found) {
        multiple.push(found.access);
      }
    }
    return multiple.sort()[0];
  }

  async changePendingAccess(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/change-pending-access/${id}`,
      model,
    );
  }

  async removePendingAccess(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/projects/remove-pending-access/${id}`);
  }
}
