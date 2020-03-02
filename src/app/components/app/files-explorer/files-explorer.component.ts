import {Component, Input, OnInit} from '@angular/core';
import {FilesService} from '../../../services/storage/files.service';
import {OperationResultStatus} from '../../../library/core/enums';
import {ExplorerFileViewModel, ExplorerFolderViewModel, ExplorerViewModel} from '../../../view-models/storage/files-types';
import {OperationResult} from '../../../library/core/operation-result';
import {MockService} from '../../../services/mock.service';

@Component({
  selector: 'app-files-explorer',
  templateUrl: './files-explorer.component.html',
  styleUrls: ['./files-explorer.component.scss']
})
export class FilesExplorerComponent implements OnInit {
  @Input() sharedByMe: boolean;
  @Input() private: boolean;
  waiting: boolean;
  path: string;
  data: ExplorerViewModel;
  private timer: number;
  private preventSimpleClick: boolean;

  constructor(
    private readonly filesService: FilesService,
    private readonly mockService: MockService,
  ) { }

  ngOnInit() {
    this.fetch('/');
  }

  async fetch(path: string) {
    this.path = path;
    this.waiting = true;
    let op: OperationResult<ExplorerViewModel>;
    if (this.private) {
      op = await this.filesService.myFiles(this.path);
    } else {
      if (this.sharedByMe) {
        op = await this.filesService.sharedByMe(this.path);
      } else {
        op = await this.filesService.sharedByOthers(this.path);
      }
    }
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle error
      return;
    }
    // this.data = op.data;
    this.data = this.mockService.files;
    this.waiting = false;
  }

  handleClick($event: any, folder: ExplorerFolderViewModel) {
    this.timer = 0;
    this.preventSimpleClick = false;
    const delay = 200;

    this.timer = setTimeout(() => {
      if (!this.preventSimpleClick) {
        if ($event.ctrlKey || $event.metaKey) {
          this.holdSelectFolder(folder);
        } else {
          this.selectFolder(folder);
        }
      }
    }, delay);
  }

  clearSelection() {
    this.data.folders.forEach(f => f.selected = false);
    this.data.files.forEach(f => f.selected = false);
  }

  selectFolder(folder: ExplorerFolderViewModel) {
    this.clearSelection();
    folder.selected = true;
  }

  holdSelectFolder(folder: ExplorerFolderViewModel) {
    folder.selected = !folder.selected;
  }

  async enterFolder(folder: ExplorerFolderViewModel) {
    this.preventSimpleClick = true;
    clearTimeout(this.timer);
    this.clearSelection();
    await this.fetch(folder.path);
  }

  selectFile($event: MouseEvent, file: ExplorerFileViewModel) {
    if ($event.ctrlKey || $event.metaKey) {
      file.selected = !file.selected;
    } else {
      this.clearSelection();
      file.selected = true;
    }
  }
}
