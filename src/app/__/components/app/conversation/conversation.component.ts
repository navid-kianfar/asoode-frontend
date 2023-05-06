import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ConversationViewModel,
  MappedConversationViewModel,
} from '../../../../view-models/communication/messenger-types';
import {
  AccessType,
  ConversationType,
} from 'src/app/shared/lib/enums/enums';
import { MemberInfoViewModel } from '../../../../view-models/auth/identity-types';
import { MessengerService } from '../../../../messenger/services/messenger.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { CreateWizardModalComponent } from '../../../../shared/modals/create-wizard-modal/create-wizard-modal.component';
import { Socket } from 'ngx-socket-io';
import { CulturedDateService } from '../../../../shared/services/cultured-date.service';
import { IdentityService } from '../../../../auth/services/identity.service';
import { UploadViewModel } from '../../../../view-models/storage/files-types';
import { FilesService } from '../../../../storage/services/files.service';
import { UsersService } from '../../../../project/services/users.service';
import { ActivityType } from '../../../../shared/lib/enums/activity-type';
import { OperationResultStatus } from '../../../../shared/lib/enums/operation-result-status';

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
  AccessType = AccessType;
  allowedTypes: string;
  permission: AccessType;

  constructor(
    readonly identityService: IdentityService,
    private readonly messengerService: MessengerService,
    private readonly modalService: ModalService,
    private readonly culturedDateService: CulturedDateService,
    readonly filesService: FilesService,
    readonly usersService: UsersService,
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
      '.moho',
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
    if (this.messengerService.lock) {
      return;
    }
    this.messengerService.lock = true;
    this.socket.on('push-notification', notification => {
      switch (notification.type) {
        case ActivityType.ChannelMessage:
          if (this.recordId === notification.data.channelId) {
            this.push(notification.data);
          }
          break;
        case ActivityType.ChannelUpload:
          if (this.recordId === notification.data.channelId) {
            this.push(notification.data);
          }
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
      m.createdAt = new Date(m.createdAt);
    });
    op.data.forEach(m => {
      const date = this.culturedDateService.toString(m.createdAt);
      dictionary[date] = dictionary[date] || [];
      dictionary[date].push(m);
    });
    // op.data.sort((a, b) => a.createdAt.getTime() > b.createdAt.getTime() ? 1 : -1);
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
          .show(CreateWizardModalComponent, { simpleGroup: true })
          .subscribe(() => {});
        break;
      case 'COMMAND_NEW_PROJECT':
        this.modalService
          .show(CreateWizardModalComponent, { simpleProject: true })
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
    this.filesService.attachChat(upload, this.recordId);
    this.filesService.chatAttaching = [
      ...this.filesService.chatAttaching,
      ...upload,
    ];
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

  onAudioEnded($event: any, upload: any) {}
  getPath(attachment: any) {
    if (attachment.path.indexOf('https://') === -1) {
      return 'https://storage.asoode.com' + attachment.path;
    }
    return attachment.path;
  }

  openAttachment(upload: any) {
    window.open(this.getPath(upload), '_blank');
  }

  downloadAttachment(upload: any) {
    this.filesService.download(upload.path, null);
  }
}
