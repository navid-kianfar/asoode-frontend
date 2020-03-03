import {Component, Input, OnInit} from '@angular/core';
import {FilesService} from '../../../services/storage/files.service';
import {OperationResultStatus} from '../../../library/core/enums';
import {ExplorerFileViewModel, ExplorerFolderViewModel, ExplorerViewModel} from '../../../view-models/storage/files-types';
import {OperationResult} from '../../../library/core/operation-result';
import {MockService} from '../../../services/mock.service';
import {ModalService} from '../../../services/core/modal.service';
import {PromptComponent} from '../../../modals/prompt/prompt.component';
import {PromptModalParameters} from '../../../view-models/core/modal-types';
import {FormService} from '../../../services/core/form.service';

@Component({
  selector: 'app-files-explorer',
  templateUrl: './files-explorer.component.html',
  styleUrls: ['./files-explorer.component.scss']
})
export class FilesExplorerComponent implements OnInit {
  @Input() sharedByMe: boolean;
  @Input() private: boolean;
  waiting: boolean;
  detail: boolean;
  path: string;
  data: ExplorerViewModel;
  clipBoard: ExplorerViewModel;
  private timer: number;
  private preventSimpleClick: boolean;
  atLeastOneSelected: boolean;
  inClipboard: boolean;
  onlyOneSelected: boolean;
  canOpen: boolean;
  oneFileSelected: boolean;

  constructor(
    private readonly filesService: FilesService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
  ) { }

  ngOnInit() {
    this.data = {folders: [], files: []};
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
    this.data = op.data;
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
    this.atLeastOneSelected = false;
    this.onlyOneSelected = false;
    this.oneFileSelected = false;
    this.canOpen = false;
  }

  selectFolder(folder: ExplorerFolderViewModel) {
    this.clearSelection();
    folder.selected = true;
    this.atLeastOneSelected = true;
    this.onlyOneSelected = true;
  }

  holdSelectFolder(folder: ExplorerFolderViewModel) {
    folder.selected = !folder.selected;
    const selectedFolders = this.data.folders.filter(i => i.selected).length;
    const selectedFiles = this.data.files.filter(i => i.selected).length;
    this.atLeastOneSelected = (selectedFolders + selectedFiles) > 0;
    this.onlyOneSelected = (selectedFolders + selectedFiles) === 0;
    this.oneFileSelected = this.onlyOneSelected && selectedFiles === 1;
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
    const selectedFolders = this.data.folders.filter(i => i.selected).length;
    const selectedFiles = this.data.files.filter(i => i.selected);
    this.atLeastOneSelected = (selectedFolders + selectedFiles.length) > 0;
    this.onlyOneSelected = (selectedFolders + selectedFiles.length) === 0;
    this.oneFileSelected = (selectedFiles.length === 1);
    this.canOpen = this.oneFileSelected && this.canOpenFile(selectedFiles[0]);
  }

  canOpenFile(file: ExplorerFileViewModel) {
    return file.isImage || file.isPresentation || file.isSpreadsheet || file.isPdf || file.isDocument;
  }

  actionCut() {
    this.clipBoard = {
      folders: this.data.folders.filter(f => f.selected),
      files: this.data.files.filter(f => f.selected),
    };
  }

  actionCopy() {
    this.clipBoard = {
      folders: this.data.folders.filter(f => f.selected),
      files: this.data.files.filter(f => f.selected),
    };
  }

  actionOpenInNewTab() {
    const file = this.data.files.find(f => f.selected);
    window.open(file.url, '_blank');
  }

  prepareNewFolder() {
    this.modalService.show(PromptComponent, {
      title: 'NEW_FOLDER',
      form: [{
        elements: [
          this.formService.createInput({
            config: { field: 'title', label: 'TITLE' },
            params: { model: '' },
            validation: {
              required: {
                value: true,
                message: 'TITLE_REQUIRED'
              }
            }
          })
        ]
      }],
      action: async (params, form) => {
        console.log(params, form);
      },
      actionLabel: 'CREATE',
      actionColor: 'primary',
      width: 300
    } as PromptModalParameters)
      .subscribe(() => {});
  }

  actionPaste() {
    // TODO: paste action

    this.clipBoard = null;
  }

  actionDownload() {

  }

  actionOpen() {

  }

  prepareUpload() {

  }
}
