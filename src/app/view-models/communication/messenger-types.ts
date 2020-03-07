import {MemberInfoViewModel} from '../auth/identity-types';
import {ConversationType} from '../../library/app/enums';

export interface ChannelViewModel {
  title: string;
  type: ConversationType;

  members: MemberInfoViewModel[];
}
