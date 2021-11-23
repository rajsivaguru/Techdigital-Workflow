import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { RecruitersComponent, InlineMessageComponent } from './recruiters.component';
import { RecruitersService } from './recruiters.service';
import { TextMaskModule } from 'angular2-text-mask';
import { DialogComponent } from '../dialog/dialog.component'
import { LoginService, AuthGuard } from '../login/login.service';

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
    declarations   : [RecruitersComponent, InlineMessageComponent],
    providers      : [RecruitersService],
    entryComponents: [InlineMessageComponent]
})
export class RecruitersModule
{
}
