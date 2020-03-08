import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../../../services/communication/messenger.service';
import { ChannelViewModel } from '../../../view-models/communication/messenger-types';
import { MockService } from '../../../services/mock.service';
import { ConversationType } from '../../../library/app/enums';
import { ModalService } from '../../../services/core/modal.service';
import { ChannelSettingComponent } from '../../../modals/channel-setting/channel-setting.component';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
})
export class MessengerComponent implements OnInit {
  current: ChannelViewModel;
  ConversationType = ConversationType;
  showFiles: boolean;
  constructor(
    private readonly messengerService: MessengerService,
    readonly mockService: MockService,
    readonly modalService: ModalService,
  ) {}

  ngOnInit() {}

  open(channel: ChannelViewModel) {
    this.current = channel;
  }

  toggleFiles() {
    this.showFiles = !this.showFiles;
  }

  openSetting() {
    this.modalService.show(ChannelSettingComponent, {}).subscribe(() => {});
  }
}
