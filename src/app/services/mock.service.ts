import { Injectable } from '@angular/core';
import {
  ProjectMemberViewModel,
  ProjectObjectiveViewModel,
  ProjectTemplateViewModel,
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
  GroupType,
  TaskStatus,
  WorkPackageCommentPermission,
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
  searchResult: SearchResultViewModel = {
    members: [],
    storage: {
      files: [],
      folders: [],
    },
    groups: [],
    projects: [],
    tasks: [],
  };
  objectives: ProjectObjectiveViewModel[] = [];
  transactions: TransactionViewModel[] = [];
  messages: ConversationViewModel[];
  channels: ChannelViewModel[] = [];
  templates: ProjectTemplateViewModel[] = [];
  projects: ProjectViewModel[] = [];
  groups: GroupViewModel[] = [];
  files: ExplorerViewModel = { files: [], folders: [] };
  uploading: UploadViewModel[] = [];

  constructor() {
    this.init();
  }

  private initObjectives() {
    this.objectives = [
      {
        id: '1',
        createdAt: new Date(),
        title: 'هدف تستی شماره 1',
        description:
          'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
        workPackage: 'لورم ایپسوم',
      },
      {
        id: '2',
        createdAt: new Date(),
        title: 'هدف تستی شماره 2',
        description:
          'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
        workPackage: 'لورم ایپسوم',
      },
      {
        id: '3',
        createdAt: new Date(),
        title: 'هدف تستی شماره 3',
        description:
          'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
        workPackage: 'لورم ایپسوم',
      },
      {
        id: '4',
        createdAt: new Date(),
        title: 'هدف تستی شماره 4',
        description:
          'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
        workPackage: 'لورم ایپسوم',
      },
      {
        id: '1',
        createdAt: new Date(),
        title: 'هدف تستی شماره 1',
        description:
          'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
        workPackage: 'لورم ایپسوم',
      },
      {
        id: '2',
        createdAt: new Date(),
        title: 'هدف تستی شماره 2',
        description:
          'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
        workPackage: 'لورم ایپسوم',
      },
      {
        id: '3',
        createdAt: new Date(),
        title: 'هدف تستی شماره 3',
        description:
          'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
        workPackage: 'لورم ایپسوم',
      },
      {
        id: '4',
        createdAt: new Date(),
        title: 'هدف تستی شماره 4',
        description:
          'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
        workPackage: 'لورم ایپسوم',
      },
    ];
  }
  private initTemplates() {
    this.templates = [
      {
        id: '1',
        title: 'پزشکان',
        description: 'توضیحات مربوط به قالب پزشکان',
        icon: 'icon-user',
        image: '/assets/images/project/complex.png',
        createdAt: new Date(),
        updatedAt: undefined,
        seasons: [],
        subProjects: [],
        workPackages: [],
      },
      {
        id: '2',
        title: 'مدارس',
        description: 'توضیحات مربوط به قالب مدارس',
        icon: 'icon-user',
        image: '/assets/images/project/complex.png',
        createdAt: new Date(),
        updatedAt: undefined,
        seasons: [],
        subProjects: [],
        workPackages: [],
      },
      {
        id: '3',
        title: 'برنامه نویسان',
        description: 'توضیحات مربوط به قالب برنامه نویسان',
        icon: 'icon-user',
        image: '/assets/images/project/complex.png',
        createdAt: new Date(),
        updatedAt: undefined,
        seasons: [],
        subProjects: [],
        workPackages: [],
      },
      {
        id: '4',
        title: 'مشاورین',
        description: 'توضیحات مربوط به قالب مشاورین',
        icon: 'icon-user',
        image: '/assets/images/project/complex.png',
        createdAt: new Date(),
        updatedAt: undefined,
        seasons: [],
        subProjects: [],
        workPackages: [],
      },
      {
        id: '5',
        title: 'هلدینگ',
        description: 'توضیحات مربوط به قالب هلدینگ',
        icon: 'icon-user',
        image: '/assets/images/project/complex.png',
        createdAt: new Date(),
        updatedAt: undefined,
        seasons: [],
        subProjects: [],
        workPackages: [],
      },
    ];
  }
  private initSearchResults() {
    this.searchResult = {
      tasks: [
        {
          status: TaskStatus.ToDo,
          title: 'پیاده سازی ظاهر جدید جستجو',
          description:
            'طراحی انجام شده توسط خانم سهیلی را هر چه سریع تر پیاده سازی کنید',
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
              dark: false,
            },
            {
              title: 'مهم',
              color: '#333333',
              dark: false,
            },
            {
              title: 'مهم',
              color: '#50a9dd',
              dark: false,
            },
          ],
          members: [...members],
        },
        {
          status: TaskStatus.Done,
          title: 'پیاده سازی ظاهر جدید جستجو',
          description:
            'طراحی انجام شده توسط خانم سهیلی را هر چه سریع تر پیاده سازی کنید',
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
              dark: false,
            },
            {
              title: 'مهم',
              color: '#333333',
              dark: false,
            },
            {
              title: 'مهم',
              color: '#50a9dd',
              dark: false,
            },
          ],
          members: [...members],
        },
        {
          status: TaskStatus.Blocked,
          title: 'پیاده سازی ظاهر جدید جستجو',
          description:
            'طراحی انجام شده توسط خانم سهیلی را هر چه سریع تر پیاده سازی کنید',
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
              dark: false,
            },
            {
              title: 'مهم',
              color: '#333333',
              dark: false,
            },
            {
              title: 'مهم',
              color: '#50a9dd',
              dark: false,
            },
          ],
          members: [...members],
        },
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
          members: [...members],
          messages: this.messages,
        } as ChannelViewModel;
      }),
      ...this.groups.map((p, idx) => {
        return {
          type: ChannelType.Group,
          title: p.title,
          recordId: `${idx + 1}`,
          members: [...members],
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
          thumbnail: 'https://i.picsum.photos/id/232/70/70.jpg',
          url: 'https://i.picsum.photos/id/232/250/100.jpg',
          createdAt: new Date(),
          extension: '.pdf',
          extensionLessName: 'Resume',
          name: 'Resume.pdf',
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
          thumbnail: 'https://i.picsum.photos/id/233/70/70.jpg',
          url: 'https://i.picsum.photos/id/233/250/100.jpg',
          createdAt: new Date(),
          extension: '.jpg',
          extensionLessName: 'My Image',
          name: 'My Image.jpg',
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
          thumbnail: 'https://i.picsum.photos/id/234/70/70.jpg',
          url: 'https://i.picsum.photos/id/234/250/100.jpg',
          createdAt: new Date(),
          extension: '.xlsx',
          extensionLessName: 'Payments',
          name: 'Payments.xlsx',
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
          thumbnail: 'https://i.picsum.photos/id/235/70/70.jpg',
          url: 'https://i.picsum.photos/id/235/250/100.jpg',
          createdAt: new Date(),
          extension: '.docx',
          extensionLessName: 'My Presentation',
          name: 'My Presentation.docx',
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
          thumbnail: 'https://i.picsum.photos/id/236/70/70.jpg',
          url: 'https://i.picsum.photos/id/236/250/100.jpg',
          createdAt: new Date(),
          extension: '.pptx',
          extensionLessName: 'My Presentation',
          name: 'My Presentation.pptx',
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
          thumbnail: '',
          url: 'https://i.picsum.photos/id/237/250/100.jpg',
          createdAt: new Date(),
          extension: '.zip',
          extensionLessName: 'Archive',
          name: 'Archive.zip',
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
        description:
          'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
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
          {
            title: 'زیر پروژه 3',
            description: 'توضیحات مربوط به زیر پروژه 3',
            updatedAt: undefined,
            createdAt: new Date(),
            level: 1,
            order: 1,
            parentId: '1',
            id: '3',
            projectId: '1',
            userId: '1',
          },
          {
            title: 'زیر پروژه 4',
            description: 'توضیحات مربوط به زیر پروژه 4',
            updatedAt: undefined,
            createdAt: new Date(),
            level: 1,
            order: 1,
            parentId: '1',
            id: '4',
            projectId: '1',
            userId: '1',
          },
          {
            title: 'زیر پروژه 5',
            description: 'توضیحات مربوط به زیر پروژه 5',
            updatedAt: undefined,
            createdAt: new Date(),
            level: 1,
            order: 1,
            parentId: '3',
            id: '5',
            projectId: '1',
            userId: '1',
          },
          {
            title: 'زیر پروژه 6',
            description: 'توضیحات مربوط به زیر پروژه 6',
            updatedAt: undefined,
            createdAt: new Date(),
            level: 1,
            order: 1,
            parentId: '3',
            id: '6',
            projectId: '1',
            userId: '1',
          },
        ],
        workPackages: [
          {
            id: '1',
            title: 'لورم ایپسوم',
            description:
              'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.',
            subProjectId: '1',
            createdAt: new Date(),
            allowAttachment: true,
            allowBlockingBoardTasks: true,
            allowComments: true,
            allowCustomField: true,
            allowEndAt: true,
            allowEstimatedTime: true,
            allowGeoLocation: true,
            allowLabels: true,
            allowMembers: true,
            allowPoll: true,
            allowSegments: true,
            allowState: true,
            allowTimeSpent: true,
            color: '#dddddd',
            commentPermission: WorkPackageCommentPermission.Members,
            darkColor: false,
            projectId: '1',
            userId: '1',
            members: [],
          },
          {
            id: '2',
            title: 'لورم ایپسوم',
            description:
              'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.',
            subProjectId: '5',
            createdAt: new Date(),
            allowAttachment: true,
            allowBlockingBoardTasks: true,
            allowComments: true,
            allowCustomField: true,
            allowEndAt: true,
            allowEstimatedTime: true,
            allowGeoLocation: true,
            allowLabels: true,
            allowMembers: true,
            allowPoll: true,
            allowSegments: true,
            allowState: true,
            allowTimeSpent: true,
            color: '#dddddd',
            commentPermission: WorkPackageCommentPermission.Members,
            darkColor: false,
            projectId: '1',
            userId: '1',
            members: [],
          },
          {
            id: '3',
            title: 'لورم ایپسوم',
            description:
              'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.',
            subProjectId: '5',
            createdAt: new Date(),
            allowAttachment: true,
            allowBlockingBoardTasks: true,
            allowComments: true,
            allowCustomField: true,
            allowEndAt: true,
            allowEstimatedTime: true,
            allowGeoLocation: true,
            allowLabels: true,
            allowMembers: true,
            allowPoll: true,
            allowSegments: true,
            allowState: true,
            allowTimeSpent: true,
            color: '#dddddd',
            commentPermission: WorkPackageCommentPermission.Members,
            darkColor: false,
            projectId: '1',
            userId: '1',
            members: [],
          },
          {
            id: '4',
            title: 'لورم ایپسوم',
            description:
              'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.',
            subProjectId: undefined,
            createdAt: new Date(),
            allowAttachment: true,
            allowBlockingBoardTasks: true,
            allowComments: true,
            allowCustomField: true,
            allowEndAt: true,
            allowEstimatedTime: true,
            allowGeoLocation: true,
            allowLabels: true,
            allowMembers: true,
            allowPoll: true,
            allowSegments: true,
            allowState: true,
            allowTimeSpent: true,
            color: '#dddddd',
            commentPermission: WorkPackageCommentPermission.Members,
            darkColor: false,
            projectId: '1',
            userId: '1',
            members: [],
          },
        ],
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
        members: [
          ...projectMembers,
          ...projectMembers,
          ...projectMembers,
          ...projectMembers,
        ],
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
        workPackages: [
          {
            id: '1',
            title: 'لورم ایپسوم',
            description:
              'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.',
            subProjectId: '1',
            createdAt: new Date(),
            allowAttachment: true,
            allowBlockingBoardTasks: true,
            allowComments: true,
            allowCustomField: true,
            allowEndAt: true,
            allowEstimatedTime: true,
            allowGeoLocation: true,
            allowLabels: true,
            allowMembers: true,
            allowPoll: true,
            allowSegments: true,
            allowState: true,
            allowTimeSpent: true,
            color: '#dddddd',
            commentPermission: WorkPackageCommentPermission.Members,
            darkColor: false,
            projectId: '1',
            userId: '1',
            members: [],
          },
        ],
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
        subProjects: [],
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
    this.initTemplates();
    this.initObjectives();
  }
}
