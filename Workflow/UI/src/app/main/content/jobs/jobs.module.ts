import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './jobs.component';
import { JobsService } from './jobs.service';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { JobsLoadComponent } from './jobs-load/jobs-load.component';

import { DialogComponent, DialogDataComponent } from '../dialog/dialog.component'

import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AuthGuard } from '../login/login.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

const routes: Routes = [
    // {
    //     path     : 'jobs',
    //     component: JobsComponent,
    //     canActivate: [AuthGuard],
    //     resolve  : {
    //         jobs: JobsService
    //     }
    // },
    {
        path     : 'jobsload',
        component: JobsLoadComponent,
        canActivate: [AuthGuard],
        resolve  : {
            newJobs: JobsService
        }
    }
];

@NgModule({
    imports        : [
        SharedModule,
        NguiAutoCompleteModule,
        NguiDatetimePickerModule,
        AngularMultiSelectModule,
        RouterModule.forChild(routes)
    ],
    declarations   : [
        JobsComponent,
        JobsListComponent,
        JobsLoadComponent,
        DialogDataComponent 
    ],
    providers      : [
        JobsService
    ],
    entryComponents: [DialogComponent, DialogDataComponent]
})
export class JobsModule
{
}
