import { MemberInfoViewModel } from '../auth/identity-types';
import { ConversationType } from '../../shared/lib/enums/enums';
import { BaseViewModel } from '../core/general-types';
import { ChannelType } from '../../shared/lib/enums/channels';

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
