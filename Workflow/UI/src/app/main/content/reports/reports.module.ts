import { Component, NgModule} from '@angular/core'
import { BrowserModule} from '@angular/platform-browser'
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';

import { DialogComponent, DialogProfileSeachReportDetailComponent } from '../dialog/dialog.component'
import { AuthGuard } from '../login/login.service';
import { JobReportComponent } from './jobreport/jobreport.component';
import { UserReportComponent } from './userreport/userreport.component';
import { ClientReportComponent } from './clientreport/clientreport.component';
import { ProfileSearchReportComponent } from './profilesearchreport/profilesearchreport.component';
import { PunchReportComponent } from './punchreport/punchreport.component';
import { InvoiceReportComponent } from './accountreport/invoicereport.component';
import { SnackBarService } from '../dialog/snackbar.service'
import { ReportsService } from './reports.service';
import { Utilities } from '../common/commonUtil';

const routes = [
    {
        path     : 'jobreport',
        component: JobReportComponent,
        canActivate: [AuthGuard],
        resolve  : {
            jobs: ReportsService
        }
    },
    {
        path        : 'userreport',
        component   : UserReportComponent,
        canActivate: [AuthGuard],
        resolve  : {
            users: ReportsService
        }
    },
    {
        path: 'clientreport',
        component: ClientReportComponent,
        canActivate: [AuthGuard],
        resolve: {
            jobs: ReportsService
        }
    },
    {
        path: 'profilesearchreport',
        component: ProfileSearchReportComponent,
        canActivate: [AuthGuard],
        resolve: {
            jobs: ReportsService
        }
    },
    {
        path: 'punchreport',
        component: PunchReportComponent,
        canActivate: [AuthGuard],
        resolve: {
            jobs: ReportsService
        }
    },
    {
        path: 'invoicereport',
        component: InvoiceReportComponent,
        canActivate: [AuthGuard],
        resolve: {
            jobs: ReportsService
        }
    }
];
 
@NgModule({
    declarations: [JobReportComponent, UserReportComponent, ClientReportComponent, ProfileSearchReportComponent, PunchReportComponent, InvoiceReportComponent, DialogProfileSeachReportDetailComponent],
    imports     : [
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
    exports: [JobReportComponent, UserReportComponent, ClientReportComponent, ProfileSearchReportComponent, PunchReportComponent, InvoiceReportComponent],
    entryComponents: [DialogProfileSeachReportDetailComponent],
    providers: [ReportsService, SnackBarService, Utilities]
})

export class ReportsModule
{
}
