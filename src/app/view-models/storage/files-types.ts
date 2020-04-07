import {OperationResult} from '../../library/core/operation-result';

export interface ExplorerViewModel {
  files: ExplorerFileViewModel[];
  folders: ExplorerFolderViewModel[];
}
export interface ExplorerFolderViewModel {
  parent: string;
  path: string;
  name: string;
  createdAt: Date;
  selected: boolean;
}
export interface ExplorerFileViewModel {
  userId?: string;
  url: string;
  thumbnail: string;
  name: string;
  extensionLessName: string;
  extension: string;
  size: number;
  createdAt: Date;
  selected: boolean;
  isImage: boolean;
  isPdf: boolean;
  isSpreadsheet: boolean;
  isDocument: boolean;
  isPresentation: boolean;
  isArchive: boolean;
  isExecutable: boolean;
  isCode: boolean;
  isOther: boolean;
}
export interface UploadViewModel {
  name: string;
  extensionLessName: string;
  extension: string;
  size: number;
  uploading: boolean;
  progress: number;
  file: File;
  success: boolean;
  failed: boolean;
  promise: Promise<OperationResult<boolean>>;
}
