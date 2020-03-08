import {Component, Input, OnInit} from '@angular/core';
import {MappedConversationViewModel} from '../../../view-models/communication/messenger-types';
import {MockService} from '../../../services/mock.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  @Input() recordId: string;
  waiting: boolean;
  mappedConversations: MappedConversationViewModel[] = [];

  constructor(
    private readonly mockService: MockService
  ) { }

  ngOnInit() {
    this.mappedConversations = [
      {
        date: '23/3',
        messages: this.mockService.messages
      }
    ];
  }

}
