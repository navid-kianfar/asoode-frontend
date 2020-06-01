import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CultureService } from '../../../services/core/culture.service';
import Quill from 'quill';
import 'quill-mention';
import 'quill-emoji/dist/quill-emoji.js';
import { QuillEditorComponent } from 'ngx-quill';
import { MemberInfoViewModel } from '../../../view-models/auth/identity-types';
import { Subscription } from 'rxjs';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  private subscribe: Subscription;
  @Input() disabled: boolean;
  @Input() messenger: boolean;
  @Input() model: string;
  @Input() placeHolder: string;
  @Input() members: MemberInfoViewModel[];
  @Input() clear: EventEmitter<void>;
  @Output() send = new EventEmitter<string>();
  @Output() fileUpload = new EventEmitter<boolean>();
  @Output() filePick = new EventEmitter<boolean>();

  modules: any;
  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;
  constructor(
    readonly cultureService: CultureService,
    readonly deviceDetectorService: DeviceDetectorService,
  ) {}

  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }

  ngOnInit() {
    this.placeHolder = this.placeHolder || 'ENTER_YOUR_MESSAGE';
    if (this.messenger) {
      this.modules = {
        'emoji-shortname': true,
        'emoji-textarea': true,
        'emoji-toolbar': true,
        mention: {
          // allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
          onSelect: (item, insertItem) => {
            const editor = this.editor.quillEditor as Quill;
            insertItem(item);
            // necessary because quill-mention triggers changes as 'api' instead of 'user'
            editor.insertText(editor.getLength() - 1, '', 'user');
          },
          source: (searchTerm, renderList) => {
            const values = this.members.map(m => {
              return { id: m.id, value: m.fullName };
            });

            if (searchTerm.length === 0) {
              renderList(values, searchTerm);
            } else {
              const matches = [];

              values.forEach(entry => {
                if (
                  entry.value
                    .toLowerCase()
                    .indexOf(searchTerm.toLowerCase()) !== -1
                ) {
                  matches.push(entry);
                }
              });
              renderList(matches, searchTerm);
            }
          },
        },
      };
    }
    if (this.clear) {
      this.subscribe = this.clear.subscribe(() => (this.model = ''));
    }
  }
}
