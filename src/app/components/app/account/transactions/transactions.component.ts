import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../../services/general/mock.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'amount',
    'createdAt',
    'dueAt',
    'previousDebt',
    'download',
  ];
  constructor() {}
  ngOnInit() {}
}
