import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { SharedModule } from '../../../core/modules/shared.module';
import { CustomerVendorComponent } from './/customer-vendor/customer-vendor.component';
import { CommonService } from './common.service';
import { DialogComponent } from '../dialog/dialog.component'
import { SnackBarService } from '../dialog/snackbar.service'
import { AuthGuard } from '../login/login.service';

const routes: Routes = [
    {
        path: 'customervendors',
        component: CustomerVendorComponent,
        canActivate: [AuthGuard],
        resolve: {
            consultants: CommonService
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        NguiAutoCompleteModule,
        NguiDatetimePickerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        CustomerVendorComponent
    ],
    providers: [
        CommonService
    ],
    entryComponents: [DialogComponent]
})
export class CommonModule {
}
