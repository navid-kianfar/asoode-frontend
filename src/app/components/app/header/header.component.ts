import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IdentityService } from '../../../services/auth/identity.service';
import { ModalService } from '../../../services/core/modal.service';
import { CreateWizardComponent } from '../../../modals/create-wizard/create-wizard.component';
import { CreateModalParameters } from '../../../view-models/modals/modals-types';
import { SearchResultViewModel } from '../../../view-models/general/search-types';
import { fromEvent } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { OperationResultStatus } from '../../../library/core/enums';
import { HttpService } from '../../../services/core/http.service';
import { PopperContent } from 'ngx-popper';
import { OperationResult } from '../../../library/core/operation-result';
import {Socket} from 'ngx-socket-io';

const EMPTY = {
  members: [],
  storage: {
    files: [],
    folders: [],
  },
  groups: [],
  projects: [],
  tasks: [],
} as SearchResultViewModel;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit, OnInit {
  loading: boolean;
  searchTerm: string;
  results: SearchResultViewModel;
  popper: PopperContent;
  constructor(
    private readonly socket: Socket,
    public readonly identityService: IdentityService,
    private readonly modalService: ModalService,
    private readonly httpService: HttpService,
    private readonly ref: ElementRef,
  ) {}
  ngOnInit(): void {
    this.results = { ...EMPTY };
    this.socket.on('push-notification', (notification: any) => {
      console.log('socket event', notification);
    });
  }

  ngAfterViewInit() {
    const input = this.ref.nativeElement.querySelectorAll('input')[0];
    fromEvent(input, 'input')
      .pipe(
        debounceTime(500),
        tap(() => {
          this.results = { ...EMPTY };
          this.loading = true;
          if (this.popper) {
            this.popper.show();
          }
        }),
        switchMap(project => {
          const search = input.value;
          if (!search) {
            const op = OperationResult.Success<SearchResultViewModel>({
              ...EMPTY,
            });
            return Promise.resolve(op);
          }
          return this.httpService.post('/search', { search });
        }),
      )
      .subscribe(data => {
        this.searchTerm = input.value;
        if (data.status === OperationResultStatus.Success) {
          this.results = data.data as SearchResultViewModel;
        } else {
          this.results = { ...EMPTY };
        }
        this.loading = false;
      });
  }

  prepareCreate() {
    this.modalService
      .show(CreateWizardComponent, {} as CreateModalParameters)
      .subscribe(() => {});
  }
}
