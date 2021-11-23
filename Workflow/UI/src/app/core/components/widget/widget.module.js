"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var shared_module_1 = require("../../modules/shared.module");
var widget_component_1 = require("./widget.component");
var widget_toggle_directive_1 = require("./widget-toggle.directive");
var FuseWidgetModule = /** @class */ (function () {
    function FuseWidgetModule() {
    }
    FuseWidgetModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule
            ],
            exports: [
                widget_component_1.FuseWidgetComponent,
                widget_toggle_directive_1.FuseWidgetToggleDirective
            ],
            declarations: [
                widget_component_1.FuseWidgetComponent,
                widget_toggle_directive_1.FuseWidgetToggleDirective
            ]
        })
    ], FuseWidgetModule);
    return FuseWidgetModule;
}());
exports.FuseWidgetModule = FuseWidgetModule;
