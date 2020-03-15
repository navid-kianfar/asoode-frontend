import { Pipe, PipeTransform } from '@angular/core';
import { UsersRepositoryService } from '../../services/general/users-repository.service';
import { IdentityService } from '../../services/auth/identity.service';

@Pipe({
  name: 'username',
})
export class UsernamePipe implements PipeTransform {
  constructor(
    private readonly usersRepository: UsersRepositoryService,
    private readonly identityService: IdentityService,
  ) {}

  transform(userId?: string): string {
    if (!userId || userId === this.identityService.identity.userId) {
      return this.identityService.profile.fullName;
    }
    if (this.usersRepository.users[userId]) {
      return this.usersRepository.users[userId].fullName;
    }
    return 'UNKNOWN';
  }
}
