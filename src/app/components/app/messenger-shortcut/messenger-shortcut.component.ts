import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/core/modal.service';
import { MessengerSettingComponent } from '../../../modals/messenger-setting/messenger-setting.component';
import { ChannelViewModel } from '../../../view-models/communication/messenger-types';
import { MockService } from '../../../services/mock.service';

@Component({
  selector: 'app-messenger-shortcut',
  templateUrl: './messenger-shortcut.component.html',
  styleUrls: ['./messenger-shortcut.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessengerShortcutComponent implements OnInit {
  @Input() dashboard: boolean;
  showMessages: boolean;
  current: ChannelViewModel;

  constructor(
    private readonly router: Router,
    readonly modalService: ModalService,
    readonly mockService: MockService,
  ) {}

  ngOnInit() {
    this.current = this.mockService.channels[0];
  }

  open() {
    if (this.dashboard) {
      this.showMessages = true;
      return;
    }
    this.router.navigateByUrl('/messenger');
  }

  hide() {
    this.showMessages = false;
  }

  goToMessenger() {
    this.showMessages = false;
    this.router.navigateByUrl('/messenger');
  }

  setting() {
    this.modalService.show(MessengerSettingComponent, {}).subscribe(() => {});
  }
}
