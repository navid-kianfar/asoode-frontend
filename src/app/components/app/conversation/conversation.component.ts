import {Component, Input, OnInit} from '@angular/core';
import {MappedConversationViewModel} from '../../../view-models/communication/messenger-types';
import {MockService} from '../../../services/mock.service';
import { ConversationType } from 'src/app/library/app/enums';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  @Input() recordId: string;
  waiting: boolean;
  mappedConversations: MappedConversationViewModel[] = [];

  ConversationType = ConversationType;
  constructor(
    private readonly mockService: MockService
  ) { }

  ngOnInit() {
    this.mappedConversations = [
      {
        date: 'جمعه ۲۳ خرداد',
        messages: this.mockService.messages
      }
    ];
  }

}
