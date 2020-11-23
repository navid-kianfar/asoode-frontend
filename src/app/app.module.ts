import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxPopperModule } from 'ngx-popper';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { defaultSimpleModalOptions, SimpleModalModule } from 'ngx-simple-modal';
import { BarChartModule } from '@swimlane/ngx-charts';
import {
  DateAdapter,
  MAT_DATE_FORMATS, MAT_DATE_LOCALE,
  MatAutocompleteModule,
  MatCheckboxModule, MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatProgressBarModule,
  MatRadioModule,
  MatRippleModule,
  MatSliderModule,
} from '@angular/material';
import { MomentModule } from 'ngx-moment';
import { QuillModule } from 'ngx-quill';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

import { AppRoutingModule } from './app-routing.module';
import { HttpInterceptor } from './services/general/http.interceptor';
import { PanelSocketProvider } from './services/general/socket.provider';
import {
  AppInitializerFactory,
  AppInitializerProvider,
} from './services/general/app.initializer';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/reports/dashboard/dashboard.component';
import { CaptchaComponent } from './components/core/captcha/captcha.component';
import { WaitingComponent } from './components/core/waiting/waiting.component';
import { InputComponent } from './components/core/input/input.component';
import { SwitchComponent } from './components/core/switch/switch.component';
import { TagComponent } from './components/core/tag/tag.component';
import { RadioComponent } from './components/core/radio/radio.component';
import { DropdownComponent } from './components/core/dropdown/dropdown.component';
import { FormComponent } from './components/core/form/form.component';
import { FileComponent } from './components/core/file/file.component';
import { EditorComponent } from './components/core/editor/editor.component';
import { DatePickerComponent } from './components/core/date-picker/date-picker.component';
import { ZonePickerComponent } from './components/core/zone-picker/zone-picker.component';
import { CountryPickerComponent } from './components/core/country-picker/country-picker.component';
import { ColorPickerComponent } from './components/core/color-picker/color-picker.component';
import { CheckboxComponent } from './components/core/checkbox/checkbox.component';
import { ButtonComponent } from './components/core/button/button.component';
import { CalendarComponent } from './components/core/calendar/calendar.component';
import { BoxGridComponent } from './components/core/box-grid/box-grid.component';
import { AutoCompleteComponent } from './components/core/auto-complete/auto-complete.component';
import { DocViewerComponent } from './components/core/doc-viewer/doc-viewer.component';
import { EmojiPickerComponent } from './components/core/emoji-picker/emoji-picker.component';
import { MapComponent } from './components/core/map/map.component';
import { LocationPickerComponent } from './components/core/location-picker/location-picker.component';
import { ScheduleComponent } from './components/core/schedule/schedule.component';
import { ProgressComponent } from './components/core/progress/progress.component';
import { GridComponent } from './components/core/grid/grid.component';
import { TranslatePipe } from './pipes/core/translate.pipe';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { ValidationComponent } from './components/core/validation/validation.component';
import { OnlyNumberDirective } from './directives/core/only-number.directive';
import { HeaderComponent } from './components/app/header/header.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { FilesComponent } from './pages/storage/files/files.component';
import { TransactionsComponent } from './components/app/account/transactions/transactions.component';
import { PremiumPlansComponent } from './components/app/account/premium-plans/premium-plans.component';
import { CulturedDatePipe } from './pipes/core/cultured-date.pipe';
import { CulturedDateTimePipe } from './pipes/core/cultured-date-time.pipe';
import { MomentAgoPipe } from './pipes/core/moment-ago.pipe';
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { EnterToBrPipe } from './pipes/core/enter-to-br.pipe';
import { QuickAccessComponent } from './components/app/quick-access/quick-access.component';
import { SearchResultComponent } from './components/app/search-result/search-result.component';
import { ConfirmAccountComponent } from './components/app/confirm-account/confirm-account.component';
import { StringFormatPipe } from './pipes/core/string-format.pipe';
import { PhoneVerificationComponent } from './components/app/phone-verification/phone-verification.component';
import { PromptComponent } from './modals/prompt/prompt.component';
import { ChangePhoneComponent } from './modals/change-phone/change-phone.component';
import { FileFolderPreviewComponent } from './components/app/files-folder-preview/file-folder-preview.component';
import { FilesExplorerComponent } from './components/app/files-explorer/files-explorer.component';
import { CtrlClickDirective } from './directives/core/ctrl-click.directive';
import { DashboardEventsComponent } from './components/app/dashboard-events/dashboard-events.component';
import { DashboardOverallComponent } from './components/app/dashboard-overall/dashboard-overall.component';
import { DashboardProgressComponent } from './components/app/dashboard-progress/dashboard-progress.component';
import { DashboardActivityComponent } from './components/app/dashboard-activity/dashboard-activity.component';
import { DashboardProjectComponent } from './components/app/dashboard-project/dashboard-project.component';
import { DashboardProjectTemplatesComponent } from './components/app/dashboard-project-templates/dashboard-project-templates.component';
import { ProjectInfoComponent } from './components/app/project-info/project-info.component';
import { CreateWizardComponent } from './modals/create-wizard/create-wizard.component';
import { InviteNewMemberComponent } from './components/app/invite-new-member/invite-new-member.component';
import { MemberInfoComponent } from './components/app/member-info/member-info.component';
import { MessengerComponent } from './pages/communication/messenger/messenger.component';
import { GroupComponent } from './pages/collaboration/group/group.component';
import { MessengerShortcutComponent } from './components/app/messenger-shortcut/messenger-shortcut.component';
import { ProjectComponent } from './pages/project-management/project/project.component';
import { WorkPackageComponent } from './pages/project-management/work-package/work-package.component';
import { SearchPipe } from './pipes/core/search.pipe';
import { EnumPipe } from './pipes/core/enum.pipe';
import { MessengerSettingComponent } from './modals/messenger-setting/messenger-setting.component';
import { ConversationComponent } from './components/app/conversation/conversation.component';
import { TasksComponent } from './pages/project-management/tasks/tasks.component';
import { InitialsPipe } from './pipes/app/initials.pipe';
import { OrgChartComponent } from './components/app/org-chart/org-chart.component';
import { GroupMembersComponent } from './components/app/group-members/group-members.component';
import { HumanResourcesComponent } from './components/app/human-resources/human-resources.component';
import { GroupReportsComponent } from './components/app/group-reports/group-reports.component';
import { GroupProjectsComponent } from './components/app/group-projects/group-projects.component';
import { GroupChartComponent } from './components/app/group-chart/group-chart.component';
import { OrgChartNodeComponent } from './components/app/org-chart-node/org-chart-node.component';
import { GroupInfoComponent } from './components/app/group-info/group-info.component';
import { ProjectInfoMiniComponent } from './components/app/project-info-mini/project-info-mini.component';
import { GroupTimespentComponent } from './components/app/group-timespent/group-timespent.component';
import { ChannelFilesComponent } from './components/app/channel-files/channel-files.component';
import { ProjectWizardComponent } from './components/app/project-wizard/project-wizard.component';
import { GroupWizardComponent } from './components/app/group-wizard/group-wizard.component';
import { ImportWizardComponent } from './components/app/import-wizard/import-wizard.component';
import { InviteGroupComponent } from './components/app/invite-group/invite-group.component';
import { InvitePeopleComponent } from './components/app/invite-people/invite-people.component';
import { ContentLoaderModule } from '@netbasal/ngx-content-loader';
import { TrendModule } from 'ngx-trend';
import { TruncatePipe } from './pipes/core/truncate.pipe';
import { ProjectRoadMapComponent } from './components/app/project-road-map/project-road-map.component';
import { ProjectTreeComponent } from './components/app/project-tree/project-tree.component';
import { ProjectSeasonComponent } from './components/app/project-season/project-season.component';
import { ProjectObjectiveComponent } from './components/app/project-objective/project-objective.component';
import { ProjectSettingComponent } from './components/app/project-setting/project-setting.component';
import { AccessListComponent } from './components/app/access-list/access-list.component';
import { MsToDurationPipe } from './pipes/core/ms-to-duration.pipe';
import { ProjectTreeNodeComponent } from './components/app/project-tree-node/project-tree-node.component';
import { WorkPackageBoardComponent } from './components/app/work-package-board/work-package-board.component';
import { WorkPackageListComponent } from './components/app/work-package-list/work-package-list.component';
import { WorkPackageTimeSpanComponent } from './components/app/work-package-time-span/work-package-time-span.component';
import { WorkPackageCalendarComponent } from './components/app/work-package-calendar/work-package-calendar.component';
import { ChangeEmailComponent } from './modals/change-email/change-email.component';
import { ReloadOnParamsChangedDirective } from './directives/core/reload-on-params-changed.directive';
import { GroupDetailComponent } from './modals/group-detail/group-detail.component';
import { InviteModalComponent } from './modals/invite-modal/invite-modal.component';
import { GroupNamePipe } from './pipes/app/group-name.pipe';
import { GroupSettingsComponent } from './components/app/group-settings/group-settings.component';
import { WorkPackageWizardComponent } from './modals/work-package-wizard/work-package-wizard.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { WorkPackageTaskComponent } from './components/app/work-package-task/work-package-task.component';
import { TaskModalComponent } from './modals/task-modal/task-modal.component';
import { UpgradeComponent } from './modals/upgrade/upgrade.component';
import { UpgradeWizardComponent } from './components/app/upgrade-wizard/upgrade-wizard.component';
import { MapModalComponent } from './modals/map-modal/map-modal.component';
import { EstimatedTimePipe } from './pipes/app/estimated-time.pipe';
import { ActivityLogComponent } from './components/app/activity-log/activity-log.component';
import { CustomFieldsComponent } from './components/app/custom-fields/custom-fields.component';
import { TimeSpanComponent } from './components/core/time-span/time-span.component';
import { NumberComponent } from './components/core/number/number.component';
import { TimePickerComponent } from './components/core/time-picker/time-picker.component';
import { DocumentModalComponent } from './modals/document-modal/document-modal.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DevicesComponent } from './components/app/devices/devices.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { InviteMemberComponent } from './components/app/invite-member/invite-member.component';
import { UpgradeWorkPackageComponent } from './modals/upgrade-work-package/upgrade-work-package.component';
import { CalendarMonthComponent } from './components/app/calendar-month/calendar-month.component';
import { TimeSpentComponent } from './components/app/time-spent/time-spent.component';
import { KartablComponent } from './components/app/kartabl/kartabl.component';
import { DurationPickerComponent } from './components/app/duration-picker/duration-picker.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { MatVideoModule } from 'mat-video';
import { WorkPackagePermissionComponent } from './modals/work-package-permission/work-package-permission.component';
import { ProjectTreeAnimationComponent } from './components/app/project-tree-animation/project-tree-animation.component';
import { ProjectTreeAnimationNodeComponent } from './components/app/project-tree-animation-node/project-tree-animation-node.component';
import { AnimationWorkPackageBoardComponent } from './components/app/animation-work-package-board/animation-work-package-board.component';
import { AnimationWorkPackageTaskComponent } from './components/app/animation-work-package-task/animation-work-package-task.component';
import { ArchivedProjectsComponent } from './components/app/archived-projects/archived-projects.component';
import { ArchivedGroupsComponent } from './components/app/archived-groups/archived-groups.component';
import { UploadExceedModalComponent } from './modals/upload-exceed-modal/upload-exceed-modal.component';
import { LabelsModalComponent } from './modals/labels-modal/labels-modal.component';
import { CustomFieldsModalComponent } from './modals/custom-fields-modal/custom-fields-modal.component';
import { OfflineComponent } from './modals/offline/offline.component';
import { FullNamePipe } from './pipes/app/full-name.pipe';
import { AdvancedPlayerComponent } from './modals/advanced-player/advanced-player.component';
import { MemberFilterPipe } from './pipes/app/member-filter.pipe';
import { TimeOffApproveModalComponent } from './modals/time-off-approve-modal/time-off-approve-modal.component';
import { TimeOffHistoryModalComponent } from './modals/time-off-history-modal/time-off-history-modal.component';
import { BulkDownloadModalComponent } from './modals/bulk-download-modal/bulk-download-modal.component';
import {CulturedDateFactory, CulturedDateFormatsFactory} from './library/core/date-time/material-date-adapter';
import {CultureService} from './services/core/culture.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CaptchaComponent,
    WaitingComponent,
    InputComponent,
    SwitchComponent,
    TagComponent,
    RadioComponent,
    DropdownComponent,
    FormComponent,
    FileComponent,
    EditorComponent,
    DatePickerComponent,
    ZonePickerComponent,
    CountryPickerComponent,
    ColorPickerComponent,
    CheckboxComponent,
    ButtonComponent,
    CalendarComponent,
    BoxGridComponent,
    AutoCompleteComponent,
    DocViewerComponent,
    EmojiPickerComponent,
    MapComponent,
    LocationPickerComponent,
    ScheduleComponent,
    ProgressComponent,
    GridComponent,
    TranslatePipe,
    RegisterComponent,
    ForgotComponent,
    ValidationComponent,
    OnlyNumberDirective,
    HeaderComponent,
    ProfileComponent,
    FilesComponent,
    TransactionsComponent,
    PremiumPlansComponent,
    CulturedDatePipe,
    CulturedDateTimePipe,
    MomentAgoPipe,
    ConfirmComponent,
    EnterToBrPipe,
    QuickAccessComponent,
    SearchResultComponent,
    ConfirmAccountComponent,
    StringFormatPipe,
    PhoneVerificationComponent,
    PromptComponent,
    ChangePhoneComponent,
    FileFolderPreviewComponent,
    FilesExplorerComponent,
    CtrlClickDirective,
    DashboardEventsComponent,
    DashboardOverallComponent,
    DashboardProgressComponent,
    DashboardActivityComponent,
    DashboardProjectComponent,
    DashboardProjectTemplatesComponent,
    ProjectInfoComponent,
    CreateWizardComponent,
    InviteNewMemberComponent,
    MemberInfoComponent,
    MessengerComponent,
    GroupComponent,
    MessengerShortcutComponent,
    ProjectComponent,
    WorkPackageComponent,
    SearchPipe,
    EnumPipe,
    MessengerSettingComponent,
    ConversationComponent,
    TasksComponent,
    InitialsPipe,
    OrgChartComponent,
    GroupMembersComponent,
    HumanResourcesComponent,
    GroupReportsComponent,
    GroupProjectsComponent,
    GroupChartComponent,
    OrgChartNodeComponent,
    GroupInfoComponent,
    ProjectInfoMiniComponent,
    GroupTimespentComponent,
    ChannelFilesComponent,
    ProjectWizardComponent,
    GroupWizardComponent,
    ImportWizardComponent,
    InviteGroupComponent,
    InvitePeopleComponent,
    TruncatePipe,
    ProjectRoadMapComponent,
    ProjectTreeComponent,
    ProjectSeasonComponent,
    ProjectObjectiveComponent,
    ProjectSettingComponent,
    AccessListComponent,
    MsToDurationPipe,
    ProjectTreeNodeComponent,
    WorkPackageBoardComponent,
    WorkPackageListComponent,
    WorkPackageTimeSpanComponent,
    WorkPackageCalendarComponent,
    ChangeEmailComponent,
    ReloadOnParamsChangedDirective,
    GroupDetailComponent,
    InviteModalComponent,
    GroupNamePipe,
    GroupSettingsComponent,
    WorkPackageWizardComponent,
    WorkPackageTaskComponent,
    TaskModalComponent,
    UpgradeComponent,
    UpgradeWizardComponent,
    MapModalComponent,
    EstimatedTimePipe,
    ActivityLogComponent,
    CustomFieldsComponent,
    TimeSpanComponent,
    NumberComponent,
    TimePickerComponent,
    DocumentModalComponent,
    DevicesComponent,
    InviteMemberComponent,
    UpgradeWorkPackageComponent,
    CalendarMonthComponent,
    TimeSpentComponent,
    KartablComponent,
    DurationPickerComponent,
    WorkPackagePermissionComponent,
    ProjectTreeAnimationComponent,
    ProjectTreeAnimationNodeComponent,
    AnimationWorkPackageBoardComponent,
    AnimationWorkPackageTaskComponent,
    ArchivedProjectsComponent,
    ArchivedGroupsComponent,
    UploadExceedModalComponent,
    LabelsModalComponent,
    CustomFieldsModalComponent,
    OfflineComponent,
    FullNamePipe,
    AdvancedPlayerComponent,
    MemberFilterPipe,
    TimeOffApproveModalComponent,
    TimeOffHistoryModalComponent,
    BulkDownloadModalComponent,
  ],
  entryComponents: [
    TimeOffApproveModalComponent,
    TimeOffHistoryModalComponent,
    AdvancedPlayerComponent,
    OfflineComponent,
    CustomFieldsModalComponent,
    LabelsModalComponent,
    UploadExceedModalComponent,
    WorkPackagePermissionComponent,
    UpgradeWorkPackageComponent,
    DocumentModalComponent,
    MapModalComponent,
    WorkPackageWizardComponent,
    ConfirmComponent,
    PromptComponent,
    ChangePhoneComponent,
    CreateWizardComponent,
    MessengerSettingComponent,
    ChangeEmailComponent,
    GroupDetailComponent,
    InviteModalComponent,
    TaskModalComponent,
    UpgradeComponent,
    BulkDownloadModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatPaginatorModule,
    MatTableModule,
    MatMenuModule,
    MatSnackBarModule,
    SocketIoModule,
    DeviceDetectorModule.forRoot(),
    QuillModule.forRoot(),
    SimpleModalModule.forRoot(
      {container: 'modal-container'},
      {
        ...defaultSimpleModalOptions,
        closeOnEscape: true,
        closeOnClickOutside: true,
        wrapperClass: 'in',
        wrapperDefaultClasses: 'modal fade-anim',
        bodyClass: 'modal-open',
      },
    ),
    NgxPopperModule.forRoot({placement: 'bottom'}),
    RoundProgressModule,
    BarChartModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatRippleModule,
    MomentModule,
    ContentLoaderModule,
    TrendModule,
    DragDropModule,
    ColorPickerModule,
    NgxDocViewerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    MatSliderModule,
    MatIconModule,
    NgxAudioPlayerModule,
    MatVideoModule,
    MatDatepickerModule,
    NgxGoogleAnalyticsModule.forRoot(environment.ga),
  ],
  providers: [
    {
      provide: DateAdapter,
      useFactory: CulturedDateFactory,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS,
      useFactory: CulturedDateFormatsFactory
    },

    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true,
    },
    {
      provide: Socket,
      useClass: PanelSocketProvider,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory,
      deps: [AppInitializerProvider],
      multi: true,
    },
    AppInitializerProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
