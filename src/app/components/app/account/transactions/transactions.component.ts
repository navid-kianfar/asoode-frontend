import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../../services/general/mock.service';
import { OrderStatus } from 'src/app/library/app/enums';
import {environment} from '../../../../../environments/environment';
import {OrderService} from '../../../../services/general/order.service';

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
  constructor(private readonly orderService: OrderService) {}
  ngOnInit() {}

  pay(element: any) {
    this.orderService.pay(element.id);
  }
}
