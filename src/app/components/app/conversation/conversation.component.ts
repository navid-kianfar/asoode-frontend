import {
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges, ViewChild,
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
import {UploadViewModel} from '../../../view-models/storage/files-types';
import {FilesService} from '../../../services/storage/files.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() recordId: string;
  @Input() popup: boolean;
  @Input() dashboard: boolean;
  @Input() members: MemberInfoViewModel[];
  @ViewChild('filePicker', { static: false }) filePicker;

  waiting: boolean;
  sending: boolean;
  clearEditor = new EventEmitter();
  mappedConversations: MappedConversationViewModel[] = [];
  ConversationType = ConversationType;
  allowedTypes: string;

  constructor(
    readonly identityService: IdentityService,
    private readonly messengerService: MessengerService,
    private readonly modalService: ModalService,
    private readonly culturedDateService: CulturedDateService,
    private readonly filesService: FilesService,
    private readonly socket: Socket,
  ) {}

  ngOnInit() {
    this.mappedConversations = [];
    this.allowedTypes = [
      'image/*',
      'audio/*',
      'video/*',
      '.xls,.xlsx,.csv',
      '.zip,.rar,.7z,.tar,.gz',
      '.pdf',
      '.ppt,.pptx',
      '.doc,.docx,.rtf,.txt',
    ].join(',');
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

  uploadFile() {
    this.filePicker.nativeElement.click();
  }


  onChange(target: any) {
    if (!target.files || !target.files.length) {
      return;
    }
    const upload: UploadViewModel[] = [];
    for (let i = 0; i < target.files.length; i++) {
      const f = target.files.item(i);
      upload.push({
        uploading: false,
        success: false,
        failed: false,
        progress: 0,
        name: f.name,
        size: f.size,
        file: f,
        extensionLessName: this.filesService.getExtensionLessFileName(f.name),
        extension: this.filesService.getFileExtension(f.name),
        promise: undefined,
        recordId: this.recordId,
      });
    }
    this.clearInputFile(target);
    this.filesService.chatAttaching = [...this.filesService.chatAttaching, ...upload];
    this.filesService.attachChat(upload, this.recordId);
  }

  clearInputFile(f) {
    if (f.value) {
      try {
        f.value = '';
      } catch (err) {}
      if (f.value) {
        const form = document.createElement('form');
        const parentNode = f.parentNode;
        const ref = f.nextSibling;
        form.appendChild(f);
        form.reset();
        parentNode.insertBefore(f, ref);
      }
    }
  }
}
