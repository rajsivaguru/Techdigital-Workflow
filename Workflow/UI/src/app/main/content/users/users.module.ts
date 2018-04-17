import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { UserListComponent } from './users-list/users-list.component';

import { UsersFormComponent } from './users-form/users-form.component';
import { TextMaskModule } from 'angular2-text-mask';
import { DialogComponent } from '../dialog/dialog.component'
import { LoginService,AuthGuard } from '../login/login.service';
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
        path     : 'usersform',
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
    providers      : [
        UsersService
    ],
    entryComponents: [DialogComponent,UsersFormComponent]
})
export class UsersModule
{
}
