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

import { ProjectModule } from './main/content/dashboards/project/project.module';
import { Login2Module } from './main/content/login/login-2.module';
import { UsersModule } from './main/content/users/users.module';
import { JobsModule } from './main/content/jobs/jobs.module';

import { RecruitersModule } from './main/content/recruiters/recruiters.module';



import { NotificationModule } from './main/content/notification/notification.module';

import { ReportsModule } from './main/content/reports/reports.module';
import { FuseLogin2Component } from './main/content/login/login-2.component';

import { Login2Service,AuthGuard } from './main/content/login/login-2.service';

import { TranslateModule } from '@ngx-translate/core';

const appRoutes: Routes = [
    {
        path      : '**',
        component: FuseLogin2Component
    },
    { 
        path: '', 
        component: FuseLogin2Component,
        pathMatch: 'full'
    },
    {
        path      : '**',
        component: FuseLogin2Component
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
        SharedModule,
        MaterialModule,
        FuseMainModule,
        ProjectModule,
        Login2Module,
        UsersModule,
        JobsModule,
        RecruitersModule,
        NotificationModule,
        ReportsModule
        
        
    ],
    providers   : [
        FuseSplashScreenService,
        FuseConfigService,
        FuseNavigationService,
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
