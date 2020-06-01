import { MemberInfoViewModel } from '../auth/identity-types';
import { ChannelType, ConversationType } from '../../library/app/enums';
import { BaseViewModel } from '../core/general-types';
import { GroupMemberViewModel } from '../groups/group-types';
import { ProjectMemberViewModel } from '../projects/project-types';
import {UploadViewModel} from '../storage/files-types';

export interface ChannelRepository {
  directs: ChannelViewModel[];
}
export interface ChannelViewModel {
  title: string;
  id: string;
  type: ChannelType;
  userId?: string;
  rootId?: string;

  members: MemberInfoViewModel[];
  messages: ConversationViewModel[];
}
export interface MappedConversationViewModel {
  date: string;
  messages: ConversationViewModel[];
}
export interface ConversationViewModel extends BaseViewModel {
  upload?: any;
  uploadId?: string;
  channelId: string;
  message: string;
  path?: string;
  replyId?: string;
  type: ConversationType;
  userId: string;
  fromBot: boolean;
  member?: MemberInfoViewModel;
}
