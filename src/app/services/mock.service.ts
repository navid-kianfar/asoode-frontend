import { Injectable } from '@angular/core';
import {
  ProjectObjectiveViewModel,
  ProjectTemplateViewModel,
  ProjectViewModel,
} from '../view-models/projects/project-types';
import {
  GroupViewModel,
} from '../view-models/groups/group-types';
import {
  ExplorerViewModel,
  UploadViewModel,
} from '../view-models/storage/files-types';
import {
  ChannelViewModel,
  ConversationViewModel,
} from '../view-models/communication/messenger-types';
import { TransactionViewModel } from '../view-models/payment/payment-types';
import { SearchResultViewModel } from '../view-models/general/search-types';
@Injectable({
  providedIn: 'root',
})
export class MockService {
  searchResult: SearchResultViewModel = {
    members: [],
    storage: {
      files: [],
      folders: [],
    },
    groups: [],
    projects: [],
    tasks: [],
  };
  objectives: ProjectObjectiveViewModel[] = [];
  transactions: TransactionViewModel[] = [];
  messages: ConversationViewModel[];
  channels: ChannelViewModel[] = [];
  templates: ProjectTemplateViewModel[] = [];
  projects: ProjectViewModel[] = [];
  groups: GroupViewModel[] = [];
  files: ExplorerViewModel = { files: [], folders: [] };
  uploading: UploadViewModel[] = [];
}
