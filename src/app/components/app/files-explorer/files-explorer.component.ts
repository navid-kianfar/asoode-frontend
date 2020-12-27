import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FilesService } from '../../../services/storage/files.service';
import { OperationResultStatus } from '../../../library/core/enums';
import {
  ExplorerFileViewModel,
  ExplorerFolderViewModel,
  ExplorerViewModel,
  UploadViewModel,
} from '../../../view-models/storage/files-types';
import { OperationResult } from '../../../library/core/operation-result';
import { ModalService } from '../../../services/core/modal.service';
import { PromptComponent } from '../../../modals/prompt/prompt.component';
import { PromptModalParameters } from '../../../view-models/core/modal-types';
import { FormService } from '../../../services/core/form.service';
import { SortType } from 'src/app/library/app/enums';
import { DocumentModalComponent } from '../../../modals/document-modal/document-modal.component';
import { StringHelpers } from '../../../helpers/string.helpers';
import { TranslateService } from '../../../services/core/translate.service';
import { IdentityService } from '../../../services/auth/identity.service';
import { UploadExceedModalComponent } from '../../../modals/upload-exceed-modal/upload-exceed-modal.component';

@Component({
  selector: 'app-files-explorer',
  templateUrl: './files-explorer.component.html',
  styleUrls: ['./files-explorer.component.scss'],
})
export class FilesExplorerComponent implements OnInit {
  @Input() sharedByMe: boolean;
  @Input() private: boolean;
  waiting: boolean;
  detail: boolean;
  path: string;
  data: ExplorerViewModel;
  clipBoard: ExplorerViewModel;
  atLeastOneSelected: boolean;
  inClipboard: boolean;
  onlyOneSelected: boolean;
  canOpen: boolean;
  oneFileSelected: boolean;
  allowedTypes: string;
  parent: ExplorerFolderViewModel[];
  sort: SortType;
  private timer: number;
  private preventSimpleClick: boolean;

  @ViewChild('filePicker', { static: false }) filePicker;
  constructor(
    private readonly filesService: FilesService,
    private readonly modalService: ModalService,
    private readonly formService: FormService,
    private readonly identityService: IdentityService,
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.parent = [
      {
        path: '/',
        name: '',
        parent: '',
        createdAt: new Date(),
        selected: false,
      },
    ];
    this.sort = SortType.DateAsc;
    this.data = { folders: [], files: [] };
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
    this.data.folders.forEach(f => (f.selected = false));
    this.data.files.forEach(f => (f.selected = false));
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
    this.atLeastOneSelected = selectedFolders + selectedFiles > 0;
    this.onlyOneSelected = selectedFolders + selectedFiles === 0;
    this.oneFileSelected = this.onlyOneSelected && selectedFiles === 1;
  }

  async goUp() {
    this.parent.shift();
    this.path = this.parent[0].path;
    await this.fetch(this.path);
  }

  async enterFolder(folder: ExplorerFolderViewModel) {
    this.preventSimpleClick = true;
    clearTimeout(this.timer);
    this.clearSelection();
    this.parent.unshift(folder);
    this.path = folder.path;
    await this.fetch(this.path);
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
    this.atLeastOneSelected = selectedFolders + selectedFiles.length > 0;
    this.onlyOneSelected = selectedFolders + selectedFiles.length === 1;
    this.oneFileSelected = selectedFiles.length === 1;
    this.canOpen = this.oneFileSelected && this.canOpenFile(selectedFiles[0]);
  }

  canOpenFile(file: ExplorerFileViewModel) {
    return (
      file.isImage ||
      file.isPresentation ||
      file.isSpreadsheet ||
      file.isPdf ||
      file.isDocument
    );
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
    this.modalService
      .show(PromptComponent, {
        title: 'NEW_FOLDER',
        form: [
          {
            elements: [
              this.formService.createInput({
                config: { field: 'title' },
                params: { model: '', placeHolder: 'TITLE' },
                validation: {
                  required: {
                    value: true,
                    message: 'TITLE_REQUIRED',
                  },
                },
              }),
            ],
          },
        ],
        actionLabel: 'CREATE',
        actionColor: 'primary',
        width: 300,
        action: async (params, form) => {
          const op = await this.filesService.newFolder({
            path: this.path,
            name: params.title,
          });
          if (op.status === OperationResultStatus.Duplicate) {
            this.formService.setErrors(form, 'title', ['DIRECTORY_EXISTS']);
            throw new Error('DUPLICATE');
          }
          this.fetch(this.path);
        },
      } as PromptModalParameters)
      .subscribe(() => {});
  }

