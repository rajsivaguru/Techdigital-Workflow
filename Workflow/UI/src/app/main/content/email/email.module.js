"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var auto_complete_1 = require("@ngui/auto-complete");
var datetime_picker_1 = require("@ngui/datetime-picker");
var shared_module_1 = require("../../../core/modules/shared.module");
var email_service_1 = require("./email.service");
var composeemail_component_1 = require("./compose/composeemail.component");
var dialog_component_1 = require("../dialog/dialog.component");
var snackbar_service_1 = require("../dialog/snackbar.service");
var login_service_1 = require("../login/login.service");
var angular2_multiselect_dropdown_1 = require("angular2-multiselect-dropdown/angular2-multiselect-dropdown");
var routes = [
    {
        path: 'composeemail',
        component: composeemail_component_1.ComposeEmailComponent,
        canActivate: [login_service_1.AuthGuard],
        resolve: {
            newJobs: email_service_1.EmailService
        }
    }
];
var EmailModule = /** @class */ (function () {
    function EmailModule() {
    }
    EmailModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule,
                auto_complete_1.NguiAutoCompleteModule,
                datetime_picker_1.NguiDatetimePickerModule,
                angular2_multiselect_dropdown_1.AngularMultiSelectModule,
                router_1.RouterModule.forChild(routes)
            ],
            declarations: [
                composeemail_component_1.ComposeEmailComponent
            ],
            providers: [
                email_service_1.EmailService, snackbar_service_1.SnackBarService
            ],
            entryComponents: [dialog_component_1.DialogComponent]
        })
    ], EmailModule);
    return EmailModule;
}());
exports.EmailModule = EmailModule;
