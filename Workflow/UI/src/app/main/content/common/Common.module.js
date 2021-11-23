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
var customer_vendor_component_1 = require(".//customer-vendor/customer-vendor.component");
var common_service_1 = require("./common.service");
var dialog_component_1 = require("../dialog/dialog.component");
var login_service_1 = require("../login/login.service");
var routes = [
    {
        path: 'customervendors',
        component: customer_vendor_component_1.CustomerVendorComponent,
        canActivate: [login_service_1.AuthGuard],
        resolve: {
            consultants: common_service_1.CommonService
        }
    }
];
var CommonModule = /** @class */ (function () {
    function CommonModule() {
    }
    CommonModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule,
                auto_complete_1.NguiAutoCompleteModule,
                datetime_picker_1.NguiDatetimePickerModule,
                router_1.RouterModule.forChild(routes)
            ],
            declarations: [
                customer_vendor_component_1.CustomerVendorComponent
            ],
            providers: [
                common_service_1.CommonService
            ],
            entryComponents: [dialog_component_1.DialogComponent]
        })
    ], CommonModule);
    return CommonModule;
}());
exports.CommonModule = CommonModule;
