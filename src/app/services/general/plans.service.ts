import { Injectable } from '@angular/core';
import {OperationResult} from '../../library/core/operation-result';
import {HttpService} from '../core/http.service';
import {DashboardViewModel} from '../../view-models/general/report-types';
import {PlansFetchViewModel} from '../../view-models/general/plan-types';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  constructor(private readonly httpService: HttpService) { }

  async fetch(): Promise<OperationResult<PlansFetchViewModel>> {
    return await this.httpService.post<PlansFetchViewModel>(
      '/plans/fetch'
    );
  }

  async upgrade(model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      '/plans/upgrade', model
    );
  }
}
