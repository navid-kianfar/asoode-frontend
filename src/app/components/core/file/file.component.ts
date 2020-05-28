import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  DropdownKnownList,
  FileType,
  OperationResultStatus,
} from '../../../library/core/enums';
import { HttpService } from '../../../services/core/http.service';
import { TranslateService } from '../../../services/core/translate.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
})
export class FileComponent implements OnInit {
  @ViewChild('filePicker', { static: false }) filePicker;
  @Input() browse: string;
  @Input() backend: string;
  @Input() backendParams?: any;
  @Input() summary: string;
  @Input() extensions: string[];
  @Input() cssClass: string;
  @Input() disabled: boolean;
  @Input() uploadOnPick: boolean;
  @Input() clearAfterUpload: boolean;
  @Input() current: string;
  @Input() multiple: boolean;
  @Input() preview: boolean;
  @Input() fileType: FileType;
  @Input() thumbnail: boolean;
  @Input() placeHolder: string;
  @Input() thumbnailLabel: string;
  @Input() thumbnailIcon: string;
  @Input() model: File | File[];
  @Output() onStart = new EventEmitter<void>();
  @Output() onError = new EventEmitter<void>();
  @Output() onProgress = new EventEmitter<number>();
  @Output() onFinished = new EventEmitter<void>();
  @Output() modelChange = new EventEmitter<File | File[]>();
  @Output() currentChange = new EventEmitter<string | string[]>();
  selectedFiles: File[];
  uploadPercent: number;
  uploading: boolean;
  allowedTypes: string;

  constructor(
    readonly translateService: TranslateService,
    readonly httpService: HttpService,
  ) {}

  get inputText(): string {
    if (!this.selectedFiles.length) {
      return this.translateService.fromKey('NO_FILES_SELECTED');
    }
    if (!this.multiple) {
      return this.selectedFiles[0].name;
    }
    return this.selectedFiles.map(f => f.name).join(', ');
  }

  ngOnInit() {
    this.selectedFiles = [];
    this.extensions = this.extensions || [];
    this.uploading = false;
    this.uploadPercent = 0;
    this.uploadOnPick = this.uploadOnPick || false;
    if (this.extensions.length) {
      this.fileType = FileType.Specific;
    }
    this.fileType = this.fileType || FileType.Any;
    switch (this.fileType) {
      case FileType.Image:
        this.allowedTypes = 'image/*';
        break;
      case FileType.Audio:
        this.allowedTypes = 'audio/*';
        break;
      case FileType.Video:
        this.allowedTypes = 'video/*';
        break;
      case FileType.Excel:
        this.allowedTypes = '.xls,.xlsx';
        break;
      case FileType.Pdf:
        this.allowedTypes = '.pdf';
        break;
      case FileType.Word:
        this.allowedTypes = '.doc,.docx,.rtf';
        break;
      case FileType.Specific:
        this.allowedTypes = this.extensions.join(',');
        break;
      default:
        this.allowedTypes = '';
        break;
    }
  }

  async processFiles() {
    this.uploadPercent = 0;
    this.uploading = true;
    this.onStart.emit();
    const data = { ...this.backendParams, file: this.model };
    const op = await this.httpService.formUpload<any>(
      this.backend,
      data,
      percent => {
        this.uploadPercent = percent;
        this.onProgress.emit(percent);
      },
    );
    this.uploadPercent = 0;
    this.uploading = false;
    if (op.status !== OperationResultStatus.Success) {
      // TODO: handle failed upload attempts
      this.onError.emit();
      return;
    }
    if (this.clearAfterUpload !== false) {
      this.clear();
    }
    this.onFinished.emit();
  }

  clear() {
    this.selectedFiles.length = 0;
    if (this.multiple) {
      this.model = [];
      this.modelChange.emit(this.model);
    } else {
      this.model = null;
      this.modelChange.emit(this.model);
      this.removeCurrent();
    }
    this.filePicker.nativeElement.value = null;
  }

  triggerFileDialog() {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    this.filePicker.nativeElement.dispatchEvent(event);
  }

  async onChange(files: FileList) {
    if (files && files.length) {
      this.current = '';
    }
    this.selectedFiles = [];
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files.item(i));
    }
    if (this.multiple) {
      this.model = [...this.selectedFiles];
    } else {
      this.model = this.selectedFiles[0];
    }
    this.modelChange.emit(this.model);
    if (this.selectedFiles.length) {
      this.current = this.selectedFiles[0].name;
      if (this.backend && this.uploadOnPick) {
        await this.processFiles();
      }
    }
  }

  remove(item: File) {
    let index = this.selectedFiles.indexOf(item);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
    }
    if (this.multiple) {
      const model = this.model as File[];
      index = model.indexOf(item);
      if (index !== -1) {
        model.splice(index, 1);
      }
    } else {
      this.model = null;
      this.removeCurrent();
    }
    this.filePicker.nativeElement.value = '';
  }

  removeCurrent() {
    this.current = '';
    this.currentChange.emit('');
  }
}
