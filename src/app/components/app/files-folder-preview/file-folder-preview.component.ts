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
        path: '/',
      };
    }
  }

  getIcon(file: ExplorerFileViewModel) {
    if (file.isImage) {
      return 'image icon-image2';
    }
    if (file.isArchive) {
      return 'archive icon-file-zip';
    }
    if (file.isPdf) {
      return 'pdf icon-file-pdf';
    }
    if (file.isDocument) {
      return 'document icon-file-word';
    }
    if (file.isSpreadsheet) {
      return 'spreadsheet icon-file-excel';
    }
    if (file.isPresentation) {
      return 'presentation icon-file-presentation';
    }
    if (file.isCode) {
      return 'code icon-file-xml';
    }
    if (file.isExecutable) {
      return 'executable icon-file-exe';
    }
    return 'other icon-files-empty';
  }
}
