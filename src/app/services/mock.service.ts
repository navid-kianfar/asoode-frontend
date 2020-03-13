import { Injectable } from '@angular/core';
import {
  ProjectMemberViewModel,
  ProjectViewModel,
} from '../view-models/projects/project-types';
import {
  GroupMemberViewModel,
  GroupViewModel,
} from '../view-models/groups/group-types';
import {
  AccessType,
  ChannelType,
  ConversationType,
  GroupType, TaskStatus,
} from '../library/app/enums';
import {
  ExplorerViewModel,
  UploadViewModel,
} from '../view-models/storage/files-types';
import {
  ChannelViewModel,
  ConversationViewModel,
} from '../view-models/communication/messenger-types';
import { TransactionViewModel } from '../view-models/payment/payment-types';
import { MemberInfoViewModel } from '../view-models/auth/identity-types';
import { SearchResultViewModel } from '../view-models/general/search-types';

const members: MemberInfoViewModel[] = [
  {
    id: '1',
    username: 'nvd.kianfar',
    initials: 'NK',
    fullName: 'Navid Kianfar',
    email: 'nvd@kianfar.me',
    bio: 'Software Engineer',
    avatar: '',
    firstName: 'Navid',
    lastName: 'Kianfar',
  },
  {
    id: '2',
    username: 'saba.kianfar',
    initials: 'SK',
    fullName: 'Saba Kianfar',
    email: 'saba@kianfar.me',
    bio: 'Designer',
    avatar: '',
    firstName: 'Saba',
    lastName: 'Kianfar',
  },
];
const groupMembers = members.map(m => {
  const mapped = ({ ...m } as any) as GroupMemberViewModel;
  mapped.access = AccessType.Editor;
  return mapped;
});
const projectMembers = members.map(m => {
  const mapped = ({ ...m } as any) as ProjectMemberViewModel;
  mapped.access = AccessType.Editor;
  return mapped;
});

@Injectable({
  providedIn: 'root',
})
export class MockService {
  searchResult: SearchResultViewModel;
  transactions: TransactionViewModel[] = [];
  messages: ConversationViewModel[];
  channels: ChannelViewModel[] = [];
  projects: ProjectViewModel[] = [];
  groups: GroupViewModel[] = [];
  files: ExplorerViewModel = { files: [], folders: [] };
  uploading: UploadViewModel[] = [];

  constructor() {
    this.init();
  }

