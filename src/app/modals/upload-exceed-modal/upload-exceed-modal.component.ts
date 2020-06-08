import { Component, OnInit } from '@angular/core';
import {UploadViewModel} from '../../view-models/storage/files-types';
import {SimpleModalComponent} from 'ngx-simple-modal';
import {FilesService} from '../../services/storage/files.service';
import { NumberHelpers } from 'src/app/helpers/number.helpers';

@Component({
  selector: 'app-upload-exceed-modal',
  templateUrl: './upload-exceed-modal.component.html',
  styleUrls: ['./upload-exceed-modal.component.scss']
})
export class UploadExceedModalComponent
  extends SimpleModalComponent<{
  uploads: UploadViewModel[],
  attachmentSize: number;
  }, void>
  implements OnInit {
  uploads: UploadViewModel[];
  attachmentSize: number;
  ViewMode = ViewMode;
  NumberHelpers = NumberHelpers;
  mode: ViewMode = ViewMode.Init;
  constructor(readonly filesService: FilesService) { super(); }

  ngOnInit() {
  }

}
export enum ViewMode {
  Init = 1,
  Upgrade = 2
}
