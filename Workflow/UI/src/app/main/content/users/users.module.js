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
var users_component_1 = require("./users.component");
var users_service_1 = require("./users.service");
var users_list_component_1 = require("./users-list/users-list.component");
var users_form_component_1 = require("./users-form/users-form.component");
var angular2_text_mask_1 = require("angular2-text-mask");
var dialog_component_1 = require("../dialog/dialog.component");
var login_service_1 = require("../login/login.service");
var routes = [
    {
        path: 'users',
        component: users_component_1.UsersComponent,
        canActivate: [login_service_1.AuthGuard],
        resolve: {
            contacts: users_service_1.UsersService
        }
    },
    {
        path: 'usersform',
        component: users_form_component_1.UsersFormComponent,
        canActivate: [login_service_1.AuthGuard],
        resolve: {
            contacts: users_service_1.UsersService
        }
    }
];
var UsersModule = /** @class */ (function () {
    function UsersModule() {
    }
    UsersModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule,
                angular2_text_mask_1.TextMaskModule,
                router_1.RouterModule.forChild(routes)
            ],
            declarations: [
                users_component_1.UsersComponent,
                users_list_component_1.UserListComponent,
                users_form_component_1.UsersFormComponent,
                dialog_component_1.DialogComponent
            ],
            providers: [
                users_service_1.UsersService
            ],
            entryComponents: [dialog_component_1.DialogComponent, users_form_component_1.UsersFormComponent]
        })
    ], UsersModule);
    return UsersModule;
}());
exports.UsersModule = UsersModule;
