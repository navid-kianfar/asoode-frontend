import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DocViewerComponent } from './components/doc-viewer/doc-viewer.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { EditorComponent } from './components/editor/editor.component';
import { FileComponent } from './components/file/file.component';
import { FormComponent } from './components/form/form.component';
import { GridComponent } from './components/grid/grid.component';
import { InputComponent } from './components/input/input.component';
import { MapComponent } from './components/map/map.component';
import { NativeDatePickerComponent } from './components/native-date-picker/native-date-picker.component';
import { NumberComponent } from './components/number/number.component';
import { PersianDatePickerComponent } from './components/persian-date-picker/persian-date-picker.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { TimeSpanComponent } from './components/time-span/time-span.component';
import { ValidationComponent } from './components/validation/validation.component';
import { HijriDatePickerComponent } from './components/hijri-date-picker/hijri-date-picker.component';
import { CtrlClickDirective } from './directives/ctrl-click.directive';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { ReloadOnParamsChangedDirective } from './directives/reload-on-params-changed.directive';
import { CulturedDatePipe } from './pipes/cultured-date.pipe';
import { CulturedDateTimePipe } from './pipes/cultured-date-time.pipe';
import { EnterToBrPipe } from './pipes/enter-to-br.pipe';
import { EnumPipe } from './pipes/enum.pipe';
import { EstimatedTimePipe } from './pipes/estimated-time.pipe';
import { FullNamePipe } from './pipes/full-name.pipe';
import { InitialsPipe } from './pipes/initials.pipe';
import { MemberFilterPipe } from './pipes/member-filter.pipe';
import { MomentAgoPipe } from './pipes/moment-ago.pipe';
import { MsToDurationPipe } from './pipes/ms-to-duration.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { StringFormatPipe } from './pipes/string-format.pipe';
import { ThumbnailUrlPipe } from './pipes/thumbnail-url.pipe';
import { TranslatePipe } from './pipes/translate.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatMenuModule } from '@angular/material/menu';
import { QuillModule } from 'ngx-quill';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { WaitingComponent } from './components/waiting/waiting.component';
import { PhoneVerificationComponent } from './components/phone-verification/phone-verification.component';
import { MemberInfoComponent } from './components/member-info/member-info.component';
import { HeaderComponent } from './components/header/header.component';
import { NgxPopperModule } from 'ngx-popper';
import { QuickAccessComponent } from './components/quick-access/quick-access.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { RouterLink } from '@angular/router';
import { GroupInfoComponent } from './components/group-info/group-info.component';
import { ProjectInfoMiniComponent } from '../project/components/project-info-mini/project-info-mini.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogModule } from '@angular/cdk/dialog';
import { OfflineModalComponent } from './modals/offline-modal/offline-modal.component';
import { PromptModalComponent } from './modals/prompt-modal/prompt-modal.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { RadioButtonComponent } from './components/radio-button/radio-button.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MessengerShortcutComponent } from './components/messenger-shortcut/messenger-shortcut.component';
import { DurationPickerComponent } from './components/duration-picker/duration-picker.component';
import { CalendarMonthComponent } from './components/calendar-month/calendar-month.component';
import { TimeSpentComponent } from './components/time-spent/time-spent.component';
import { AccessListComponent } from './components/access-list/access-list.component';
import { AudioComponent } from './components/audio/audio.component';
import { VideoComponent } from './components/video/video.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { CreateWizardModalComponent } from './modals/create-wizard-modal/create-wizard-modal.component';
import { MatRadioModule } from '@angular/material/radio';
import { ImportWizardComponent } from './components/import-wizard/import-wizard.component';
import { ProjectWizardComponent } from '../project/components/project-wizard/project-wizard.component';
import { GroupWizardComponent } from '../groups/components/group-wizard/group-wizard.component';
import { InviteGroupComponent } from '../groups/components/invite-group/invite-group.component';
import { InviteMemberComponent } from './components/invite-member/invite-member.component';
import { InviteNewMemberComponent } from './components/invite-new-member/invite-new-member.component';
import { InvitePeopleComponent } from './components/invite-people/invite-people.component';



