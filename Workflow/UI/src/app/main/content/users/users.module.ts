import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { FuseContactsContactListComponent } from './users-list/users-list.component';
import { FuseContactsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { TextMaskModule } from 'angular2-text-mask';
import { DialogComponent } from '../dialog/dialog.component'
import { Login2Service,AuthGuard } from '../login/login-2.service';
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
        FuseContactsContactListComponent,
        FuseContactsSelectedBarComponent,
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
