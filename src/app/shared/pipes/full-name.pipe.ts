import { Pipe, PipeTransform } from '@angular/core';
import { UsersService } from '../../project/services/users.service';

@Pipe({
  name: 'fullName',
})
export class FullNamePipe implements PipeTransform {
  constructor(readonly usersService: UsersService) {}

  async transform(userId: string): Promise<string> {
    return ((await this.usersService.findUser(userId)) || { fullName: '' })
      .fullName;
  }
}
