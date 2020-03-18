import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../../../services/communication/messenger.service';
import { ChannelViewModel } from '../../../view-models/communication/messenger-types';
import { MockService } from '../../../services/mock.service';
import { ConversationType, ChannelType } from '../../../library/app/enums';
import { ModalService } from '../../../services/core/modal.service';
import { MessengerSettingComponent } from '../../../modals/messenger-setting/messenger-setting.component';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
})
export class MessengerComponent implements OnInit {
  current: ChannelViewModel;
  ChannelType = ChannelType;
  showFiles: boolean;
  filter: string;
  constructor(
    private readonly messengerService: MessengerService,
    readonly mockService: MockService,
    readonly modalService: ModalService,
  ) {}

  ngOnInit() {
    this.showFiles = true;
  }

  open(channel: ChannelViewModel) {
    this.current = channel;
  }

  toggleFiles() {
    this.showFiles = !this.showFiles;
  }

  openSetting() {
    this.modalService.show(MessengerSettingComponent, {}).subscribe(() => {});
  }

  openChannels() {
    this.current = undefined;
  }
}
