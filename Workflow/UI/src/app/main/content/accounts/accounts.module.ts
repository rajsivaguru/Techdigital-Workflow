import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { SharedModule } from '../../../core/modules/shared.module';

import { AccountsService } from './accounts.service';
import { ConsultantsComponent } from './consultant/consultants.component';
import { InvoicesComponent } from './invoice/invoices.component';
import { DialogComponent } from '../dialog/dialog.component'
import { SnackBarService } from '../dialog/snackbar.service'
import { AuthGuard } from '../login/login.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

const routes: Routes = [
    {
        path: 'consultants',
        component: ConsultantsComponent,
        canActivate: [AuthGuard],
        resolve: {
            consultants: AccountsService
        }
    }
    ,{
        path: 'invoices',
        component: InvoicesComponent,
        canActivate: [AuthGuard],
        resolve: {
            invoices: AccountsService
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
        ConsultantsComponent, InvoicesComponent
    ],
    providers: [
        AccountsService, SnackBarService
    ],
    entryComponents: [DialogComponent]
})
export class AccountsModule {
}
