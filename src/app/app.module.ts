import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
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

import { AppRoutingModule } from './app-routing.module';
import { HttpInterceptor } from './services/http.interceptor';
import { PanelSocketProvider } from './services/socket.provider';
import {
  AppInitializerFactory,
  AppInitializerProvider,
} from './services/app.initializer';
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
import { MonthViewComponent } from './components/app/month-view/month-view.component';
import { DashboardOverallComponent } from './components/app/dashboard-overall/dashboard-overall.component';
import { DashboardProgressComponent } from './components/app/dashboard-progress/dashboard-progress.component';
import { BarChartModule } from '@swimlane/ngx-charts';
import { DashboardActivityComponent } from './components/app/dashboard-activity/dashboard-activity.component';
import { DashboardProjectComponent } from './components/app/dashboard-project/dashboard-project.component';
import { DashboardProjectTemplatesComponent } from './components/app/dashboard-project-templates/dashboard-project-templates.component';
import { ProjectInfoComponent } from './components/app/project-info/project-info.component';
import { CreateWizardComponent } from './modals/create-wizard/create-wizard.component';
import {
    MatAutocompleteModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatRadioModule, MatRippleModule,
} from '@angular/material';
import { InviteMemberComponent } from './components/app/invite-member/invite-member.component';
import { MemberInfoComponent } from './components/app/member-info/member-info.component';
import { MessengerComponent } from './pages/communication/messenger/messenger.component';
import { GroupComponent } from './pages/collaboration/group/group.component';
import { MessengerShortcutComponent } from './components/app/messenger-shortcut/messenger-shortcut.component';
import { ProjectComponent } from './pages/project-management/project/project.component';
import { WorkPackageComponent } from './pages/project-management/work-package/work-package.component';
import { SearchPipe } from './pipes/core/search.pipe';
import { EnumPipe } from './pipes/core/enum.pipe';

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
    MonthViewComponent,
    DashboardOverallComponent,
    DashboardProgressComponent,
    DashboardActivityComponent,
    DashboardProjectComponent,
    DashboardProjectTemplatesComponent,
    ProjectInfoComponent,
    CreateWizardComponent,
    InviteMemberComponent,
    MemberInfoComponent,
    MessengerComponent,
    GroupComponent,
    MessengerShortcutComponent,
    ProjectComponent,
    WorkPackageComponent,
    SearchPipe,
    EnumPipe,
  ],
  entryComponents: [
    ConfirmComponent,
    PromptComponent,
    ChangePhoneComponent,
    CreateWizardComponent,
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
        SimpleModalModule.forRoot(
            {container: 'modal-container'},
            {
                ...defaultSimpleModalOptions,
                closeOnEscape: true,
                closeOnClickOutside: true,
                wrapperClass: 'in',
                wrapperDefaultClasses: 'modal fade-anim'
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
    ],
  providers: [
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy,
    // },
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
