import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { SharedModule } from '../../../core/modules/shared.module';

import { JobsService } from './jobs.service';
import { JobsLoadComponent } from './jobs-load/jobs-load.component';
import { JobsClientComponent } from './jobs-client/jobs-client.component';
import { JobsPrioritizeComponent, JobsPrioritizedComponent } from './jobs-prioritize/jobs-prioritize.component';
import { DialogComponent, DialogDataComponent } from '../dialog/dialog.component'
import { SnackBarService } from '../dialog/snackbar.service'
import { AuthGuard } from '../login/login.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

const routes: Routes = [
    {
        path     : 'jobs',
        component: JobsLoadComponent,
        canActivate: [AuthGuard],
        resolve  : {
            newJobs: JobsService
        }
    }
    ,{
        path     : 'clients',
        component: JobsClientComponent,
        canActivate: [AuthGuard],
        resolve  : {
            newJobs: JobsService
        }
    }
    ,{
        path: 'prioritizejob',
        component: JobsPrioritizeComponent,
        canActivate: [AuthGuard],
        resolve: {
            newJobs: JobsService
        }
    }
    , {
        path: 'priorityjobs',
        component: JobsPrioritizedComponent,
        canActivate: [AuthGuard],
        resolve: {
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
        JobsLoadComponent,
        JobsClientComponent,
        JobsPrioritizeComponent,
        JobsPrioritizedComponent,
        DialogDataComponent
    ],
    providers      : [
        JobsService, SnackBarService
    ],
    entryComponents: [DialogComponent, DialogDataComponent, JobsPrioritizeComponent]
})

export class JobsModule
{
}
