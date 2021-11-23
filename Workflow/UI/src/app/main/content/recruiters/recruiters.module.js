"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var shared_module_1 = require("../../../core/modules/shared.module");
var router_1 = require("@angular/router");
var recruiters_component_1 = require("./recruiters.component");
var recruiters_service_1 = require("./recruiters.service");
var angular2_text_mask_1 = require("angular2-text-mask");
var login_service_1 = require("../login/login.service");
var routes = [
    {
        path: 'myjobs',
        component: recruiters_component_1.RecruitersComponent,
        canActivate: [login_service_1.AuthGuard],
        resolve: {
            recuriterJobs: recruiters_service_1.RecruitersService
        }
    }
];
var RecruitersModule = /** @class */ (function () {
    function RecruitersModule() {
    }
    RecruitersModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule,
                angular2_text_mask_1.TextMaskModule,
                router_1.RouterModule.forChild(routes)
            ],
            declarations: [recruiters_component_1.RecruitersComponent, recruiters_component_1.InlineMessageComponent],
            providers: [recruiters_service_1.RecruitersService],
            entryComponents: [recruiters_component_1.InlineMessageComponent]
        })
    ], RecruitersModule);
    return RecruitersModule;
}());
exports.RecruitersModule = RecruitersModule;
