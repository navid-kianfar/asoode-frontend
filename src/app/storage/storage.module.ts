import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FilesComponent } from './pages/files/files.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FilesExplorerComponent } from './components/files-explorer/files-explorer.component';
import { FileFolderPreviewComponent } from './components/files-folder-preview/file-folder-preview.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    FilesComponent,
    FilesExplorerComponent,
    FileFolderPreviewComponent
  ],
  imports: [
    CommonModule,
    StorageRoutingModule,
    SharedModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule
  ],
  exports: [
    FilesComponent,
    FilesExplorerComponent,
    FileFolderPreviewComponent
  ]
})
export class StorageModule { }
