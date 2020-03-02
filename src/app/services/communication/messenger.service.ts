import {Injectable} from '@angular/core';
import {HttpService} from '../core/http.service';
import {OperationResult} from '../../library/core/operation-result';
import {ChannelViewModel} from '../../view-models/communication/messenger-types';
import {OperationResultStatus} from '../../library/core/enums';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {

  channels: ChannelViewModel[] = [];

  constructor(private readonly httpService: HttpService) { }

  async load(): Promise<OperationResult<ChannelViewModel[]>> {
    const op = await this.httpService.post<ChannelViewModel[]>('/messenger/channels');
    if (op.status === OperationResultStatus.Success) {
      this.channels = op.data;
    }
    return op;
  }
}
