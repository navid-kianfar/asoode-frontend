import { Component, OnInit } from '@angular/core';
import {MessengerService} from '../../../services/communication/messenger.service';
import {ChannelViewModel} from '../../../view-models/communication/messenger-types';
import {MockService} from '../../../services/mock.service';
import {ConversationType} from '../../../library/app/enums';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
})
export class MessengerComponent implements OnInit {
  current: ChannelViewModel;
  ConversationType = ConversationType;
  constructor(
    private readonly messengerService: MessengerService,
    readonly mockService: MockService,
  ) {}

  ngOnInit() {}

  open(channel: ChannelViewModel) {
    this.current = channel;
  }
}
