"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var material_module_1 = require("./material.module");
var flex_layout_1 = require("@angular/flex-layout");
var ngx_color_picker_1 = require("ngx-color-picker");
var ngx_dnd_1 = require("@withinpixels/ngx-dnd");
var ngx_datatable_1 = require("@swimlane/ngx-datatable");
var fuse_mat_sidenav_helper_directive_1 = require("../directives/fuse-mat-sidenav-helper/fuse-mat-sidenav-helper.directive");
var fuse_mat_sidenav_helper_service_1 = require("../directives/fuse-mat-sidenav-helper/fuse-mat-sidenav-helper.service");
var pipes_module_1 = require("../pipes/pipes.module");
var confirm_dialog_component_1 = require("../components/confirm-dialog/confirm-dialog.component");
var countdown_component_1 = require("../components/countdown/countdown.component");
var match_media_service_1 = require("../services/match-media.service");
var navbar_vertical_service_1 = require("../../main/navbar/vertical/navbar-vertical.service");
var hljs_component_1 = require("../components/hljs/hljs.component");
var fuse_perfect_scrollbar_directive_1 = require("../directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive");
var fuse_if_on_dom_directive_1 = require("../directives/fuse-if-on-dom/fuse-if-on-dom.directive");
var translation_loader_service_1 = require("../services/translation-loader.service");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var core_2 = require("@ngx-translate/core");
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            declarations: [
                fuse_mat_sidenav_helper_directive_1.FuseMatSidenavHelperDirective,
                fuse_mat_sidenav_helper_directive_1.FuseMatSidenavTogglerDirective,
                confirm_dialog_component_1.FuseConfirmDialogComponent,
                countdown_component_1.FuseCountdownComponent,
                hljs_component_1.FuseHljsComponent,
                fuse_if_on_dom_directive_1.FuseIfOnDomDirective,
                fuse_perfect_scrollbar_directive_1.FusePerfectScrollbarDirective
            ],
            imports: [
                flex_layout_1.FlexLayoutModule,
                material_module_1.MaterialModule,
                common_1.CommonModule,
                forms_1.FormsModule,
                pipes_module_1.FusePipesModule,
                forms_1.ReactiveFormsModule,
                ngx_color_picker_1.ColorPickerModule,
                ngx_dnd_1.NgxDnDModule,
                ngx_datatable_1.NgxDatatableModule
            ],
            exports: [
                flex_layout_1.FlexLayoutModule,
                material_module_1.MaterialModule,
                common_1.CommonModule,
                forms_1.FormsModule,
                fuse_mat_sidenav_helper_directive_1.FuseMatSidenavHelperDirective,
                fuse_mat_sidenav_helper_directive_1.FuseMatSidenavTogglerDirective,
                pipes_module_1.FusePipesModule,
                countdown_component_1.FuseCountdownComponent,
                hljs_component_1.FuseHljsComponent,
                fuse_perfect_scrollbar_directive_1.FusePerfectScrollbarDirective,
                forms_1.ReactiveFormsModule,
                ngx_color_picker_1.ColorPickerModule,
                ngx_dnd_1.NgxDnDModule,
                ngx_datatable_1.NgxDatatableModule,
                fuse_if_on_dom_directive_1.FuseIfOnDomDirective,
                core_2.TranslateModule
            ],
            entryComponents: [
                confirm_dialog_component_1.FuseConfirmDialogComponent
            ],
            providers: [
                ngx_cookie_service_1.CookieService,
                match_media_service_1.FuseMatchMedia,
                navbar_vertical_service_1.FuseNavbarVerticalService,
                fuse_mat_sidenav_helper_service_1.FuseMatSidenavHelperService,
                translation_loader_service_1.FuseTranslationLoaderService
            ]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
