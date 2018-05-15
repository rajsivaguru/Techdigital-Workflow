"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var FuseMainComponent = /** @class */ (function () {
    function FuseMainComponent(_renderer, _elementRef, fuseConfig, platform, document) {
        var _this = this;
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.fuseConfig = fuseConfig;
        this.platform = platform;
        this.document = document;
        this.onSettingsChanged =
            this.fuseConfig.onSettingsChanged
                .subscribe(function (newSettings) {
                _this.fuseSettings = newSettings;
                _this.layoutMode = _this.fuseSettings.layout.mode;
            });
        if (this.platform.ANDROID || this.platform.IOS) {
            this.document.body.className += ' is-mobile';
        }
    }
    FuseMainComponent.prototype.ngOnInit = function () {
    };
    FuseMainComponent.prototype.ngOnDestroy = function () {
        this.onSettingsChanged.unsubscribe();
    };
    FuseMainComponent.prototype.addClass = function (className) {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    };
    FuseMainComponent.prototype.removeClass = function (className) {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    };
    __decorate([
        core_1.HostBinding('attr.fuse-layout-mode')
    ], FuseMainComponent.prototype, "layoutMode", void 0);
    FuseMainComponent = __decorate([
        core_1.Component({
            selector: 'fuse-main',
            templateUrl: './main.component.html',
            styleUrls: ['./main.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(4, core_1.Inject(common_1.DOCUMENT))
    ], FuseMainComponent);
    return FuseMainComponent;
}());
exports.FuseMainComponent = FuseMainComponent;