  actionPaste() {
    // TODO: paste action

    this.clipBoard = null;
  }

  actionDownload() {
    const file = this.data.files.find(i => i.selected);
    this.filesService.download(file.url);
  }

  actionOpen() {
    const file = this.data.files.find(i => i.selected);
    this.modalService
      .show(DocumentModalComponent, {
        path: file.url,
      })
      .subscribe(() => {});
  }

  prepareUpload() {
    this.filePicker.nativeElement.click();
  }

  actionRename() {
    const file = this.data.files.find(i => i.selected);
    const folder = this.data.folders.find(i => i.selected);
    const title = file ? file.extensionLessName : folder.name;
    this.modalService
      .show(PromptComponent, {
        title: 'RENAME',
        form: [
          {
            elements: [
              this.formService.createInput({
                config: { field: 'title' },
                params: { model: title, placeHolder: 'TITLE' },
                validation: {
                  required: {
                    value: true,
                    message: 'TITLE_REQUIRED',
                  },
                },
              }),
            ],
          },
        ],
        actionLabel: 'SAVE_CHANGES',
        actionColor: 'primary',
        width: 300,
        action: async (params, form) => {
          const op = await this.filesService.rename({
            path: (file || folder).path,
            name: params.title,
          });
          if (op.status === OperationResultStatus.Duplicate) {
            this.formService.setErrors(form, 'title', [
              file ? 'FILE_EXISTS' : 'DIRECTORY_EXISTS',
            ]);
            throw new Error('DUPLICATE');
          }
          this.fetch(this.path);
        },
      } as PromptModalParameters)
      .subscribe(() => {});
  }
  actionDelete() {
    const selectedFolders = this.data.folders.filter(i => i.selected);
    const selectedFiles = this.data.files.filter(i => i.selected);

    const names = selectedFolders
      .map(f => f.name)
      .concat(selectedFiles.map(f => f.name));

    const paths = selectedFolders
      .map(f => f.path)
      .concat(selectedFiles.map(f => f.path));

    const heading = StringHelpers.format(
      this.translateService.fromKey('REMOVE_FILES_FOLDERS_CONFIRM_HEADING'),
      [names.join(', ')],
    );
    this.modalService
      .confirm({
        title: 'REMOVE_FILES_FOLDERS',
        message: 'REMOVE_FILES_FOLDERS_CONFIRM',
        heading,
        actionLabel: 'REMOVE_FILES_FOLDERS',
        cancelLabel: 'CANCEL',
        action: async () => {
          const op = await this.filesService.delete({ paths });
          if (op.status === OperationResultStatus.Success) {
            await this.fetch(this.path);
            return;
          }
          // TODO: handle error
        },
      })
      .subscribe(confirmed => {});
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
      });
    }
    this.clearInputFile(target);

    this.filterFiles(upload).then(filtered => {
      this.filesService.upload(filtered, this.path);
      filtered.forEach(u => u.promise.then(() => this.fetch(this.path)));
      this.filesService.uploading = [
        ...this.filesService.uploading,
        ...filtered,
      ];
    });
  }

  async filterFiles(upload: UploadViewModel[]): Promise<UploadViewModel[]> {
    return new Promise((resolve, reject) => {
      const filtered: UploadViewModel[] = [];
      const allowed: UploadViewModel[] = [];
      (upload || []).forEach(u => {
        if (u.file.size > this.identityService.profile.plan.attachmentSize) {
          filtered.push(u);
        } else {
          allowed.push(u);
        }
      });
      if (filtered.length) {
        this.modalService
          .show(UploadExceedModalComponent, {
            uploads: filtered,
            attachmentSize: this.identityService.profile.plan.attachmentSize,
          })
          .subscribe(() => resolve(allowed));
        return;
      }
      resolve(allowed);
    });
  }

  async goTo(p: ExplorerFolderViewModel) {
    let idx = this.parent.indexOf(p);
    if (idx === 0) {
      return;
    }
    let s: ExplorerFolderViewModel;
    while (idx > 0) {
      s = this.parent.shift();
      idx--;
    }
    this.path = s.parent || '/';
    await this.fetch(this.path);
  }

  copyLink() {

  }
}
