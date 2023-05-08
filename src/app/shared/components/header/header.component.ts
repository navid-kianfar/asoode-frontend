import {
  AfterViewInit,
  Component,
  ElementRef, OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { IdentityService } from '../../../auth/services/identity.service';
import { ModalService } from '../../services/modal.service';
import { SearchResultViewModel } from '../../../view-models/general/search-types';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { HttpService } from '../../services/http.service';
import { PopperContent } from 'ngx-popper';
import { OperationResult } from '../../lib/operation-result';
import { PushNotificationService } from '../../services/push-notification.service';
import { SwPush } from '@angular/service-worker';
import { NumberHelpers } from '../../helpers/number.helpers';
import { OperationResultStatus } from '../../lib/enums/operation-result-status';
import { CreateWizardModalComponent } from '../../modals/create-wizard-modal/create-wizard-modal.component';
import { CreateModalParameters } from '../../../view-models/modals/modals-types';
import { SocketListenerService } from '../../services/socket-listener.service';

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
export class HeaderComponent implements AfterViewInit, OnInit, OnDestroy {
  loading: boolean;
  searchTerm: string;
  results: SearchResultViewModel;

  @ViewChild('popperSearch', { static: false }) popperSearch: PopperContent;

  // popper: PopperContent;
  manualShow: boolean;
  private clickListener: any;
  secondInput: boolean;
  private listener: Subscription;
  constructor(
    private readonly renderer: Renderer2,
    private readonly socket: SocketListenerService,
    public readonly identityService: IdentityService,
    private readonly modalService: ModalService,
    private readonly pushNotificationService: PushNotificationService,
    private readonly httpService: HttpService,
    private readonly ref: ElementRef,
    private readonly swPush: SwPush,
  ) {}

  ngOnDestroy(): void {
        this.listener.unsubscribe();
    }
  ngOnInit(): void {
    this.results = { ...EMPTY };
    this.listener = this.socket.listener.subscribe((notification: any) =>{
      // this.pushNotificationService.handleSocket(notification),
    });
    if (this.swPush.isEnabled) {
      this.swPush.messages.subscribe(notification => {
        this.pushNotificationService.handlePush(notification);
      });
      this.swPush.notificationClicks.subscribe(notification => {
        this.pushNotificationService.handlePushClick(notification);
      });
    }
  }

  ngAfterViewInit() {
    const inputs = this.ref.nativeElement.querySelectorAll('input');
    this.bindToInput(inputs[0]);
    this.bindToInput(inputs[1]);
  }

  bindToInput(input) {
    fromEvent(input, 'input')
      .pipe(
        debounceTime(500),
        tap(() => {
          this.results = { ...EMPTY };
          this.loading = true;
          this.manualShow = true;
          this.popperSearch.show();
          if (!this.clickListener) {
            this.clickListener = this.renderer.listen('document', 'click', event => {
              this.popperSearch.hide();
            });
          }
        }),
        switchMap(project => {
          this.searchTerm = NumberHelpers.clearNumbers(
            (input.value || '').trim(),
          );
          if (!this.searchTerm) {
            const op = OperationResult.Success<SearchResultViewModel>({
              ...EMPTY,
            });
            return Promise.resolve(op);
          }
          return this.httpService.post('/search', { search: this.searchTerm });
        }),
      )
      .subscribe(data => {
        this.searchTerm = NumberHelpers.clearNumbers(
          (input.value || '').trim(),
        );
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
      .show(CreateWizardModalComponent, {} as CreateModalParameters);
  }

  openSearchResult($event: MouseEvent) {
    $event.stopPropagation();
    this.secondInput =
      this.pushNotificationService.detector.isMobile() ||
      window.innerWidth <= 550;
    if (this.secondInput) {
      this.popperSearch.show();
      return;
    }

    if (!this.searchTerm) {
      return;
    }
    if (this.popperSearch.state) {
      this.popperSearch.hide();
    } else {
      this.popperSearch.show();
    }
  }
}
