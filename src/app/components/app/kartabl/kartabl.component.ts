import { Component, Input, OnInit } from '@angular/core';
import {
  KartablViewModel,
  ProjectViewModel,
  WorkPackageListViewModel,
  WorkPackageViewModel,
} from '../../../view-models/projects/project-types';
import { ListViewModel } from '../../../view-models/core/list-types';
import { ProjectService } from '../../../services/projects/project.service';

@Component({
  selector: 'app-kartabl',
  templateUrl: './kartabl.component.html',
  styleUrls: ['./kartabl.component.scss'],
})
export class KartablComponent implements OnInit {
  @Input() beginDate: Date;
  @Input() endDate: Date;
  @Input() model: KartablViewModel;
  pkg: WorkPackageViewModel;
  project: ProjectViewModel;
  projects: ListViewModel[];
  constructor(private readonly projectService: ProjectService) {}

  ngOnInit() {
    const ddItems: ListViewModel[] = [];
    this.model.tasks.forEach(t => {
      const project = this.projectService.projects.find(
        p => p.id === t.projectId,
      );
      const found = project.workPackages.find(w => w.id === t.packageId);
      const pkg = { ...found, list: [] };
      ddItems.push({
        text: pkg.title,
        value: pkg.id,
        payload: { pkg, project },
      });
    });
    this.projects = ddItems;
    if (ddItems.length) {
      this.switchProject(ddItems[0].value);
    }
  }

  switchProject(selected: any) {
    const duplicates = {} as any;
    const payload = this.projects.find(p => p.value === selected).payload;
    const filteredTasks = this.model.tasks.filter(
      t => t.packageId === selected,
    );
    this.project = payload.project;
    this.pkg = { ...payload.pkg, lists: [] };
    this.pkg.lists = filteredTasks
      .filter(f => {
        if (duplicates[f.listId]) {
          return false;
        }
        duplicates[f.listId] = true;
        return true;
      })
      .map(t => {
        return {
          id: t.listId,
          tasks: [],
          title: t.listName,
          packageId: t.packageId,
        } as WorkPackageListViewModel;
      });
    this.pkg.lists.forEach(l => {
      l.tasks = filteredTasks.filter(t => t.listId === l.id);
    });
  }
}
