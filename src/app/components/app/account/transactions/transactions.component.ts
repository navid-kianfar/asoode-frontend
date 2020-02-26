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
  dataSource = new MatTableDataSource<any>([]);

  constructor(private readonly translatorService: MaterialTranslatorService) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.translatorService.paginator(this.paginator);
    this.dataSource.paginator = this.paginator;
  }
}
