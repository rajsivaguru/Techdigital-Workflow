"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FuseNavbarVerticalToggleDirective = /** @class */ (function () {
    function FuseNavbarVerticalToggleDirective(navbarService) {
        this.navbarService = navbarService;
    }
    FuseNavbarVerticalToggleDirective.prototype.onClick = function () {
        this.navbar = this.navbarService.getNavBar();
        if (!this.navbar[this.fuseNavbarVertical]) {
            return;
        }
        this.navbar[this.fuseNavbarVertical]();
    };
    __decorate([
        core_1.Input()
    ], FuseNavbarVerticalToggleDirective.prototype, "fuseNavbarVertical", void 0);
    __decorate([
        core_1.HostListener('click')
    ], FuseNavbarVerticalToggleDirective.prototype, "onClick", null);
    FuseNavbarVerticalToggleDirective = __decorate([
        core_1.Directive({
            selector: '[fuseNavbarVertical]'
        })
    ], FuseNavbarVerticalToggleDirective);
    return FuseNavbarVerticalToggleDirective;
}());
exports.FuseNavbarVerticalToggleDirective = FuseNavbarVerticalToggleDirective;