@NgModule({
  declarations: [
    AutoCompleteComponent,
    CalendarComponent,
    CheckboxComponent,
    ColorPickerComponent,
    DatePickerComponent,
    DocViewerComponent,
    DropdownComponent,
    EditorComponent,
    FileComponent,
    FormComponent,
    GridComponent,
    HijriDatePickerComponent,
    InputComponent,
    MapComponent,
    NativeDatePickerComponent,
    NumberComponent,
    PersianDatePickerComponent,
    TimePickerComponent,
    TimeSpanComponent,
    ValidationComponent,
    WaitingComponent,
    PhoneVerificationComponent,
    MemberInfoComponent,
    HeaderComponent,
    QuickAccessComponent,
    SearchResultComponent,
    GroupInfoComponent,
    ProjectInfoMiniComponent,
    RadioButtonComponent,
    MessengerShortcutComponent,
    DurationPickerComponent,
    CalendarMonthComponent,
    TimeSpentComponent,
    AccessListComponent,
    AudioComponent,
    VideoComponent,
    ImportWizardComponent,
    ProjectWizardComponent,
    GroupWizardComponent,
    InviteGroupComponent,
    InviteMemberComponent,
    InviteNewMemberComponent,
    InvitePeopleComponent,



    CreateWizardModalComponent,




    CtrlClickDirective,
    OnlyNumberDirective,
    ReloadOnParamsChangedDirective,



    CulturedDatePipe,
    CulturedDateTimePipe,
    EnterToBrPipe,
    EnumPipe,
    EstimatedTimePipe,
    FullNamePipe,
    InitialsPipe,
    MemberFilterPipe,
    MomentAgoPipe,
    MsToDurationPipe,
    SearchPipe,
    StringFormatPipe,
    ThumbnailUrlPipe,
    TranslatePipe,
    TruncatePipe,



    OfflineModalComponent,
    PromptModalComponent,
    ConfirmModalComponent,
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatCheckboxModule,
    ColorPickerModule,
    MatMenuModule,
    QuillModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    NgxPopperModule.forRoot({ placement: 'bottom' }),
    RouterLink,
    MatSnackBarModule,
    DialogModule,
    MatTabsModule,
    NgxAudioPlayerModule,
    MatRadioModule,
  ],
  exports: [
    AutoCompleteComponent,
    CalendarComponent,
    CheckboxComponent,
    ColorPickerComponent,
    DatePickerComponent,
    DocViewerComponent,
    DropdownComponent,
    EditorComponent,
    FileComponent,
    FormComponent,
    GridComponent,
    HijriDatePickerComponent,
    InputComponent,
    MapComponent,
    NativeDatePickerComponent,
    NumberComponent,
    PersianDatePickerComponent,
    TimePickerComponent,
    TimeSpanComponent,
    ValidationComponent,
    WaitingComponent,
    PhoneVerificationComponent,
    MemberInfoComponent,
    HeaderComponent,
    QuickAccessComponent,
    SearchResultComponent,
    GroupInfoComponent,
    ProjectInfoMiniComponent,
    RadioButtonComponent,
    MessengerShortcutComponent,
    DurationPickerComponent,
    CalendarMonthComponent,
    TimeSpentComponent,
    AccessListComponent,
    AudioComponent,
    VideoComponent,
    ImportWizardComponent,
    ProjectWizardComponent,
    GroupWizardComponent,
    InviteGroupComponent,
    InviteMemberComponent,
    InviteNewMemberComponent,
    InvitePeopleComponent,



    CreateWizardModalComponent,



    CtrlClickDirective,
    OnlyNumberDirective,
    ReloadOnParamsChangedDirective,



    CulturedDatePipe,
    CulturedDateTimePipe,
    EnterToBrPipe,
    EnumPipe,
    EstimatedTimePipe,
    FullNamePipe,
    InitialsPipe,
    MemberFilterPipe,
    MomentAgoPipe,
    MsToDurationPipe,
    SearchPipe,
    StringFormatPipe,
    ThumbnailUrlPipe,
    TranslatePipe,
    TruncatePipe,



    OfflineModalComponent,
    PromptModalComponent,
    ConfirmModalComponent,
  ],
})
export class SharedModule { }
