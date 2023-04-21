// import { APP_INITIALIZER, NgModule } from '@angular/core';
// import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { Socket, SocketIoModule } from 'ngx-socket-io';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CookieService } from 'ngx-cookie-service';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatTableModule } from '@angular/material/table';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { NgxPopperModule } from 'ngx-popper';
// import { RoundProgressModule } from 'angular-svg-round-progressbar';
// import { defaultSimpleModalOptions, SimpleModalModule } from 'ngx-simple-modal';
// import { BarChartModule } from '@swimlane/ngx-charts';
// import { MomentModule } from 'ngx-moment';
// import { QuillModule } from 'ngx-quill';
// import {
//   GoogleAnalyticsService,
//   NgxGoogleAnalyticsModule,
//   NgxGoogleAnalyticsRouterModule,
// } from 'ngx-google-analytics';
// import { ClipboardModule } from 'ngx-clipboard';
//
// import { AppRoutingModule } from './app-routing.module';
// import { HttpInterceptor } from './__/services/general/http.interceptor';
// import { PanelSocketProvider } from './__/services/general/socket.provider';
// import {
//   AppInitializerFactory,
//   AppInitializerProvider,
// } from './__/services/general/app.initializer';
// import { AppComponent } from './app.component';
// import { LoginComponent } from './__/pages/auth/login/login.component';
// import { DashboardComponent } from './__/pages/reports/dashboard/dashboard.component';
// import { WaitingComponent } from './__/components/core/waiting/waiting.component';
// import { InputComponent } from './__/components/core/input/input.component';
// import { SwitchComponent } from './__/components/core/switch/switch.component';
// import { TagComponent } from './__/components/core/tag/tag.component';
// import { RadioComponent } from './__/components/core/radio/radio.component';
// import { DropdownComponent } from './__/components/core/dropdown/dropdown.component';
// import { FormComponent } from './__/components/core/form/form.component';
// import { FileComponent } from './__/components/core/file/file.component';
// import { EditorComponent } from './__/components/core/editor/editor.component';
// import { DatePickerComponent } from './__/components/core/date-picker/date-picker.component';
// import { ZonePickerComponent } from './__/components/core/zone-picker/zone-picker.component';
// import { CountryPickerComponent } from './__/components/core/country-picker/country-picker.component';
// import { ColorPickerComponent } from './__/components/core/color-picker/color-picker.component';
// import { CheckboxComponent } from './__/components/core/checkbox/checkbox.component';
// import { ButtonComponent } from './__/components/core/button/button.component';
// import { CalendarComponent } from './__/components/core/calendar/calendar.component';
// import { BoxGridComponent } from './__/components/core/box-grid/box-grid.component';
// import { AutoCompleteComponent } from './__/components/core/auto-complete/auto-complete.component';
// import { DocViewerComponent } from './__/components/core/doc-viewer/doc-viewer.component';
// import { EmojiPickerComponent } from './__/components/core/emoji-picker/emoji-picker.component';
// import { MapComponent } from './__/components/core/map/map.component';
// import { LocationPickerComponent } from './__/components/core/location-picker/location-picker.component';
// import { ScheduleComponent } from './__/components/core/schedule/schedule.component';
// import { ProgressComponent } from './__/components/core/progress/progress.component';
// import { GridComponent } from './__/components/core/grid/grid.component';
// import { TranslatePipe } from './__/pipes/core/translate.pipe';
// import { RegisterComponent } from './__/pages/auth/register/register.component';
// import { ForgotComponent } from './__/pages/auth/forgot/forgot.component';
// import { ValidationComponent } from './__/components/core/validation/validation.component';
// import { OnlyNumberDirective } from './__/directives/core/only-number.directive';
// import { HeaderComponent } from './__/components/app/header/header.component';
// import { ProfileComponent } from './__/pages/account/profile/profile.component';
// import { FilesComponent } from './__/pages/storage/files/files.component';
// import { TransactionsComponent } from './__/components/app/account/transactions/transactions.component';
// import { PremiumPlansComponent } from './__/components/app/account/premium-plans/premium-plans.component';
// import { CulturedDatePipe } from './__/pipes/core/cultured-date.pipe';
// import { CulturedDateTimePipe } from './__/pipes/core/cultured-date-time.pipe';
// import { MomentAgoPipe } from './__/pipes/core/moment-ago.pipe';
// import { ConfirmComponent } from './__/modals/confirm/confirm.component';
// import { EnterToBrPipe } from './__/pipes/core/enter-to-br.pipe';
// import { QuickAccessComponent } from './__/components/app/quick-access/quick-access.component';
// import { SearchResultComponent } from './__/components/app/search-result/search-result.component';
// import { ConfirmAccountComponent } from './__/components/app/confirm-account/confirm-account.component';
// import { StringFormatPipe } from './__/pipes/core/string-format.pipe';
// import { PhoneVerificationComponent } from './__/components/app/phone-verification/phone-verification.component';
// import { PromptComponent } from './__/modals/prompt/prompt.component';
// import { ChangePhoneComponent } from './__/modals/change-phone/change-phone.component';
// import { FileFolderPreviewComponent } from './__/components/app/files-folder-preview/file-folder-preview.component';
// import { FilesExplorerComponent } from './__/components/app/files-explorer/files-explorer.component';
// import { CtrlClickDirective } from './__/directives/core/ctrl-click.directive';
// import { DashboardEventsComponent } from './__/components/app/dashboard-events/dashboard-events.component';
// import { DashboardOverallComponent } from './__/components/app/dashboard-overall/dashboard-overall.component';
// import { DashboardProgressComponent } from './__/components/app/dashboard-progress/dashboard-progress.component';
// import { DashboardActivityComponent } from './__/components/app/dashboard-activity/dashboard-activity.component';
// import { DashboardProjectComponent } from './__/components/app/dashboard-project/dashboard-project.component';
// import { DashboardProjectTemplatesComponent } from './__/components/app/dashboard-project-templates/dashboard-project-templates.component';
// import { ProjectInfoComponent } from './__/components/app/project-info/project-info.component';
// import { CreateWizardComponent } from './__/modals/create-wizard/create-wizard.component';
// import { InviteNewMemberComponent } from './__/components/app/invite-new-member/invite-new-member.component';
// import { MemberInfoComponent } from './__/components/app/member-info/member-info.component';
// import { MessengerComponent } from './__/pages/communication/messenger/messenger.component';
// import { GroupComponent } from './__/pages/collaboration/group/group.component';
// import { MessengerShortcutComponent } from './__/components/app/messenger-shortcut/messenger-shortcut.component';
// import { ProjectComponent } from './__/pages/project-management/project/project.component';
// import { WorkPackageComponent } from './__/pages/project-management/work-package/work-package.component';
// import { SearchPipe } from './__/pipes/core/search.pipe';
// import { EnumPipe } from './__/pipes/core/enum.pipe';
// import { MessengerSettingComponent } from './__/modals/messenger-setting/messenger-setting.component';
// import { ConversationComponent } from './__/components/app/conversation/conversation.component';
// import { TasksComponent } from './__/pages/project-management/tasks/tasks.component';
// import { InitialsPipe } from './__/pipes/app/initials.pipe';
// import { OrgChartComponent } from './__/components/app/org-chart/org-chart.component';
// import { GroupMembersComponent } from './__/components/app/group-members/group-members.component';
// import { HumanResourcesComponent } from './__/components/app/human-resources/human-resources.component';
// import { GroupReportsComponent } from './__/components/app/group-reports/group-reports.component';
// import { GroupProjectsComponent } from './__/components/app/group-projects/group-projects.component';
// import { GroupChartComponent } from './__/components/app/group-chart/group-chart.component';
// import { OrgChartNodeComponent } from './__/components/app/org-chart-node/org-chart-node.component';
// import { GroupInfoComponent } from './__/components/app/group-info/group-info.component';
// import { ProjectInfoMiniComponent } from './__/components/app/project-info-mini/project-info-mini.component';
// import { GroupTimespentComponent } from './__/components/app/group-timespent/group-timespent.component';
// import { ChannelFilesComponent } from './__/components/app/channel-files/channel-files.component';
// import { ProjectWizardComponent } from './__/components/app/project-wizard/project-wizard.component';
// import { GroupWizardComponent } from './__/components/app/group-wizard/group-wizard.component';
// import { ImportWizardComponent } from './__/components/app/import-wizard/import-wizard.component';
// import { InviteGroupComponent } from './__/components/app/invite-group/invite-group.component';
// import { InvitePeopleComponent } from './__/components/app/invite-people/invite-people.component';
// import { ContentLoaderModule } from '@netbasal/ngx-content-loader';
// import { TrendModule } from 'ngx-trend';
// import { TruncatePipe } from './__/pipes/core/truncate.pipe';
// import { ProjectRoadMapComponent } from './__/components/app/project-road-map/project-road-map.component';
// import { ProjectTreeComponent } from './__/components/app/project-tree/project-tree.component';
// import { ProjectSeasonComponent } from './__/components/app/project-season/project-season.component';
// import { ProjectObjectiveComponent } from './__/components/app/project-objective/project-objective.component';
// import { ProjectSettingComponent } from './__/components/app/project-setting/project-setting.component';
// import { AccessListComponent } from './__/components/app/access-list/access-list.component';
// import { MsToDurationPipe } from './__/pipes/core/ms-to-duration.pipe';
// import { ProjectTreeNodeComponent } from './__/components/app/project-tree-node/project-tree-node.component';
// import { WorkPackageBoardComponent } from './__/components/app/work-package-board/work-package-board.component';
// import { WorkPackageListComponent } from './__/components/app/work-package-list/work-package-list.component';
// import { WorkPackageTimeSpanComponent } from './__/components/app/work-package-time-span/work-package-time-span.component';
// import { WorkPackageCalendarComponent } from './__/components/app/work-package-calendar/work-package-calendar.component';
// import { ChangeEmailComponent } from './__/modals/change-email/change-email.component';
// import { ReloadOnParamsChangedDirective } from './__/directives/core/reload-on-params-changed.directive';
// import { GroupDetailComponent } from './__/modals/group-detail/group-detail.component';
// import { InviteModalComponent } from './__/modals/invite-modal/invite-modal.component';
// import { GroupNamePipe } from './__/pipes/app/group-name.pipe';
// import { GroupSettingsComponent } from './__/components/app/group-settings/group-settings.component';
// import { WorkPackageWizardComponent } from './__/modals/work-package-wizard/work-package-wizard.component';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { ColorPickerModule } from 'ngx-color-picker';
// import { WorkPackageTaskComponent } from './__/components/app/work-package-task/work-package-task.component';
// import { TaskModalComponent } from './__/modals/task-modal/task-modal.component';
// import { MapModalComponent } from './__/modals/map-modal/map-modal.component';
// import { EstimatedTimePipe } from './__/pipes/app/estimated-time.pipe';
// import { ActivityLogComponent } from './__/components/app/activity-log/activity-log.component';
// import { CustomFieldsComponent } from './__/components/app/custom-fields/custom-fields.component';
// import { TimeSpanComponent } from './__/components/core/time-span/time-span.component';
// import { NumberComponent } from './__/components/core/number/number.component';
// import { TimePickerComponent } from './__/components/core/time-picker/time-picker.component';
// import { DocumentModalComponent } from './__/modals/document-modal/document-modal.component';
// import { NgxDocViewerModule } from 'ngx-doc-viewer';
// import { DevicesComponent } from './__/components/app/devices/devices.component';
// import { ServiceWorkerModule } from '@angular/service-worker';
// import { environment } from '../environments/environment';
// import { InviteMemberComponent } from './__/components/app/invite-member/invite-member.component';
// import { UpgradeWorkPackageComponent } from './__/modals/upgrade-work-package/upgrade-work-package.component';
// import { CalendarMonthComponent } from './__/components/app/calendar-month/calendar-month.component';
// import { TimeSpentComponent } from './__/components/app/time-spent/time-spent.component';
// import { KartablComponent } from './__/components/app/kartabl/kartabl.component';
// import { DurationPickerComponent } from './__/components/app/duration-picker/duration-picker.component';
// import { NgxAudioPlayerModule } from 'ngx-audio-player';
// import { WorkPackagePermissionComponent } from './__/modals/work-package-permission/work-package-permission.component';
// import { ArchivedProjectsComponent } from './__/components/app/archived-projects/archived-projects.component';
// import { ArchivedGroupsComponent } from './__/components/app/archived-groups/archived-groups.component';
// import { LabelsModalComponent } from './__/modals/labels-modal/labels-modal.component';
// import { CustomFieldsModalComponent } from './__/modals/custom-fields-modal/custom-fields-modal.component';
// import { OfflineComponent } from './__/modals/offline/offline.component';
// import { FullNamePipe } from './__/pipes/app/full-name.pipe';
// import { AdvancedPlayerComponent } from './__/modals/advanced-player/advanced-player.component';
// import { MemberFilterPipe } from './__/pipes/app/member-filter.pipe';
// import { TimeOffApproveModalComponent } from './__/modals/time-off-approve-modal/time-off-approve-modal.component';
// import { TimeOffHistoryModalComponent } from './__/modals/time-off-history-modal/time-off-history-modal.component';
// import { BulkDownloadModalComponent } from './__/modals/bulk-download-modal/bulk-download-modal.component';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import {
//   MatNativeDateModule,
//   MatRippleModule,
// } from '@angular/material/core';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { VideoComponent } from './__/components/app/video/video.component';
// import { AudioComponent } from './__/components/app/audio/audio.component';
// import { ThumbnailUrlPipe } from './__/pipes/app/thumbnail-url.pipe';
// import { PersianDatePickerComponent } from './__/components/core/persian-date-picker/persian-date-picker.component';
// import { NativeDatePickerComponent } from './__/components/core/native-date-picker/native-date-picker.component';
// import { HijriDatePickerComponent } from './__/components/core/hijri-date-picker/hijri-date-picker.component';
// import { NoApiFoundComponent } from './__/pages/errors/no-api-found/no-api-found.component';
// import { NotFoundComponent } from './__/pages/errors/not-found/not-found.component';
// import { NotAuthorizedComponent } from './__/pages/errors/not-authorized/not-authorized.component';
//
// @NgModule({
//   declarations: [
//     AppComponent,
//     LoginComponent,
//     DashboardComponent,
//     WaitingComponent,
//     InputComponent,
//     SwitchComponent,
//     TagComponent,
//     RadioComponent,
//     DropdownComponent,
//     FormComponent,
//     FileComponent,
//     EditorComponent,
//     DatePickerComponent,
//     ZonePickerComponent,
//     CountryPickerComponent,
//     ColorPickerComponent,
//     CheckboxComponent,
//     ButtonComponent,
//     CalendarComponent,
//     BoxGridComponent,
//     AutoCompleteComponent,
//     DocViewerComponent,
//     EmojiPickerComponent,
//     MapComponent,
//     LocationPickerComponent,
//     ScheduleComponent,
//     ProgressComponent,
//     GridComponent,
//     TranslatePipe,
//     RegisterComponent,
//     ForgotComponent,
//     ValidationComponent,
//     OnlyNumberDirective,
//     HeaderComponent,
//     ProfileComponent,
//     FilesComponent,
//     TransactionsComponent,
//     PremiumPlansComponent,
//     CulturedDatePipe,
//     CulturedDateTimePipe,
//     MomentAgoPipe,
//     ConfirmComponent,
//     EnterToBrPipe,
//     QuickAccessComponent,
//     SearchResultComponent,
//     ConfirmAccountComponent,
//     StringFormatPipe,
//     PhoneVerificationComponent,
//     PromptComponent,
//     ChangePhoneComponent,
//     FileFolderPreviewComponent,
//     FilesExplorerComponent,
//     CtrlClickDirective,
//     DashboardEventsComponent,
//     DashboardOverallComponent,
//     DashboardProgressComponent,
//     DashboardActivityComponent,
//     DashboardProjectComponent,
//     DashboardProjectTemplatesComponent,
//     ProjectInfoComponent,
//     CreateWizardComponent,
//     InviteNewMemberComponent,
//     MemberInfoComponent,
//     MessengerComponent,
//     GroupComponent,
//     MessengerShortcutComponent,
//     ProjectComponent,
//     WorkPackageComponent,
//     SearchPipe,
//     EnumPipe,
//     MessengerSettingComponent,
//     ConversationComponent,
//     TasksComponent,
//     InitialsPipe,
//     OrgChartComponent,
//     GroupMembersComponent,
//     HumanResourcesComponent,
//     GroupReportsComponent,
//     GroupProjectsComponent,
//     GroupChartComponent,
//     OrgChartNodeComponent,
//     GroupInfoComponent,
//     ProjectInfoMiniComponent,
//     GroupTimespentComponent,
//     ChannelFilesComponent,
//     ProjectWizardComponent,
//     GroupWizardComponent,
//     ImportWizardComponent,
//     InviteGroupComponent,
//     InvitePeopleComponent,
//     TruncatePipe,
//     ProjectRoadMapComponent,
//     ProjectTreeComponent,
//     ProjectSeasonComponent,
//     ProjectObjectiveComponent,
//     ProjectSettingComponent,
//     AccessListComponent,
//     MsToDurationPipe,
//     ProjectTreeNodeComponent,
//     WorkPackageBoardComponent,
//     WorkPackageListComponent,
//     WorkPackageTimeSpanComponent,
//     WorkPackageCalendarComponent,
//     ChangeEmailComponent,
//     ReloadOnParamsChangedDirective,
//     GroupDetailComponent,
//     InviteModalComponent,
//     GroupNamePipe,
//     GroupSettingsComponent,
//     WorkPackageWizardComponent,
//     WorkPackageTaskComponent,
//     TaskModalComponent,
//     MapModalComponent,
//     EstimatedTimePipe,
//     ActivityLogComponent,
//     CustomFieldsComponent,
//     TimeSpanComponent,
//     NumberComponent,
//     TimePickerComponent,
//     DocumentModalComponent,
//     DevicesComponent,
//     InviteMemberComponent,
//     UpgradeWorkPackageComponent,
//     CalendarMonthComponent,
//     TimeSpentComponent,
//     KartablComponent,
//     DurationPickerComponent,
//     WorkPackagePermissionComponent,
//     ArchivedProjectsComponent,
//     ArchivedGroupsComponent,
//     LabelsModalComponent,
//     CustomFieldsModalComponent,
//     OfflineComponent,
//     FullNamePipe,
//     AdvancedPlayerComponent,
//     MemberFilterPipe,
//     TimeOffApproveModalComponent,
//     TimeOffHistoryModalComponent,
//     BulkDownloadModalComponent,
//     VideoComponent,
//     AudioComponent,
//     ThumbnailUrlPipe,
//     PersianDatePickerComponent,
//     NativeDatePickerComponent,
//     HijriDatePickerComponent,
//     NoApiFoundComponent,
//     NotFoundComponent,
//     NotAuthorizedComponent,
//   ],
//   entryComponents: [
//     TimeOffApproveModalComponent,
//     TimeOffHistoryModalComponent,
//     AdvancedPlayerComponent,
//     OfflineComponent,
//     CustomFieldsModalComponent,
//     LabelsModalComponent,
//     WorkPackagePermissionComponent,
//     UpgradeWorkPackageComponent,
//     DocumentModalComponent,
//     MapModalComponent,
//     WorkPackageWizardComponent,
//     ConfirmComponent,
//     PromptComponent,
//     ChangePhoneComponent,
//     CreateWizardComponent,
//     MessengerSettingComponent,
//     ChangeEmailComponent,
//     GroupDetailComponent,
//     InviteModalComponent,
//     TaskModalComponent,
//     BulkDownloadModalComponent,
//   ],
//   imports: [
//     MatNativeDateModule,
//     ClipboardModule,
//     BrowserModule,
//     AppRoutingModule,
//     BrowserAnimationsModule,
//     FormsModule,
//     HttpClientModule,
//     MatButtonModule,
//     MatToolbarModule,
//     MatTabsModule,
//     MatPaginatorModule,
//     MatTableModule,
//     MatMenuModule,
//     MatSnackBarModule,
//     SocketIoModule,
//     QuillModule.forRoot(),
//     SimpleModalModule.forRoot(
//       { container: 'modal-container' },
//       {
//         ...defaultSimpleModalOptions,
//         closeOnEscape: true,
//         closeOnClickOutside: true,
//         wrapperClass: 'in',
//         wrapperDefaultClasses: 'modal fade-anim',
//         bodyClass: 'modal-open',
//       },
//     ),
//     NgxPopperModule.forRoot({ placement: 'bottom' }),
//     RoundProgressModule,
//     BarChartModule,
//     MatRadioModule,
//     MatCheckboxModule,
//     MatProgressBarModule,
//     MatAutocompleteModule,
//     MatFormFieldModule,
//     ReactiveFormsModule,
//     MatRippleModule,
//     MomentModule,
//     ContentLoaderModule,
//     TrendModule,
//     DragDropModule,
//     ColorPickerModule,
//     NgxDocViewerModule,
//     ServiceWorkerModule.register('ngsw-worker.js', {
//       enabled: environment.production,
//     }),
//     MatSliderModule,
//     MatIconModule,
//     NgxAudioPlayerModule,
//     MatDatepickerModule,
//     NgxGoogleAnalyticsModule.forRoot(environment.ga),
//   ],
//   providers: [
//     GoogleAnalyticsService,
//     CookieService,
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: HttpInterceptor,
//       multi: true,
//     },
//     {
//       provide: Socket,
//       useClass: PanelSocketProvider,
//     },
//     {
//       provide: APP_INITIALIZER,
//       useFactory: AppInitializerFactory,
//       deps: [AppInitializerProvider],
//       multi: true,
//     },
//     AppInitializerProvider,
//   ],
//   bootstrap: [AppComponent],
// })
// export class AppModule {}
