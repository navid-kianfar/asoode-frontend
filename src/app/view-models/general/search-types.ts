import { MemberInfoViewModel } from '../auth/identity-types';
import { GroupViewModel } from '../groups/group-types';
import { ProjectViewModel } from '../projects/project-types';
import {
  ExplorerFileViewModel,
  ExplorerFolderViewModel,
} from '../storage/files-types';

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
export interface SearchTaskViewModel {}
