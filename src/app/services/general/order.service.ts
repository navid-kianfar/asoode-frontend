import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import { OrderDiscountResultViewModel } from '../../view-models/general/order-types';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private readonly httpService: HttpService) {}

  async checkDiscount(
    model,
  ): Promise<OperationResult<OrderDiscountResultViewModel>> {
    return await this.httpService.post<OrderDiscountResultViewModel>(
      '/orders/check-discount',
      model,
    );
  }

  async order(model): Promise<OperationResult<string>> {
    return await this.httpService.post<string>('/orders/new', model);
  }

  pay(id: string) {
    setTimeout(() => {
      window.location.href = `http://localhost:5000/v2/orders/pay/` + id;
      // window.location.href = `${environment.api_endpoint}/orders/pay/` + id;
    }, 100);
  }
}
