import { Component, OnInit } from '@angular/core';
import { OrderStatus } from 'src/app/library/app/enums';
import { OrderService } from '../../../../services/general/order.service';

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

  download(element: any) {
    window.open('https://api.asoode.com/v2/orders/pdf/' + element.id, '_blank');
  }
}
