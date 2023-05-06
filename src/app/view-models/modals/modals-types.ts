import { OperationResult } from '../../shared/lib/operation-result';
import { InviteModalComponent } from '../../shared/modals/invite-modal/invite-modal.component';

export interface CreateModalParameters {
  parentId?: string;
  premium?: boolean;
  simpleProject?: boolean;
  simpleGroup?: boolean;
  complexProject?: boolean;
  complexGroup?: boolean;
}

export interface InviteModalParameters {
  noGroup: boolean;
  existing: any[];
  exclude: string[];
  projectId: string;
  handler: (members) => Promise<OperationResult<boolean>>;
}
