import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { LoginService } from './login.service';
import { LoginComponent } from './login.component';
// import { GoogleSignInComponent } from 'angular-google-signin';

const routes = [
    {
        path     : 'login',
        component: LoginComponent
    }
];

@NgModule({
    declarations: [
        LoginComponent
        //GoogleSignInComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
     entryComponents: [
        
    ],
    providers   :   [LoginService, LoginComponent]
})

export class LoginModule
{

}
