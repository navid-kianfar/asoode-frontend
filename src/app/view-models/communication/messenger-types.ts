import {MemberInfoViewModel} from '../auth/identity-types';
import {ConversationType} from '../../library/app/enums';

export interface ChannelViewModel {
  title: string;
  recordId: string;
  type: ConversationType;

  members: MemberInfoViewModel[];
}
