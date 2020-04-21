import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import { DashboardViewModel } from '../../view-models/general/report-types';
import { WorkPackageTaskViewModel } from '../../view-models/projects/project-types';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private readonly httpService: HttpService) {}

  async dashboard(model): Promise<OperationResult<DashboardViewModel>> {
    return await this.httpService.post<DashboardViewModel>(
      '/reports/dashboard',
      model,
    );
  }

  async recentActivities(
    groupId: string,
  ): Promise<OperationResult<WorkPackageTaskViewModel[]>> {
    return await this.httpService.post<WorkPackageTaskViewModel[]>(
      '/reports/activities/' + groupId,
    );
  }
}
