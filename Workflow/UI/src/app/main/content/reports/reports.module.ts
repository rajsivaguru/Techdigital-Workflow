
import { DialogComponent } from '../dialog/dialog.component'

import { AuthGuard } from '../login/login.service';
import {Component} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';


import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';

import { JobReportComponent } from './jobreport/jobreport.component';
import { UserReportComponent } from './userreport/userreport.component';

import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { HttpModule } from '@angular/http';
import { ReportsService} from './reports.service';

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
    }
];
 
@NgModule({
    declarations: [
        JobReportComponent,
        UserReportComponent
    ],
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
    exports     : [
        JobReportComponent,
        UserReportComponent
        
    ],
    entryComponents: [],
    providers   :   [ReportsService]
})

export class ReportsModule
{
}
