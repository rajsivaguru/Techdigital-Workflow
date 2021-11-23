import { Component, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';

////import { DialogComponent, DialogDataComponent, DialogConsultantComponent } from '../dialog/dialog.component'
import { DialogComponent, DialogDataComponent} from '../dialog/dialog.component'
import { AuthGuard } from '../login/login.service';
import { QuestionComponent } from './question/question.component';
import { SnackBarService } from '../dialog/snackbar.service';
import { VisaService } from './visa.service';
import { Utilities } from '../common/commonUtil';

const routes = [
    {
        path: 'visaquestion',
        component: QuestionComponent,
        canActivate: [AuthGuard],
        resolve: {
            questions: VisaService
        }
    }
];

@NgModule({
    ////declarations: [QuestionComponent, DialogConsultantComponent],
    declarations: [QuestionComponent],
    imports: [
        SharedModule,
        TextMaskModule,
        NguiAutoCompleteModule,
        NguiDatetimePickerModule,
        BrowserModule,
        FormsModule,
        AngularMultiSelectModule,
        HttpModule,
        RouterModule.forChild(routes)
    ],
    exports: [QuestionComponent],
    ////entryComponents: [DialogConsultantComponent],
    entryComponents: [],
    providers: [VisaService, SnackBarService, Utilities]
})

export class VisaModule {
}
