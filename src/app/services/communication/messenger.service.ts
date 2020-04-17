import { Injectable } from '@angular/core';
import { HttpService } from '../core/http.service';
import { OperationResult } from '../../library/core/operation-result';
import {
  ChannelRepository,
  ChannelViewModel,
  ConversationViewModel,
} from '../../view-models/communication/messenger-types';
import { OperationResultStatus } from '../../library/core/enums';

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  channels: ChannelRepository;

  constructor(private readonly httpService: HttpService) {
    this.channels = {
      directs: [],
    };
  }

  async load(): Promise<OperationResult<ChannelRepository>> {
    const op = await this.httpService.post<ChannelRepository>(
      '/messenger/channels',
    );
    if (op.status === OperationResultStatus.Success) {
      this.channels = op.data;
    }
    return op;
  }

  async fetch(
    recordId: string,
  ): Promise<OperationResult<ConversationViewModel[]>> {
    return await this.httpService.post<ConversationViewModel[]>(
      `/messenger/channel/${recordId}/fetch`,
    );
  }

  async send(recordId: string, model): Promise<OperationResult<boolean>> {
    return await this.httpService.post<boolean>(
      `/messenger/channel/${recordId}/send`,
      model,
    );
  }
}
