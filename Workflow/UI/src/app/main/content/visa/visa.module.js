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
var forms_1 = require("@angular/forms");
var angular2_multiselect_dropdown_1 = require("angular2-multiselect-dropdown/angular2-multiselect-dropdown");
var angular2_text_mask_1 = require("angular2-text-mask");
var auto_complete_1 = require("@ngui/auto-complete");
var datetime_picker_1 = require("@ngui/datetime-picker");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var shared_module_1 = require("../../../core/modules/shared.module");
var login_service_1 = require("../login/login.service");
var question_component_1 = require("./question/question.component");
var snackbar_service_1 = require("../dialog/snackbar.service");
var visa_service_1 = require("./visa.service");
var commonUtil_1 = require("../common/commonUtil");
var routes = [
    {
        path: 'visaquestion',
        component: question_component_1.QuestionComponent,
        canActivate: [login_service_1.AuthGuard],
        resolve: {
            questions: visa_service_1.VisaService
        }
    }
];
var VisaModule = /** @class */ (function () {
    function VisaModule() {
    }
    VisaModule = __decorate([
        core_1.NgModule({
            ////declarations: [QuestionComponent, DialogConsultantComponent],
            declarations: [question_component_1.QuestionComponent],
            imports: [
                shared_module_1.SharedModule,
                angular2_text_mask_1.TextMaskModule,
                auto_complete_1.NguiAutoCompleteModule,
                datetime_picker_1.NguiDatetimePickerModule,
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                angular2_multiselect_dropdown_1.AngularMultiSelectModule,
                http_1.HttpModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [question_component_1.QuestionComponent],
            ////entryComponents: [DialogConsultantComponent],
            entryComponents: [],
            providers: [visa_service_1.VisaService, snackbar_service_1.SnackBarService, commonUtil_1.Utilities]
        })
    ], VisaModule);
    return VisaModule;
}());
exports.VisaModule = VisaModule;
