import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {ProjectViewModel} from '../view-models/projects/project-types';
import {GroupViewModel} from '../view-models/groups/group-types';
import {GroupType} from '../library/app/enums';

const members: any[] = [];


@Injectable({
  providedIn: 'root'
})
export class MockService {
  projects: ProjectViewModel[] = [];
  groups: GroupViewModel[] = [];


  constructor() {
    if (environment.production) { return; }
    this.init();
  }

  private initProjects() {
    this.projects = [
      {
        id: '1',
        userId: '1',
        title: 'آسوده ۱',
        description: 'طراحی فاز ۱',
        createdAt: new Date(),
        updatedAt: undefined,
        seasons: [
          {
            title: 'فصل ۱',
            description: 'کارهای مربوط به فصل ۱',
            createdAt: new Date(),
            updatedAt: undefined,
            id: '1',
            projectId: '1',
            userId: '1'
          },
          {
            title: 'فصل 2',
            description: 'کارهای مربوط به فصل 2',
            createdAt: new Date(),
            updatedAt: undefined,
            id: '2',
            projectId: '1',
            userId: '1'
          }
        ],
        members: [...members],
        subProjects: [
          {
            title: 'زیر پروژه ۱',
            description: 'توضیحات مربوط به زیر پروژه ۱',
            updatedAt: undefined,
            createdAt: new Date(),
            level: 1,
            order: 1,
            parentId: undefined,
            id: '1',
            projectId: '1',
            userId: '1'
          },
          {
            title: 'زیر پروژه 2',
            description: 'توضیحات مربوط به زیر پروژه 2',
            updatedAt: undefined,
            createdAt: new Date(),
            level: 1,
            order: 1,
            parentId: undefined,
            id: '2',
            projectId: '1',
            userId: '1'
          }
        ],
        workPackages: []
      },
      {
        id: '1',
        userId: '1',
        title: 'آسوده ۱',
        description: 'طراحی فاز ۱',
        createdAt: new Date(),
        updatedAt: undefined,
        seasons: [
          {
            title: 'فصل ۱',
            description: 'کارهای مربوط به فصل ۱',
            createdAt: new Date(),
            updatedAt: undefined,
            id: '1',
            projectId: '1',
            userId: '1'
          },
          {
            title: 'فصل 2',
            description: 'کارهای مربوط به فصل 2',
            createdAt: new Date(),
            updatedAt: undefined,
            id: '2',
            projectId: '1',
            userId: '1'
          }
        ],
        members: [...members],
        subProjects: [
          {
            title: 'زیر پروژه ۱',
            description: 'توضیحات مربوط به زیر پروژه ۱',
            updatedAt: undefined,
            createdAt: new Date(),
            level: 1,
            order: 1,
            parentId: undefined,
            id: '1',
            projectId: '1',
            userId: '1'
          },
          {
            title: 'زیر پروژه 2',
            description: 'توضیحات مربوط به زیر پروژه 2',
            updatedAt: undefined,
            createdAt: new Date(),
            level: 1,
            order: 1,
            parentId: undefined,
            id: '2',
            projectId: '1',
            userId: '1'
          }
        ],
        workPackages: []
      },
      {
        id: '1',
        userId: '1',
        title: 'آسوده ۱',
        description: 'طراحی فاز ۱',
        createdAt: new Date(),
        updatedAt: undefined,
        seasons: [
          {
            title: 'فصل ۱',
            description: 'کارهای مربوط به فصل ۱',
            createdAt: new Date(),
            updatedAt: undefined,
            id: '1',
            projectId: '1',
            userId: '1'
          },
          {
            title: 'فصل 2',
            description: 'کارهای مربوط به فصل 2',
            createdAt: new Date(),
            updatedAt: undefined,
            id: '2',
            projectId: '1',
            userId: '1'
          }
        ],
        members: [...members],
        subProjects: [
          {
            title: 'زیر پروژه ۱',
            description: 'توضیحات مربوط به زیر پروژه ۱',
            updatedAt: undefined,
            createdAt: new Date(),
            level: 1,
            order: 1,
            parentId: undefined,
            id: '1',
            projectId: '1',
            userId: '1'
          },
          {
            title: 'زیر پروژه 2',
            description: 'توضیحات مربوط به زیر پروژه 2',
            updatedAt: undefined,
            createdAt: new Date(),
            level: 1,
            order: 1,
            parentId: undefined,
            id: '2',
            projectId: '1',
            userId: '1'
          }
        ],
        workPackages: []
      }
    ];
  }
  private initGroups() {
    this.groups = [
      {
        title: 'گروه فنی',
        description: 'توضیحات گروه فنی',
        createdAt: new Date(),
        updatedAt: undefined,
        id: '1',
        avatarId: '',
        userId: '1',
        type: GroupType.Holding,
        members: [...members]
      },
      {
        title: 'گروه فنی 2',
        description: 'توضیحات گروه فنی 2',
        createdAt: new Date(),
        updatedAt: undefined,
        id: '2',
        avatarId: '',
        userId: '1',
        type: GroupType.Company,
        members: [...members]
      }
    ];
  }
  private init() {
    this.initProjects();
    this.initGroups();
  }
}
