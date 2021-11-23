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
var animations_1 = require("@angular/animations");
var router_1 = require("@angular/router");
var FuseSplashScreenService = /** @class */ (function () {
    function FuseSplashScreenService(animationBuilder, document, router) {
        var _this = this;
        this.animationBuilder = animationBuilder;
        this.document = document;
        this.router = router;
        this.splashScreenEl = this.document.body.querySelector('#fuse-splash-screen');
        var hideOnLoad = this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
                setTimeout(function () {
                    _this.hide();
                    hideOnLoad.unsubscribe();
                }, 0);
            }
        });
    }
    FuseSplashScreenService.prototype.show = function () {
        var _this = this;
        this.player =
            this.animationBuilder
                .build([
                animations_1.style({
                    opacity: '0',
                    zIndex: '99999'
                }),
                animations_1.animate('400ms ease', animations_1.style({ opacity: '1' }))
            ]).create(this.splashScreenEl);
        setTimeout(function () {
            _this.player.play();
        }, 0);
    };
    FuseSplashScreenService.prototype.hide = function () {
        var _this = this;
        this.player =
            this.animationBuilder
                .build([
                animations_1.style({ opacity: '1' }),
                animations_1.animate('400ms ease', animations_1.style({
                    opacity: '0',
                    zIndex: '-10'
                }))
            ]).create(this.splashScreenEl);
        setTimeout(function () {
            _this.player.play();
        }, 0);
    };
    FuseSplashScreenService = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Inject(common_1.DOCUMENT))
    ], FuseSplashScreenService);
    return FuseSplashScreenService;
}());
exports.FuseSplashScreenService = FuseSplashScreenService;