  private initSearchResults() {
    this.searchResult = {
      tasks: [
        {
          status: TaskStatus.ToDo,
          title: 'پیاده سازی ظاهر جدید جستجو',
          description: 'طراحی انجام شده توسط خانم سهیلی را هر چه سریع تر پیاده سازی کنید',
          archivedAt: undefined,
          createdAt: new Date(),
          list: 'پنل جدید',
          workPackage: 'رابط کاربری جدید',
          project: 'آسوده نسخه ۲',
          workPackageId: '1',
          projectId: '1',
          labels: [
            {
              title: 'مهم',
              color: '#dc3831',
              dark: false
            },
            {
              title: 'مهم',
              color: '#333333',
              dark: false
            },
            {
              title: 'مهم',
              color: '#50a9dd',
              dark: false
            }
          ],
          members: [...members]
        },
        {
          status: TaskStatus.Done,
          title: 'پیاده سازی ظاهر جدید جستجو',
          description: 'طراحی انجام شده توسط خانم سهیلی را هر چه سریع تر پیاده سازی کنید',
          archivedAt: undefined,
          createdAt: new Date(),
          list: 'پنل جدید',
          workPackage: 'رابط کاربری جدید',
          project: 'آسوده نسخه ۲',
          workPackageId: '1',
          projectId: '1',
          labels: [
            {
              title: 'مهم',
              color: '#dc3831',
              dark: false
            },
            {
              title: 'مهم',
              color: '#333333',
              dark: false
            },
            {
              title: 'مهم',
              color: '#50a9dd',
              dark: false
            }
          ],
          members: [...members]
        },
        {
          status: TaskStatus.Blocked,
          title: 'پیاده سازی ظاهر جدید جستجو',
          description: 'طراحی انجام شده توسط خانم سهیلی را هر چه سریع تر پیاده سازی کنید',
          archivedAt: undefined,
          createdAt: new Date(),
          list: 'پنل جدید',
          workPackage: 'رابط کاربری جدید',
          project: 'آسوده نسخه ۲',
          workPackageId: '1',
          projectId: '1',
          labels: [
            {
              title: 'مهم',
              color: '#dc3831',
              dark: false
            },
            {
              title: 'مهم',
              color: '#333333',
              dark: false
            },
            {
              title: 'مهم',
              color: '#50a9dd',
              dark: false
            }
          ],
          members: [...members]
        }
      ],
      members: [...members],
      projects: [...this.projects],
      storage: {
        files: [...this.files.files],
        folders: [...this.files.folders],
      },
      groups: [...this.groups],
    };
  }
  private initTransactions() {
    this.transactions = [
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
      {
        createdAt: new Date(),
        id: '1',
        amount: 1000,
        dueAt: new Date(2020, 2, 13),
        title: 'پرداخت ماه آبان',
      },
    ];
  }
  private initMessages() {
    this.messages = [
      {
        message:
          'این یک پیام تستی می‌باشد از سمت آسوده بات این یک پیام تستی می‌باشد از سمت آسوده بات ',
        createdAt: new Date(),
        id: '1',
        type: ConversationType.Text,
        channelId: '1',
        title: '',
        userId: '1',
        replyId: '1',
        fromBot: true,
      },
      {
        message:
          'این یک پیام تستی می‌باشد از سمت آسوده بات این یک پیام تستی می‌باشد از سمت آسوده بات ',
        createdAt: new Date(),
        id: '1',
        type: ConversationType.Text,
        channelId: '1',
        title: '',
        userId: '1',
        replyId: '1',
        fromBot: true,
      },
      {
        message:
          'این یک پیام تستی می‌باشد از سمت آسوده بات این یک پیام تستی می‌باشد از سمت آسوده بات ',
        createdAt: new Date(),
        id: '1',
        type: ConversationType.Text,
        channelId: '1',
        title: '',
        userId: '1',
        replyId: '1',
        fromBot: true,
      },
      {
        message:
          'این یک پیام تستی می‌باشد از سمت آسوده بات این یک پیام تستی می‌باشد از سمت آسوده بات ',
        createdAt: new Date(),
        id: '1',
        type: ConversationType.Text,
        channelId: '1',
        title: '',
        userId: '1',
        replyId: '1',
        fromBot: true,
      },
      {
        message:
          'این یک پیام تستی می‌باشد از سمت آسوده بات این یک پیام تستی می‌باشد از سمت آسوده بات ',
        createdAt: new Date(),
        id: '1',
        type: ConversationType.Text,
        channelId: '1',
        title: '',
        userId: '1',
        replyId: '1',
        fromBot: true,
      },
      {
        message:
          'این یک پیام تستی می‌باشد از سمت آسوده بات این یک پیام تستی می‌باشد از سمت آسوده بات ',
        createdAt: new Date(),
        id: '1',
        type: ConversationType.Text,
        channelId: '1',
        title: '',
        userId: '1',
        replyId: '1',
        fromBot: true,
      },
      {
        message:
          'این یک پیام تستی می‌باشد از سمت آسوده بات این یک پیام تستی می‌باشد از سمت آسوده بات ',
        createdAt: new Date(),
        id: '1',
        type: ConversationType.Text,
        channelId: '1',
        title: '',
        userId: '1',
        replyId: '1',
        fromBot: true,
      },
      {
        message:
          'این یک پیام تستی می‌باشد از سمت آسوده بات این یک پیام تستی می‌باشد از سمت آسوده بات ',
        createdAt: new Date(),
        id: '1',
        type: ConversationType.Text,
        channelId: '1',
        title: '',
        userId: '1',
        replyId: '1',
        fromBot: true,
      },
      {
        message:
          'این یک پیام تستی می‌باشد از سمت آسوده بات این یک پیام تستی می‌باشد از سمت آسوده بات ',
        createdAt: new Date(),
        id: '1',
        type: ConversationType.Text,
        channelId: '1',
        title: '',
        userId: '1',
        replyId: '1',
        fromBot: true,
      },
      {
        message:
          'این یک پیام تستی می‌باشد از سمت آسوده بات این یک پیام تستی می‌باشد از سمت آسوده بات ',
        createdAt: new Date(),
        id: '1',
        type: ConversationType.Text,
        channelId: '1',
        title: '',
        userId: '1',
        replyId: '1',
        fromBot: true,
      },
    ];
  }
  private initChannels() {
    this.channels = [
      ...this.projects.map((p, idx) => {
        return {
          type: ChannelType.Project,
          title: p.title,
          recordId: `${idx + 1}`,
          members: [],
          messages: this.messages,
        } as ChannelViewModel;
      }),
      ...this.groups.map((p, idx) => {
        return {
          type: ChannelType.Group,
          title: p.title,
          recordId: `${idx + 1}`,
          members: [],
          messages: this.messages,
        } as ChannelViewModel;
      }),
    ];
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
          url: 'https://i.picsum.photos/id/232/250/100.jpg',
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
          url: 'https://i.picsum.photos/id/233/250/100.jpg',
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
          url: 'https://i.picsum.photos/id/234/250/100.jpg',
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
          url: 'https://i.picsum.photos/id/235/250/100.jpg',
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
          url: 'https://i.picsum.photos/id/236/250/100.jpg',
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
          url: 'https://i.picsum.photos/id/237/250/100.jpg',
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
          url: 'https://i.picsum.photos/id/238/250/100.jpg',
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
          url: 'https://i.picsum.photos/id/239/250/100.jpg',
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
          url: 'https://i.picsum.photos/id/240/250/100.jpg',
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
        complex: true,
        id: '1',
        userId: '1',
        title: 'آسوده 1',
        description: 'کارهای مربوط به آسوده ۱',
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
        members: [...projectMembers],
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
        complex: false,
        premium: false,
        id: '2',
        userId: '1',
        title: 'آسوده 2',
        description: 'کارهای مربوط به آسوده 2',
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
        members: [...projectMembers],
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
        complex: false,
        tasks: 0,
        id: '3',
        userId: '1',
        title: 'آسوده 3',
        description: 'کارهای مربوط به آسوده 3',
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
        members: [...projectMembers],
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
        members: [...groupMembers],
        premium: false,
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
        members: [...groupMembers],
        premium: false,
      },
    ];
  }
  private init() {
    this.initProjects();
    this.initGroups();
    this.initFiles();
    this.initUpload();
    this.initMessages();
    this.initSearchResults();
    this.initChannels();
    this.initTransactions();
  }
}
