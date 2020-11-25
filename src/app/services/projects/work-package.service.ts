import { Injectable } from '@angular/core';
import { OperationResult } from '../../library/core/operation-result';
import {
  ProjectViewModel,
  WorkPackageViewModel,
} from '../../view-models/projects/project-types';
import { HttpService } from '../core/http.service';
import { AccessType, ReceiveNotificationType } from '../../library/app/enums';
import { ProjectService } from './project.service';
import { IdentityService } from '../auth/identity.service';
import { GroupService } from '../groups/group.service';

@Injectable({
  providedIn: 'root',
})
export class WorkPackageService {
  constructor(
    private readonly httpService: HttpService,
    private readonly projectService: ProjectService,
    private readonly groupService: GroupService,
    private readonly identityService: IdentityService,
  ) {}

  async fetch(
    id: string,
    model,
  ): Promise<OperationResult<WorkPackageViewModel>> {
    return await this.httpService.post<WorkPackageViewModel>(
      '/work-packages/fetch/' + id,
      model,
    );
  }
  async fetchArchived(
    id: string,
    model,
  ): Promise<OperationResult<WorkPackageViewModel>> {
    return await this.httpService.post<WorkPackageViewModel>(
      '/work-packages/fetch/' + id + '/archived',
      model,
    );
  }

  async addWorkPackageAccess(
    id: string,
    model: any,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/add-access`,
      model,
    );
  }

  async repositionList(id: any, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/lists/${id}/reposition`,
      model,
    );
  }

  async createList(id: string, model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/lists/create`,
      model,
    );
  }

  async renameList(id: string, model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/lists/${id}/rename`,
      model,
    );
  }
  async createObjective(
    id: string,
    model: any,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/objectives/create`,
      model,
    );
  }
  async editObjective(
    id: string,
    model: any,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/objectives/${id}/edit`,
      model,
    );
  }
  async deleteObjective(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/objectives/${id}/delete`,
    );
  }

  async changeAccess(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/change-access/${id}`,
      model,
    );
  }

  async removeAccess(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/remove-access/${id}`,
    );
  }

  async changePendingAccess(
    id: string,
    model,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/change-pending-access/${id}`,
      model,
    );
  }

  async removePendingAccess(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/remove-pending-access/${id}`,
    );
  }

  async renameLabel(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/labels/${id}/rename`,
      model,
    );
  }

  async removeLabel(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/labels/${id}/remove`,
    );
  }

  async createLabel(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/labels/${id}/create`,
      model,
    );
  }
  async updateUserSetting(
    id: string,
    model,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/setting/user`,
      model,
    );
  }

  async updateSetting(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/setting`,
      model,
    );
  }

  async leave(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/work-packages/${id}/leave`);
  }
  async archive(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/work-packages/${id}/archive`);
  }

  async remove(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/work-packages/${id}/remove`);
  }

  async changeOrder(
    id: string,
    params: any,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/order`,
      params,
    );
  }

  async edit(id: string, params: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/edit`,
      params,
    );
  }

  async upgrade(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/work-packages/${id}/upgrade`);
  }

  async merge(
    id: string,
    packageId: string,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/merge/${packageId}`,
    );
  }

  async connect(
    id: string,
    projectId: string,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/connect/${projectId}`,
    );
  }

  async cloneList(id: string, model: any): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/lists/${id}/clone`,
      model,
    );
  }

  async archiveListTasks(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/lists/${id}/archive-tasks`,
    );
  }

  async clearListTasks(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/lists/${id}/clear-tasks`,
    );
  }

  async archiveList(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/lists/${id}/archive`,
    );
  }

  async changePermissions(
    id: string,
    model,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/permissions`,
      model,
    );
  }
  async editSortOrders(
    id: string,
    model: any,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/work-packages/${id}/sort-orders`,
      model,
    );
  }

  getPermission(projectId, packageId: string): AccessType {
    const project = this.projectService.projects.find(g => g.id === projectId);
    const pkg = project.workPackages.find(w => w.id === packageId);
    const access = pkg.members.find(
      m => m.recordId === this.identityService.identity.userId,
    );
    const multiple = [];
    if (access) {
      multiple.push(access.access);
    }

    for (const ga of pkg.members.filter(m => m.isGroup)) {
      const found = this.groupService.groups.find(k => k.id === ga.recordId);
      if (found) {
        const aa = found.members.find(
          m => m.userId === this.identityService.identity.userId,
        );
        if (aa) {
          multiple.push(ga.access);
        }
      }
    }
    return multiple.sort()[0];
  }
}
