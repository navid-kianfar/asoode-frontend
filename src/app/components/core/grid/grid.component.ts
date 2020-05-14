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
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent<T> implements OnInit, OnDestroy, AfterContentInit {
  commandListener: Subscription;
  dataSource = new MatTableDataSource<T>([]);
  query: string;

  @Input() columns: string[];
  @Input() create: boolean;
  @Input() filter: boolean;
  @Input() showFooter: boolean;
  @Input() disabled: boolean;
  @Input() headerHeight: number;
  @Input() footerHeight: number;
  @Input() rowHeight: number;
  @Input() cssClass: string;
  @Input() backend: string;
  @Input() backendParams: any;
  @Input() pageSize: number;
  @Input() rows: T[];
  @Input() isLoading: boolean;
  @Input() currentPage: number;
  @Input() totalPages: number;
  @Input() totalItems: number;
  @Input() commander: EventEmitter<GridCommand<any>>;
  @Output() rowsChange = new EventEmitter<any[]>();
  @Output() isLoadingChange = new EventEmitter<boolean>();
  @Output() currentPageChange = new EventEmitter<number>();
  @Output() totalPagesChange = new EventEmitter<number>();
  @Output() totalItemsChange = new EventEmitter<number>();
  @Output() onCreate = new EventEmitter<void>();

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) table: MatTable<T>;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;

  constructor(
    readonly httpService: HttpService,
    private readonly translatorService: MaterialTranslatorService,
  ) {}

  ngOnInit() {
    this.currentPage = 1;
    this.pageSize = 10;
    this.totalItems = 0;
    this.totalPages = 0;
    if (this.showFooter !== false) {
      this.currentPage = 1;
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
    await this.updateDataSource(true);
  }

  async updateDataSource(pageChanged: boolean = false) {
    if (!this.backend) {
      return;
    }
    this.isLoading = true;
    this.isLoadingChange.emit(this.isLoading);
    const op = await this.httpService.grid<T>({
      backend: this.backend,
      params: {
        query: this.query,
        ...(this.backendParams || {})
      },
      page: this.currentPage || 1,
      pageSize: this.pageSize || 10
    });
    this.isLoading = false;
    this.isLoadingChange.emit(this.isLoading);
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error;
      return;
    }

    this.totalItems = op.data.totalItems;
    this.totalPages = op.data.totalPages;

    this.dataSource.data = op.data.items;


    this.totalItemsChange.emit(this.totalItems);
    this.rowsChange.emit(op.data.items);
    this.totalPagesChange.emit(this.totalPages);
  }

  filterResult() {
    this.currentPage = 1;
    this.currentPageChange.emit(1);
    this.updateDataSource();
  }

  calculateOf() {
    if (!this.totalItems) { return 0; }
    if (this.totalItems < this.pageSize) { return this.totalItems; }
    return ((this.currentPage - 1) * this.pageSize) + this.pageSize;
  }
}
