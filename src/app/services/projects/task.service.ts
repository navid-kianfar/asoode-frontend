import { Injectable } from '@angular/core';
import { OperationResult } from '../../library/core/operation-result';
import { HttpService } from '../core/http.service';
import {
  ActivityLogViewModel,
  AdvancedPlayerCommentViewModel,
  AdvancedPlayerViewModel,
  KartablViewModel,
  TimeSpentViewModel,
  WorkPackageTaskTimeViewModel,
  WorkPackageTaskViewModel,
} from '../../view-models/projects/project-types';
import { IdentityService } from '../auth/identity.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private readonly httpService: HttpService,
    private readonly identityService: IdentityService,
  ) {}

  async create(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${id}/create`, model);
  }

  async reposition(id: any, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${id}/reposition`,
      model,
    );
  }

  async move(id: any, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${id}/move`, model);
  }

  async comment(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${id}/comment`, model);
  }

  async fetch(id: string): Promise<OperationResult<WorkPackageTaskViewModel>> {
    return await this.httpService.post<WorkPackageTaskViewModel>(
      `/tasks/${id}/detail`,
    );
  }

  async changeTitle(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${id}/change-title`,
      model,
    );
  }
  async changeDescription(
    id: string,
    model,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${id}/change-description`,
      model,
    );
  }

  async changeState(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${id}/change-state`,
      model,
    );
  }

  async addMember(taskId: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${taskId}/member/add`,
      model,
    );
  }

  async removeMember(
    taskId: string,
    id: string,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${taskId}/member/${id}/remove`,
    );
  }

  async addLabel(
    taskId: string,
    labelId: string,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${taskId}/label/add/${labelId}`,
    );
  }

  async removeLabel(
    taskId: string,
    labelId: string,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${taskId}/label/${labelId}/remove`,
    );
  }

  async renameAttachment(id: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/attachment/${id}/rename`,
      model,
    );
  }
  async removeAttachment(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/attachment/${id}/remove`,
    );
  }

  async advancedPlayer(
    id: string,
  ): Promise<OperationResult<AdvancedPlayerViewModel>> {
    return await this.httpService.post<AdvancedPlayerViewModel>(
      `/tasks/attachment/${id}/advanced`,
    );
  }

  async advancedPlayerComment(
    id: string,
    model,
  ): Promise<OperationResult<AdvancedPlayerCommentViewModel>> {
    return await this.httpService.post<AdvancedPlayerCommentViewModel>(
      `/tasks/attachment/${id}/advanced/comment`,
      model,
    );
  }

  async advancedPlayerEditComment(
    id: string,
    model,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/attachment/advanced/${id}/edit-comment`,
      model,
    );
  }
  async advancedPlayerDeleteComment(
    id: string,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/attachment/advanced/${id}/remove-comment`,
    );
  }

  async coverAttachment(id: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/attachment/${id}/cover`,
    );
  }

  async toggleWatch(taskId: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${taskId}/watch`);
  }

  async toggleArchive(taskId: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${taskId}/archive`);
  }

  async setLocation(taskId: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${taskId}/location`,
      model,
    );
  }
  async removeLocation(taskId: string): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${taskId}/location`,
      {},
    );
  }

  async vote(taskId: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(`/tasks/${taskId}/vote`, model);
  }

  async logs(taskId): Promise<OperationResult<ActivityLogViewModel[]>> {
    return await this.httpService.post<ActivityLogViewModel[]>(
      `/tasks/${taskId}/logs`,
    );
  }

  async changeEstimated(
    taskId: string,
    model,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${taskId}/estimated`,
      model,
    );
  }

  async spendTime(taskId: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${taskId}/spend-time`,
      model,
    );
  }

  async setDate(taskId: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/tasks/${taskId}/set-date`,
      model,
    );
  }

  async calendar(model): Promise<OperationResult<WorkPackageTaskViewModel[]>> {
    return await this.httpService.post<WorkPackageTaskViewModel[]>(
      `/tasks/calendar`,
      model,
    );
  }

  async kartabl(model): Promise<OperationResult<KartablViewModel>> {
    return await this.httpService.post<KartablViewModel>(
      `/tasks/kartabl`,
      model,
    );
  }

  async timeSpents(model): Promise<OperationResult<TimeSpentViewModel[]>> {
    return await this.httpService.post<TimeSpentViewModel[]>(
      `/times/mine`,
      model,
    );
  }

  async bulkUpload(
    id: string,
    model,
    trigger: (progress) => void,
  ): Promise<OperationResult<boolean>> {
    return await this.httpService.formUpload(
      `/tasks/${id}/bulk-attach`,
      model,
      (p) => trigger(p),
    );
  }

  bulkDownload(id: string, picked: any[]) {
    const url = `/tasks/${id}/${this.identityService.identity.userId}/bulk-download`;
    this.httpService.formDownload(url, picked);
  }
}
