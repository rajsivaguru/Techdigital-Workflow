import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { SharedModule } from '../../../core/modules/shared.module';
import { PunchTimeService } from './punchtime.service';
import { InOutTimeComponent } from './inout/inouttime.component';
import { DialogComponent } from '../dialog/dialog.component'
import { SnackBarService } from '../dialog/snackbar.service'
import { AuthGuard } from '../login/login.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

const routes: Routes = [
    {
        path: 'punchtime',
        component: InOutTimeComponent,
        canActivate: [AuthGuard],
        resolve: {
            punchForm: PunchTimeService
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        NguiAutoCompleteModule,
        NguiDatetimePickerModule,
        AngularMultiSelectModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        InOutTimeComponent
    ],
    providers: [
        PunchTimeService, SnackBarService
    ],
    entryComponents: [DialogComponent]
})

export class PunchTimeModule {
}
