"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("../../../../animations");
var FuseNavHorizontalCollapseComponent = /** @class */ (function () {
    function FuseNavHorizontalCollapseComponent(fuseConfig) {
        var _this = this;
        this.fuseConfig = fuseConfig;
        this.isOpen = false;
        this.classes = 'nav-item nav-collapse';
        this.onSettingsChanged =
            this.fuseConfig.onSettingsChanged
                .subscribe(function (newSettings) {
                _this.fuseSettings = newSettings;
            });
    }
    FuseNavHorizontalCollapseComponent.prototype.open = function () {
        this.isOpen = true;
    };
    FuseNavHorizontalCollapseComponent.prototype.close = function () {
        this.isOpen = false;
    };
    FuseNavHorizontalCollapseComponent.prototype.ngOnDestroy = function () {
        this.onSettingsChanged.unsubscribe();
    };
    __decorate([
        core_1.HostBinding('class')
    ], FuseNavHorizontalCollapseComponent.prototype, "classes", void 0);
    __decorate([
        core_1.Input()
    ], FuseNavHorizontalCollapseComponent.prototype, "item", void 0);
    __decorate([
        core_1.HostListener('mouseenter')
    ], FuseNavHorizontalCollapseComponent.prototype, "open", null);
    __decorate([
        core_1.HostListener('mouseleave')
    ], FuseNavHorizontalCollapseComponent.prototype, "close", null);
    FuseNavHorizontalCollapseComponent = __decorate([
        core_1.Component({
            selector: 'fuse-nav-horizontal-collapse',
            templateUrl: './nav-horizontal-collapse.component.html',
            styleUrls: ['./nav-horizontal-collapse.component.scss'],
            animations: animations_1.fuseAnimations
        })
    ], FuseNavHorizontalCollapseComponent);
    return FuseNavHorizontalCollapseComponent;
}());
exports.FuseNavHorizontalCollapseComponent = FuseNavHorizontalCollapseComponent;
