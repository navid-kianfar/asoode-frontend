import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../../services/general/mock.service';
import { OrderStatus } from 'src/app/library/app/enums';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  OrderStatus = OrderStatus;
  displayedColumns: string[] = [
    'title',
    'amount',
    'createdAt',
    'dueAt',
    'status',
    'operations',
  ];
  constructor() {}
  ngOnInit() {}

  pay(element: any) {
    window.location.href = `${environment.api_endpoint}/v2/orders/pay/${element.id}`;
  }
}
