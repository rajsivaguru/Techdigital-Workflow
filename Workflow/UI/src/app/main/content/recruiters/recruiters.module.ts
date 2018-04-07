import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { RecruitersComponent } from './recruiters.component';
import { RecruitersService } from './recruiters.service';
import { TextMaskModule } from 'angular2-text-mask';
import { DialogComponent } from '../dialog/dialog.component'
import { Login2Service,AuthGuard } from '../login/login-2.service';
const routes: Routes = [
    {
        path     : 'myjobs',
        component: RecruitersComponent,
        canActivate: [AuthGuard],
        resolve  : {
            recuriterJobs : RecruitersService
        }
    }
];

@NgModule({
    imports        : [
        SharedModule,
        TextMaskModule,
        RouterModule.forChild(routes)
    ],
    declarations   : [
        RecruitersComponent

    ],
    providers      : [
        RecruitersService
    ],
    entryComponents: []
})
export class RecruitersModule
{
}
