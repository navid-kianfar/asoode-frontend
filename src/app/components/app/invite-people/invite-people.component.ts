import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InviteViewModel } from '../../../view-models/auth/identity-types';
import { AccessType } from '../../../library/app/enums';
import { ProjectService } from '../../../services/projects/project.service';

@Component({
  selector: 'app-invite-people',
  templateUrl: './invite-people.component.html',
  styleUrls: ['./invite-people.component.scss'],
})
export class InvitePeopleComponent implements OnInit {
  @Input() exclude: string[];
  @Input() projectId: string;
  @Input() noGroup: boolean;
  @Input() groups: InviteViewModel[];
  @Input() members: InviteViewModel[];
  @Input() newMembers: InviteViewModel[];
  @Output() groupsChange = new EventEmitter<InviteViewModel[]>();
  @Output() membersChange = new EventEmitter<InviteViewModel[]>();
  @Output() newMembersChange = new EventEmitter<InviteViewModel[]>();
  constructor(private readonly projectService: ProjectService) {}

  ngOnInit() {
    this.groups = this.groups || [];
    this.members = this.members || [];
    this.newMembers = this.newMembers || [];
    if (this.projectId) {
      const project = this.projectService.projects.find(
        (p) => p.id === this.projectId,
      );
      this.members = project.members
        .filter((f) => !f.isGroup && this.exclude.indexOf(f.recordId) === -1)
        .map((m) => {
          return {
            access: m.access,
            id: m.recordId,
            model: m.member,
            selected: false,
          };
        });
      setTimeout(() => {
        this.membersChange.emit(this.members);
      }, 200);
    }
  }
  updateGroups(groups: InviteViewModel[]) {
    this.groupsChange.emit(groups);
  }
  updateMembers(members: InviteViewModel[]) {
    this.membersChange.emit(members);
  }
  updateNewMembers(members: InviteViewModel[]) {
    this.newMembers = members;
    this.newMembersChange.emit(members);
  }
}
