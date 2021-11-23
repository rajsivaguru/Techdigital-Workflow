import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule } from '../../../core/modules/shared.module';

import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { UserListComponent } from './users-list/users-list.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { DialogComponent } from '../dialog/dialog.component'
import { LoginService, AuthGuard } from '../login/login.service';
import { SnackBarService } from '../dialog/snackbar.service';
import { Utilities } from '../common/commonUtil';

const routes: Routes = [
    {
        path     : 'users',
        component: UsersComponent,
        canActivate: [AuthGuard],
        resolve  : {
            contacts: UsersService
        }
    },
    {
        path     : 'user',
        component: UsersFormComponent,
        canActivate: [AuthGuard],
        resolve  : {
            contacts: UsersService
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
        UsersComponent,
        UserListComponent,        
        UsersFormComponent,
        DialogComponent
    ],
    providers: [UsersService, SnackBarService, Utilities ],
    entryComponents: [DialogComponent,UsersFormComponent]
})
export class UsersModule
{
}
