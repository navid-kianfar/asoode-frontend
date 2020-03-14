import { MemberInfoViewModel } from '../auth/identity-types';
import { GroupViewModel } from '../groups/group-types';
import { ProjectViewModel } from '../projects/project-types';
import {
  ExplorerFileViewModel,
  ExplorerFolderViewModel,
} from '../storage/files-types';
import {TaskLabelViewModel} from '../projects/task-types';
import {TaskStatus} from '../../library/app/enums';

export interface SearchResultViewModel {
  tasks: SearchTaskViewModel[];
  projects: ProjectViewModel[];
  groups: GroupViewModel[];
  storage: SearchStorageViewModel;
  members: MemberInfoViewModel[];
}
export interface SearchStorageViewModel {
  files: ExplorerFileViewModel[];
  folders: ExplorerFolderViewModel[];
}
export interface SearchTaskViewModel {
  status: TaskStatus;
  title: string;
  description: string;
  archivedAt: Date;
  createdAt: Date;
  list: string;
  workPackage: string;
  project: string;
  workPackageId: string;
  projectId: string;
  labels: TaskLabelViewModel[];
  members: MemberInfoViewModel[];
}