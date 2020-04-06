import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ExplorerFileViewModel,
  ExplorerFolderViewModel,
} from '../../../view-models/storage/files-types';

@Component({
  selector: 'app-file-folder-preview',
  templateUrl: './file-folder-preview.component.html',
  styleUrls: ['./file-folder-preview.component.scss'],
})
export class FileFolderPreviewComponent implements OnInit {
  @Input() selected: boolean;
  @Input() folder: ExplorerFolderViewModel;
  @Input() file: ExplorerFileViewModel;
  @Output() selectedChange = new EventEmitter<boolean>();
  @Input() up: boolean;
  constructor() {}

  ngOnInit() {
    if (!this.file && !this.folder) {
      this.folder = {
        parent: '/',
        selected: false,
        createdAt: new Date(),
        name: '...',
        path: '/'
      };
    }
  }
}
