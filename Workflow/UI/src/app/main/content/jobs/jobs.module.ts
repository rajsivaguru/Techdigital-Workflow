import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './jobs.component';
import { JobsService } from './jobs.service';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { JobsLoadComponent } from './jobs-load/jobs-load.component';
import { JobsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { JobsFormComponent } from './jobs-form/jobs-form.component';
import { JobsDetailsComponent } from './jobs-details/jobs-details.component';

import { DialogComponent } from '../dialog/dialog.component'

import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AuthGuard } from '../login/login-2.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

const routes: Routes = [
    {
        path     : 'jobs',
        component: JobsComponent,
        canActivate: [AuthGuard],
        resolve  : {
            jobs: JobsService
        }
    },
    {
        path     : 'jobsload',
        component: JobsLoadComponent,
        canActivate: [AuthGuard],
        resolve  : {
            newJobs: JobsService
        }
    },
    {
        path     : 'jobsform',
        component: JobsFormComponent,
        canActivate: [AuthGuard],
        resolve  : {
            jobs: JobsService
        }
    },
    {
        path     : 'jobsdetails',
        component: JobsDetailsComponent,
        canActivate: [AuthGuard],
        resolve  : {
            jobs: JobsService
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
        JobsSelectedBarComponent,
        JobsFormComponent,
        JobsDetailsComponent
    ],
    providers      : [
        JobsService
    ],
    entryComponents: [DialogComponent,JobsFormComponent]
})
export class JobsModule
{
}
