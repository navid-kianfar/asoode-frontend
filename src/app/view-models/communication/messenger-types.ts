import { MemberInfoViewModel } from '../auth/identity-types';
import {ChannelType, ConversationType} from '../../library/app/enums';
import {BaseViewModel} from '../core/general-types';

export interface ChannelViewModel {
  title: string;
  recordId: string;
  type: ChannelType;

  members: MemberInfoViewModel[];
  messages: ConversationViewModel[];
}
export interface MappedConversationViewModel {
  date: string;
  messages: ConversationViewModel[];
}
export interface ConversationViewModel extends BaseViewModel {
  channelId: string;
  message: string;
  path?: string;
  replyId?: string;
  title?: string;
  type: ConversationType;
  userId: string;
  fromBot: boolean;
  member?: MemberInfoViewModel;
}
