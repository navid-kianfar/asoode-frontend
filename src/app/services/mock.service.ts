import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProjectViewModel } from '../view-models/projects/project-types';
import { GroupViewModel } from '../view-models/groups/group-types';
import { GroupType } from '../library/app/enums';
import {
  ExplorerViewModel,
  UploadViewModel,
} from '../view-models/storage/files-types';

const members: any[] = [];

@Injectable({
  providedIn: 'root',
})
export class MockService {
  projects: ProjectViewModel[] = [];
  groups: GroupViewModel[] = [];
  files: ExplorerViewModel = { files: [], folders: [] };
  uploading: UploadViewModel[] = [];

  constructor() {
    if (environment.production) {
      return;
    }
    this.init();
  }

  private initUpload() {
    this.uploading = [
      {
        extension: '.png',
        extensionLessName: 'Profile',
        name: 'Profile.png',
        progress: 100,
        size: 10000,
        uploading: false,
        file: undefined,
        success: true,
        failed: false,
      },
      {
        extension: '.png',
        extensionLessName: 'Profile',
        name: 'Profile.png',
        progress: 100,
        size: 10000,
        uploading: false,
        file: undefined,
        success: false,
        failed: true,
      },
      {
        extension: '.png',
        extensionLessName: 'Profile',
        name: 'Profile.png',
        progress: 10,
        size: 10000,
        uploading: true,
        file: undefined,
        success: false,
        failed: false,
      },
      {
        extension: '.png',
        extensionLessName: 'Profile',
        name: 'Profile.png',
        progress: 85,
        size: 10000,
        uploading: true,
        file: undefined,
        success: false,
        failed: false,
      },
    ];
  }
  private initFiles() {
    this.files = {
      files: [
        {
          url:
            'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          createdAt: new Date(),
          extension: '.pdf',
          extensionLessName: 'My Presentation',
          name: 'My Presentation.pdf',
          size: 123456,
          isImage: false,
          isPdf: true,
          isSpreadsheet: false,
          isDocument: false,
          isPresentation: false,
          isArchive: false,
          isExecutable: false,
          isCode: false,
          isOther: false,
          selected: false,
        },
        {
          url:
            'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          createdAt: new Date(),
          extension: '.pdf',
          extensionLessName: 'My Presentation',
          name: 'My Presentation.pdf',
          size: 123456,
          isImage: true,
          isPdf: false,
          isSpreadsheet: false,
          isDocument: false,
          isPresentation: false,
          isArchive: false,
          isExecutable: false,
          isCode: false,
          isOther: false,
          selected: false,
        },
        {
          url:
            'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          createdAt: new Date(),
          extension: '.pdf',
          extensionLessName: 'My Presentation',
          name: 'My Presentation.pdf',
          size: 123456,
          isImage: false,
          isPdf: false,
          isSpreadsheet: true,
          isDocument: false,
          isPresentation: false,
          isArchive: false,
          isExecutable: false,
          isCode: false,
          isOther: false,
          selected: false,
        },
        {
          url:
            'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          createdAt: new Date(),
          extension: '.pdf',
          extensionLessName: 'My Presentation',
          name: 'My Presentation.pdf',
          size: 123456,
          isImage: false,
          isPdf: false,
          isSpreadsheet: false,
          isDocument: true,
          isPresentation: false,
          isArchive: false,
          isExecutable: false,
          isCode: false,
          isOther: false,
          selected: false,
        },
        {
          url:
            'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          createdAt: new Date(),
          extension: '.pdf',
          extensionLessName: 'My Presentation',
          name: 'My Presentation.pdf',
          size: 123456,
          isImage: false,
          isPdf: false,
          isSpreadsheet: false,
          isDocument: false,
          isPresentation: true,
          isArchive: false,
          isExecutable: false,
          isCode: false,
          isOther: false,
          selected: false,
        },
        {
          url:
            'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          createdAt: new Date(),
          extension: '.pdf',
          extensionLessName: 'My Presentation',
          name: 'My Presentation.pdf',
          size: 123456,
          isImage: false,
          isPdf: false,
          isSpreadsheet: false,
          isDocument: false,
          isPresentation: false,
          isArchive: true,
          isExecutable: false,
          isCode: false,
          isOther: false,
          selected: false,
        },
        {
          url:
            'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          createdAt: new Date(),
          extension: '.pdf',
          extensionLessName: 'My Presentation',
          name: 'My Presentation.pdf',
          size: 123456,
          isImage: false,
          isPdf: false,
          isSpreadsheet: false,
          isDocument: false,
          isPresentation: false,
          isArchive: false,
          isExecutable: true,
          isCode: false,
          isOther: false,
          selected: false,
        },
        {
          url:
            'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          createdAt: new Date(),
          extension: '.pdf',
          extensionLessName: 'My Presentation',
          name: 'My Presentation.pdf',
          size: 123456,
          isImage: false,
          isPdf: false,
          isSpreadsheet: false,
          isDocument: false,
          isPresentation: false,
          isArchive: false,
          isExecutable: false,
          isCode: true,
          isOther: false,
          selected: false,
        },
        {
          url:
            'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
          createdAt: new Date(),
          extension: '.pdf',
          extensionLessName: 'My Presentation',
          name: 'My Presentation.pdf',
          size: 123456,
          isImage: false,
          isPdf: false,
          isSpreadsheet: false,
          isDocument: false,
          isPresentation: false,
          isArchive: false,
          isExecutable: false,
          isCode: false,
          isOther: true,
          selected: false,
        },
      ],
      folders: [
        {
          name: 'دسترسی سریع',
          createdAt: new Date(),
          selected: false,
          path: '/',
        },
        {
          name: 'دسترسی سریع',
          createdAt: new Date(),
          selected: false,
          path: '/',
        },
        {
          name: 'دسترسی سریع',
          createdAt: new Date(),
          selected: false,
          path: '/',
        },
        {
          name: 'دسترسی سریع',
          createdAt: new Date(),
          selected: false,
          path: '/',
        },
      ],
    };
  }
  private initProjects() {
    this.projects = [
      {
        tasks: 0,
        premium: true,
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
            userId: '1',
          },
          {
            title: 'فصل 2',
            description: 'کارهای مربوط به فصل 2',
            createdAt: new Date(),
            updatedAt: undefined,
            id: '2',
            projectId: '1',
            userId: '1',
          },
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
            userId: '1',
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
            userId: '1',
          },
        ],
        workPackages: [],
      },
      {
        tasks: 0,
        premium: false,
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
            userId: '1',
          },
          {
            title: 'فصل 2',
            description: 'کارهای مربوط به فصل 2',
            createdAt: new Date(),
            updatedAt: undefined,
            id: '2',
            projectId: '1',
            userId: '1',
          },
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
            userId: '1',
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
            userId: '1',
          },
        ],
        workPackages: [],
      },
      {
        premium: false,
        tasks: 0,
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
            userId: '1',
          },
          {
            title: 'فصل 2',
            description: 'کارهای مربوط به فصل 2',
            createdAt: new Date(),
            updatedAt: undefined,
            id: '2',
            projectId: '1',
            userId: '1',
          },
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
            userId: '1',
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
            userId: '1',
          },
        ],
        workPackages: [],
      },
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
        members: [...members],
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
        members: [...members],
      },
    ];
  }
  private init() {
    this.initProjects();
    this.initGroups();
    this.initFiles();
    this.initUpload();
  }
}