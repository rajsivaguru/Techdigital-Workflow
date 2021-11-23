import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { SharedModule } from '../../../core/modules/shared.module';

import { EmailService } from './email.service';
import { ComposeEmailComponent } from './compose/composeemail.component';
import { DialogComponent } from '../dialog/dialog.component'
import { SnackBarService } from '../dialog/snackbar.service'
import { AuthGuard } from '../login/login.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

const routes: Routes = [
    {
        path: 'composeemail',
        component: ComposeEmailComponent,
        canActivate: [AuthGuard],
        resolve: {
            newJobs: EmailService
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
        ComposeEmailComponent
    ],
    providers: [
        EmailService, SnackBarService
    ],
    entryComponents: [DialogComponent]
})
export class EmailModule {
}
