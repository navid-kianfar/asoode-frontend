import {
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ConversationViewModel,
  MappedConversationViewModel,
} from '../../../view-models/communication/messenger-types';
import { ActivityType, ConversationType } from 'src/app/library/app/enums';
import { MemberInfoViewModel } from '../../../view-models/auth/identity-types';
import { MessengerService } from '../../../services/communication/messenger.service';
import { OperationResultStatus } from '../../../library/core/enums';
import { ModalService } from '../../../services/core/modal.service';
import { CreateWizardComponent } from '../../../modals/create-wizard/create-wizard.component';
import { Socket } from 'ngx-socket-io';
import { CulturedDateService } from '../../../services/core/cultured-date.service';
import {IdentityService} from '../../../services/auth/identity.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() recordId: string;
  @Input() dashboard: boolean;
  @Input() members: MemberInfoViewModel[];
  waiting: boolean;
  sending: boolean;
  clearEditor = new EventEmitter();
  mappedConversations: MappedConversationViewModel[] = [];
  ConversationType = ConversationType;

  constructor(
    readonly identityService: IdentityService,
    private readonly messengerService: MessengerService,
    private readonly modalService: ModalService,
    private readonly culturedDateService: CulturedDateService,
    private readonly socket: Socket,
  ) {}

  ngOnInit() {
    this.mappedConversations = [];
    this.bind();
    this.fetch();
  }

  ngOnDestroy(): void {
    this.messengerService.lock = false;
  }

  bind() {
    if (this.messengerService.lock) { return; }
    this.messengerService.lock = true;
    this.socket.on('push-notification', (notification) => {
      switch (notification.type) {
        case ActivityType.ChannelMessage:
          if (this.recordId === notification.data.channelId) {
            this.push(notification.data);
          }
          break;
        case ActivityType.ChannelUpload:
          break;
      }
    });
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
    const dictionary = {};
    op.data.forEach(m => {
      const date = this.culturedDateService.toString(m.createdAt);
      dictionary[date] = dictionary[date] || [];
      dictionary[date].push(m);
    });
    this.mappedConversations = Object.keys(dictionary).map(k => {
      return { date: k, messages: dictionary[k] };
    });
  }
  private push(data: any) {
    const date = this.culturedDateService.toString(data.createdAt);
    let section = this.mappedConversations.find(c => c.date === date);
    if (!section) {
      section = { date, messages: [] };
      this.mappedConversations.push(section);
    }
    section.messages.push(data);
  }

  openLink(message: ConversationViewModel) {
    switch (message.path) {
      case 'COMMAND_NEW_GROUP':
        this.modalService
          .show(CreateWizardComponent, { simpleGroup: true })
          .subscribe(() => {});
        break;
      case 'COMMAND_NEW_PROJECT':
        this.modalService
          .show(CreateWizardComponent, { simpleProject: true })
          .subscribe(() => {});
        break;
      default:
        window.open(message.path, '_blank');
        break;
    }
  }

  async sendMessage(message: string) {
    message = message.trim();
    if (!message) {
      return;
    }
    this.sending = true;
    const op = await this.messengerService.send(this.recordId, { message });
    this.sending = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
    }
    this.clearEditor.emit();
  }

  uploadFile() {}

  pickFile() {}
}
