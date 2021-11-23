"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var http_2 = require("@angular/common/http");
var animations_1 = require("@angular/platform-browser/animations");
var router_1 = require("@angular/router");
require("hammerjs");
var shared_module_1 = require("./core/modules/shared.module");
var material_module_1 = require("./core/modules/material.module");
var app_component_1 = require("./app.component");
var main_module_1 = require("./main/main.module");
var splash_screen_service_1 = require("./core/services/splash-screen.service");
var config_service_1 = require("./core/services/config.service");
var navigation_service_1 = require("./core/components/navigation/navigation.service");
var login_module_1 = require("./main/content/login/login.module");
var common_module_1 = require("./main/content/common/common.module");
var users_module_1 = require("./main/content/users/users.module");
var jobs_module_1 = require("./main/content/jobs/jobs.module");
var recruiters_module_1 = require("./main/content/recruiters/recruiters.module");
var reports_module_1 = require("./main/content/reports/reports.module");
var visa_module_1 = require("./main/content/visa/visa.module");
var search_module_1 = require("./main/content/search/search.module");
var note_module_1 = require("./main/content/note/note.module");
var email_module_1 = require("./main/content/email/email.module");
var accounts_module_1 = require("./main/content/accounts/accounts.module");
var punchtime_module_1 = require("./main/content/punchtime/punchtime.module");
var login_component_1 = require("./main/content/login/login.component");
var login_service_1 = require("./main/content/login/login.service");
var core_2 = require("@ngx-translate/core");
var angular_2_local_storage_1 = require("angular-2-local-storage");
var appRoutes = [
    {
        path: '**',
        component: login_component_1.LoginComponent
    },
    {
        path: '',
        component: login_component_1.LoginComponent,
        pathMatch: 'full'
    },
    {
        path: '**',
        component: login_component_1.LoginComponent
    }
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                http_2.HttpClientModule,
                animations_1.BrowserAnimationsModule,
                router_1.RouterModule.forRoot(appRoutes, { useHash: true }),
                core_2.TranslateModule.forRoot(),
                angular_2_local_storage_1.LocalStorageModule.withConfig({
                    prefix: 'tdw_',
                    storageType: 'localStorage'
                }),
                shared_module_1.SharedModule,
                material_module_1.MaterialModule,
                main_module_1.FuseMainModule,
                common_module_1.CommonModule,
                login_module_1.LoginModule,
                users_module_1.UsersModule,
                jobs_module_1.JobsModule,
                recruiters_module_1.RecruitersModule,
                reports_module_1.ReportsModule,
                visa_module_1.VisaModule,
                search_module_1.SearchModule,
                note_module_1.NoteModule,
                email_module_1.EmailModule,
                accounts_module_1.AccountsModule,
                punchtime_module_1.PunchTimeModule
            ],
            providers: [
                navigation_service_1.FuseNavigationService,
                splash_screen_service_1.FuseSplashScreenService,
                config_service_1.FuseConfigService,
                login_service_1.AuthGuard
            ],
            exports: [],
            bootstrap: [
                app_component_1.AppComponent
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
