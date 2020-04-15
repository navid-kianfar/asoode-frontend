import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import { DashboardViewModel } from '../../view-models/general/report-types';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private readonly httpService: HttpService) { }

  async dashboard(): Promise<OperationResult<DashboardViewModel>> {
    return await this.httpService.post<DashboardViewModel>('/reports/dashboard');
  }
}
