import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import {
  ProjectObjectiveEstimatedPriceViewModel,
  ProjectTemplateViewModel,
  ProjectViewModel,
  WorkPackageObjectiveViewModel,
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
        ? this.projects.find(g => g.id === project)
        : project;
    const access = proj.members.find(
      m => m.recordId === this.identityService.identity.userId,
    );
    const multiple = [];
    if (access) {
      multiple.push(access.access);
    }

    for (const ga of proj.members.filter(m => m.isGroup)) {
      const found = this.groupService.groups.find(k => k.id === ga.recordId);
      if (found) {
        multiple.push(found.access);
      }
    }
    return multiple.sort()[0];
  }

  getWorkPackagePermission(
    project: ProjectViewModel,
    workPackage: WorkPackageViewModel,
  ): AccessType {
    const access = workPackage.members.find(
      m => m.recordId === this.identityService.identity.userId,
    );
    const multiple = [];
    if (access) {
      multiple.push(access.access);
    }

    for (const ga of workPackage.members.filter(m => m.isGroup)) {
      const found = this.groupService.groups.find(k => k.id === ga.recordId);
      if (found) {
        const aa = found.members.find(
          m => m.userId === this.identityService.identity.userId,
        );
        if (aa) {
          multiple.push(aa.access);
        }
      }
    }
    return multiple.sort()[0];
  }

  async changePendingAccess(
    id: string,
    model,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/change-pending-access/${id}`,
      model,
    );
  }

  async removePendingAccess(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/remove-pending-access/${id}`,
    );
  }

  async removeSubProject(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/projects/sub/${id}/remove`);
  }

  async editSubProject(
    id: string,
    params: any,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/sub/${id}/edit`,
      params,
    );
  }

  async createSeasonProject(
    id: string,
    params: any,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/${id}/season/create`,
      params,
    );
  }

  async removeSeason(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/season/${id}/remove`,
    );
  }

  async editSeason(id: string, params: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/season/${id}/edit`,
      params,
    );
  }

  async edit(id: string, params: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/projects/${id}/edit`, params);
  }

  async changeSupProjectOrder(
    id: string,
    params: any,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/projects/sub/${id}/order`,
      params,
    );
  }

  async objectives(
    id: string,
  ): Promise<OperationResult<WorkPackageObjectiveViewModel[]>> {
    return await this.httpService.post<WorkPackageObjectiveViewModel[]>(
      `/projects/objectives/${id}`,
    );
  }

  async objectiveDetails(
    id: string,
  ): Promise<OperationResult<ProjectObjectiveEstimatedPriceViewModel[]>> {
    return await this.httpService.post<
      ProjectObjectiveEstimatedPriceViewModel[]
    >(`/projects/objectives/${id}/detail`);
  }
}
