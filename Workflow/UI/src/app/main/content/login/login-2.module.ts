import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { Login2Service } from './login-2.service';
import { FuseLogin2Component } from './login-2.component';
import { GoogleSignInComponent } from 'angular-google-signin';

const routes = [
    {
        path     : 'login',
        component: FuseLogin2Component
    }
];

@NgModule({
    declarations: [
        FuseLogin2Component,
        GoogleSignInComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
     entryComponents: [
        
    ],
    providers   :   [Login2Service, FuseLogin2Component]
})

export class Login2Module
{

}
