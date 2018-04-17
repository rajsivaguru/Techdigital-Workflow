import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs';
import { SharedModule } from './core/modules/shared.module';
import { MaterialModule } from './core/modules/material.module';

import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';

import { LoginModule } from './main/content/login/login.module';
import { UsersModule } from './main/content/users/users.module';
import { JobsModule } from './main/content/jobs/jobs.module';


import { RecruitersModule } from './main/content/recruiters/recruiters.module';




import { ReportsModule } from './main/content/reports/reports.module';
import { LoginComponent } from './main/content/login/login.component';

import { LoginService,AuthGuard } from './main/content/login/login.service';

import { TranslateModule } from '@ngx-translate/core';

import { LocalStorageModule } from 'angular-2-local-storage'

const appRoutes: Routes = [
    {
        path      : '**',
        component: LoginComponent
    },
    { 
        path: '', 
        component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path      : '**',
        component: LoginComponent
    }
];

@NgModule({
    declarations: [
        AppComponent
        
    ],
    imports     : [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, { useHash: true }),
        TranslateModule.forRoot(),

        LocalStorageModule.withConfig({
            prefix : 'tdw_',
            storageType : 'localStorage'


        }),

        SharedModule,
        MaterialModule,
        FuseMainModule,
        LoginModule,
        UsersModule,
        JobsModule,
        RecruitersModule,
        ReportsModule
        
        
    ],
    providers   : [
        FuseNavigationService,
        FuseSplashScreenService,
        FuseConfigService,
        AuthGuard
    ],
     exports     : [
        
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
