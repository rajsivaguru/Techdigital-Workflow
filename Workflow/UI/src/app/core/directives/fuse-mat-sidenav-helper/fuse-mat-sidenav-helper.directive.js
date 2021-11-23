"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FuseMatSidenavHelperDirective = /** @class */ (function () {
    function FuseMatSidenavHelperDirective(fuseMatSidenavService, fuseMatchMedia, observableMedia, matSidenav) {
        this.fuseMatSidenavService = fuseMatSidenavService;
        this.fuseMatchMedia = fuseMatchMedia;
        this.observableMedia = observableMedia;
        this.matSidenav = matSidenav;
        this.isLockedOpen = true;
        this.stopTransition = true;
    }
    FuseMatSidenavHelperDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.fuseMatSidenavService.setSidenav(this.id, this.matSidenav);
        if (this.observableMedia.isActive(this.matIsLockedOpenBreakpoint)) {
            setTimeout(function () {
                _this.isLockedOpen = true;
                _this.matSidenav.mode = 'side';
                _this.matSidenav.open();
            });
            this.stopTransition = false;
        }
        else {
            setTimeout(function () {
                _this.isLockedOpen = false;
                _this.matSidenav.mode = 'over';
                _this.matSidenav.close();
            });
            setTimeout(function () {
                _this.stopTransition = false;
            }, 3000);
        }
        this.matchMediaSubscription = this.fuseMatchMedia.onMediaChange.subscribe(function () {
            if (_this.observableMedia.isActive(_this.matIsLockedOpenBreakpoint)) {
                setTimeout(function () {
                    _this.isLockedOpen = true;
                    _this.matSidenav.mode = 'side';
                    _this.matSidenav.open();
                });
            }
            else {
                setTimeout(function () {
                    _this.isLockedOpen = false;
                    _this.matSidenav.mode = 'over';
                    _this.matSidenav.close();
                });
            }
        });
    };
    FuseMatSidenavHelperDirective.prototype.ngOnDestroy = function () {
        this.matchMediaSubscription.unsubscribe();
    };
    __decorate([
        core_1.HostBinding('class.mat-is-locked-open')
    ], FuseMatSidenavHelperDirective.prototype, "isLockedOpen", void 0);
    __decorate([
        core_1.HostBinding('class.mat-stop-transition')
    ], FuseMatSidenavHelperDirective.prototype, "stopTransition", void 0);
    __decorate([
        core_1.Input('fuseMatSidenavHelper')
    ], FuseMatSidenavHelperDirective.prototype, "id", void 0);
    __decorate([
        core_1.Input('mat-is-locked-open')
    ], FuseMatSidenavHelperDirective.prototype, "matIsLockedOpenBreakpoint", void 0);
    FuseMatSidenavHelperDirective = __decorate([
        core_1.Directive({
            selector: '[fuseMatSidenavHelper]'
        })
    ], FuseMatSidenavHelperDirective);
    return FuseMatSidenavHelperDirective;
}());
exports.FuseMatSidenavHelperDirective = FuseMatSidenavHelperDirective;
var FuseMatSidenavTogglerDirective = /** @class */ (function () {
    function FuseMatSidenavTogglerDirective(fuseMatSidenavService) {
        this.fuseMatSidenavService = fuseMatSidenavService;
    }
    FuseMatSidenavTogglerDirective.prototype.onClick = function () {
        this.fuseMatSidenavService.getSidenav(this.id).toggle();
    };
    __decorate([
        core_1.Input('fuseMatSidenavToggler')
    ], FuseMatSidenavTogglerDirective.prototype, "id", void 0);
    __decorate([
        core_1.HostListener('click')
    ], FuseMatSidenavTogglerDirective.prototype, "onClick", null);
    FuseMatSidenavTogglerDirective = __decorate([
        core_1.Directive({
            selector: '[fuseMatSidenavToggler]'
        })
    ], FuseMatSidenavTogglerDirective);
    return FuseMatSidenavTogglerDirective;
}());
exports.FuseMatSidenavTogglerDirective = FuseMatSidenavTogglerDirective;
