import { Pipe, PipeTransform } from '@angular/core';
import { GroupService } from '../services/group.service';

@Pipe({
  name: 'groupName',
})
export class GroupNamePipe implements PipeTransform {
  constructor(private readonly groupService: GroupService) {}

  transform(groupId): string {
    return this.groupService.groups.find(g => g.id === groupId).title;
  }
}
