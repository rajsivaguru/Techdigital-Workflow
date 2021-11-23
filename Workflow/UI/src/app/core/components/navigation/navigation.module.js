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
var router_1 = require("@angular/router");
var navigation_component_1 = require("./navigation.component");
var nav_vertical_item_component_1 = require("./vertical/nav-item/nav-vertical-item.component");
var nav_vertical_collapse_component_1 = require("./vertical/nav-collapse/nav-vertical-collapse.component");
var nav_vertical_group_component_1 = require("./vertical/nav-group/nav-vertical-group.component");
var nav_horizontal_item_component_1 = require("./horizontal/nav-item/nav-horizontal-item.component");
var nav_horizontal_collapse_component_1 = require("./horizontal/nav-collapse/nav-horizontal-collapse.component");
var FuseNavigationModule = /** @class */ (function () {
    function FuseNavigationModule() {
    }
    FuseNavigationModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule,
                router_1.RouterModule
            ],
            exports: [
                navigation_component_1.FuseNavigationComponent
            ],
            declarations: [
                navigation_component_1.FuseNavigationComponent,
                nav_vertical_group_component_1.FuseNavVerticalGroupComponent,
                nav_vertical_item_component_1.FuseNavVerticalItemComponent,
                nav_vertical_collapse_component_1.FuseNavVerticalCollapseComponent,
                nav_horizontal_item_component_1.FuseNavHorizontalItemComponent,
                nav_horizontal_collapse_component_1.FuseNavHorizontalCollapseComponent
            ]
        })
    ], FuseNavigationModule);
    return FuseNavigationModule;
}());
exports.FuseNavigationModule = FuseNavigationModule;
