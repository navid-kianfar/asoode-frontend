import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MaterialTranslatorService } from '../../../../services/core/material-translator.service';

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
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  constructor(private readonly translatorService: MaterialTranslatorService) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.translatorService.paginator(this.paginator);
    this.dataSource.paginator = this.paginator;
  }
}
export interface PeriodicElement {
  title: string;
  amount: number;
  createdAt: Date;
  dueAt: Date;
  previousDebt: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    title: 'فاکتور اردیبهشت ماه',
    amount: 100,
    dueAt: new Date(),
    createdAt: new Date(),
    previousDebt: 0,
  },
  {
    title: 'فاکتور اردیبهشت ماه',
    amount: 200,
    dueAt: new Date(),
    createdAt: new Date(),
    previousDebt: 0,
  },
  {
    title: 'فاکتور اردیبهشت ماه',
    amount: 300,
    dueAt: new Date(),
    createdAt: new Date(),
    previousDebt: 0,
  },
  {
    title: 'فاکتور اردیبهشت ماه',
    amount: 400,
    dueAt: new Date(),
    createdAt: new Date(),
    previousDebt: 0,
  },
  {
    title: 'فاکتور اردیبهشت ماه',
    amount: 500,
    dueAt: new Date(),
    createdAt: new Date(),
    previousDebt: 0,
  },
  {
    title: 'فاکتور اردیبهشت ماه',
    amount: 600,
    dueAt: new Date(),
    createdAt: new Date(),
    previousDebt: 0,
  },
  {
    title: 'فاکتور اردیبهشت ماه',
    amount: 700,
    dueAt: new Date(),
    createdAt: new Date(),
    previousDebt: 0,
  },
  {
    title: 'فاکتور اردیبهشت ماه',
    amount: 800,
    dueAt: new Date(),
    createdAt: new Date(),
    previousDebt: 0,
  },
  {
    title: 'فاکتور اردیبهشت ماه',
    amount: 900,
    dueAt: new Date(),
    createdAt: new Date(),
    previousDebt: 0,
  },
  {
    title: 'فاکتور اردیبهشت ماه',
    amount: 1000,
    dueAt: new Date(),
    createdAt: new Date(),
    previousDebt: 0,
  },
];
