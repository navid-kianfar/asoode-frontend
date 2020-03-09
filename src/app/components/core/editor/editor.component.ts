import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CultureService} from '../../../services/core/culture.service';
import Quill from 'quill';
import 'quill-mention';
import 'quill-emoji/dist/quill-emoji.js';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @Input() messenger: boolean;
  @Input() model: string;
  @Input() placeHolder: string;

  modules: any;
  @ViewChild(QuillEditorComponent, { static: true }) editor: QuillEditorComponent;
  constructor(readonly cultureService: CultureService) {}

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
            const values = [
              { id: 1, value: 'نوید کیانفر' },
              { id: 2, value: 'صبا کیانفر' }
            ];

            if (searchTerm.length === 0) {
              renderList(values, searchTerm);
            } else {
              const matches = [];

              values.forEach((entry) => {
                if (entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                  matches.push(entry);
                }
              });
              renderList(matches, searchTerm);
            }
          }
        },
      };
    }
  }
}
