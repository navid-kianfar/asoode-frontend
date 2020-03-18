import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpService } from '../../../services/core/http.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { GridCommand } from '../../../view-models/core/grid-types';
import { MaterialTranslatorService } from '../../../services/core/material-translator.service';
import {
  MatColumnDef,
  MatPaginator,
  MatTable,
  MatTableDataSource,
} from '@angular/material';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent<T> implements OnInit, OnDestroy, AfterContentInit {
  commandListener: Subscription;
  dataSource = new MatTableDataSource<T>([]);

  @Input() columns: string[];
  @Input() showFooter: boolean;
  @Input() disabled: boolean;
  @Input() headerHeight: number;
  @Input() footerHeight: number;
  @Input() rowHeight: number;
  @Input() cssClass: string;
  @Input() backend: string;
  @Input() backendParams: any;
  @Input() pageSize: number;
  @Input() commander: EventEmitter<GridCommand<any>>;
  @Input() rows: T[];
  @Input() isLoading: boolean;
  @Input() currentPage: number;
  @Input() totalPages: number;
  @Input() totalItems: number;

  @Output() rowsChange = new EventEmitter<any[]>();
  @Output() isLoadingChange = new EventEmitter<boolean>();
  @Output() currentPageChange = new EventEmitter<number>();
  @Output() totalPagesChange = new EventEmitter<number>();
  @Output() totalItemsChange = new EventEmitter<number>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) table: MatTable<T>;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;

  constructor(
    readonly httpService: HttpService,
    private readonly translatorService: MaterialTranslatorService,
  ) {}

  ngOnInit() {
    if (this.showFooter !== false) {
      this.paginator.pageSizeOptions = [10, 20];
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = 10;
      this.translatorService.paginator(this.paginator);
      this.dataSource.paginator = this.paginator;
      if (this.rowHeight === undefined) {
        this.rowHeight = 30;
      }
      if (this.headerHeight === undefined) {
        this.headerHeight = 30;
      }
      if (this.footerHeight === undefined) {
        this.footerHeight = 30;
      }
    }

    if (this.commander) {
      this.commandListener = this.commander.subscribe(async command =>
        this.onCommand(command),
      );
    }
    setTimeout(() => this.updateDataSource(), 500);
  }

  ngOnDestroy() {
    if (this.commandListener) {
      this.commandListener.unsubscribe();
    }
  }

  ngAfterContentInit(): void {
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
  }

  async onCommand(command: GridCommand<any>) {
    if (command.goToPage) {
      await this.changePage(command.goToPage);
    }
    if (command.firstPage) {
      await this.changePage(1);
    }
    if (command.lastPage) {
      await this.changePage(this.totalPages);
    }
    if (command.nextPage) {
      if (this.totalPages <= this.currentPage + 1) {
        await this.changePage(this.currentPage + 1);
      }
    }
    if (command.prevPage) {
      if (this.currentPage > 1) {
        await this.changePage(this.currentPage - 1);
      }
    }
    if (command.reload) {
      await this.updateDataSource();
    }
  }

  async changePage(page: number) {
    if (this.currentPage === page) {
      return;
    }
    this.currentPage = page;
    this.currentPageChange.emit(page);
    await this.updateDataSource();
  }

  async updateDataSource() {
    this.dataSource.data = this.rows || [];

    if (!this.backend) {
      return;
    }
    this.isLoading = true;
    this.isLoadingChange.emit(this.isLoading);
    const op = await this.httpService.grid<T>({
      backend: this.backend,
      params: this.backendParams,
      page: this.currentPage,
      pageSize: this.pageSize,
    });
    this.isLoading = false;
    this.isLoadingChange.emit(this.isLoading);
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error;
      return;
    }
    this.totalItems = op.data.totalItems;
    this.totalPages = op.data.totalPages;
    this.rows = op.data.items;
    this.totalItemsChange.emit(this.totalItems);
    this.rowsChange.emit(this.rows);
    this.totalPagesChange.emit(this.totalPages);
  }
}
