import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MappedConversationViewModel} from '../../../view-models/communication/messenger-types';
import {ConversationType} from 'src/app/library/app/enums';
import {MemberInfoViewModel} from '../../../view-models/auth/identity-types';
import {MessengerService} from '../../../services/communication/messenger.service';
import {OperationResultStatus} from '../../../library/core/enums';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit, OnChanges {
  @Input() recordId: string;
  @Input() dashboard: boolean;
  @Input() members: MemberInfoViewModel[];
  waiting: boolean;
  mappedConversations: MappedConversationViewModel[] = [];

  ConversationType = ConversationType;
  constructor(private readonly messengerService: MessengerService) {}

  ngOnInit() {
    this.mappedConversations = [];
    this.fetch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.recordId && !changes.recordId.firstChange) {
      this.ngOnInit();
    }
  }

  async fetch() {
    this.waiting = true;
    const op = await this.messengerService.fetch(this.recordId);
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    this.waiting = false;
    // TODO: map messages
  }
}
