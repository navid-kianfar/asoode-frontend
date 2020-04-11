import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MemberInfoViewModel } from '../../../view-models/auth/identity-types';
import {IdentityService} from '../../../services/auth/identity.service';
import {ProjectService} from '../../../services/projects/project.service';
import {GroupService} from '../../../services/groups/group.service';

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss'],
})
export class MemberInfoComponent implements OnInit {
  @Input() model: MemberInfoViewModel;
  @Input() id: string;
  @Input() email: string;
  @Input() me: boolean;
  @Input() selected: boolean;
  @Input() small: boolean;
  @Input() cssClass: string;
  @Output() modelChange = new EventEmitter<MemberInfoViewModel>();
  constructor(
    private readonly identityService: IdentityService,
    private readonly projectService: ProjectService,
    private readonly groupService: GroupService,
  ) {}

  update() {
    setTimeout(() => {
      this.modelChange.emit(this.model);
    }, 100);
  }

  ngOnInit() {
    if (this.me) {
      this.model = this.identityService.profile;
      this.update();
    }
    if (this.email) {
      this.model = {
        email: this.email,
        id: this.email,
        username: this.email,
        fullName: '',
        lastName: '',
        firstName: '',
        initials: '',
        avatar: '',
        bio: ''
      };
      this.update();
    }
    if (this.id && !this.model) {
      let found;
      for (const project of this.projectService.projects) {
        for (const member of project.members) {
          if (this.id === member.recordId) {
            found = member.member;
            break;
          }
        }
        if (found) { break; }
      }
      if (!found) {
        for (const group of this.groupService.groups) {
          for (const member of group.members) {
            if (this.id === member.id) {
              found = member.member;
              break;
            }
          }
          if (found) { break; }
        }
      }
      this.model = found;
      this.update();
    }
    this.cssClass = `${this.cssClass} member-info`;
  }
}
