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
var shared_module_1 = require("../core/modules/shared.module");
var main_component_1 = require("./main.component");
var content_component_1 = require("./content/content.component");
var footer_component_1 = require("./footer/footer.component");
var navbar_vertical_component_1 = require("./navbar/vertical/navbar-vertical.component");
var toolbar_component_1 = require("./toolbar/toolbar.component");
var navigation_module_1 = require("../core/components/navigation/navigation.module");
var navbar_vertical_toggle_directive_1 = require("./navbar/vertical/navbar-vertical-toggle.directive");
var FuseMainModule = /** @class */ (function () {
    function FuseMainModule() {
    }
    FuseMainModule = __decorate([
        core_1.NgModule({
            declarations: [
                content_component_1.FuseContentComponent,
                footer_component_1.FuseFooterComponent,
                main_component_1.FuseMainComponent,
                navbar_vertical_component_1.FuseNavbarVerticalComponent,
                toolbar_component_1.FuseToolbarComponent,
                navbar_vertical_toggle_directive_1.FuseNavbarVerticalToggleDirective
            ],
            imports: [
                shared_module_1.SharedModule,
                router_1.RouterModule,
                navigation_module_1.FuseNavigationModule
            ],
            exports: [
                main_component_1.FuseMainComponent
            ]
        })
    ], FuseMainModule);
    return FuseMainModule;
}());
exports.FuseMainModule = FuseMainModule;
