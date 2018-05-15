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
var animations_1 = require("../../core/animations");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/map");
var FuseContentComponent = /** @class */ (function () {
    function FuseContentComponent(router, activatedRoute, fuseConfig) {
        var _this = this;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.fuseConfig = fuseConfig;
        this.routeAnimationUp = false;
        this.routeAnimationDown = false;
        this.routeAnimationRight = false;
        this.routeAnimationLeft = false;
        this.routeAnimationFade = false;
        this.router.events
            .filter(function (event) { return event instanceof router_1.NavigationEnd; })
            .map(function () { return _this.activatedRoute; })
            .subscribe(function (event) {
            switch (_this.fuseSettings.routerAnimation) {
                case 'fadeIn':
                    _this.routeAnimationFade = !_this.routeAnimationFade;
                    break;
                case 'slideUp':
                    _this.routeAnimationUp = !_this.routeAnimationUp;
                    break;
                case 'slideDown':
                    _this.routeAnimationDown = !_this.routeAnimationDown;
                    break;
                case 'slideRight':
                    _this.routeAnimationRight = !_this.routeAnimationRight;
                    break;
                case 'slideLeft':
                    _this.routeAnimationLeft = !_this.routeAnimationLeft;
                    break;
            }
        });
        this.onSettingsChanged =
            this.fuseConfig.onSettingsChanged
                .subscribe(function (newSettings) {
                _this.fuseSettings = newSettings;
            });
    }
    FuseContentComponent.prototype.ngOnInit = function () {
    };
    FuseContentComponent.prototype.ngOnDestroy = function () {
        this.onSettingsChanged.unsubscribe();
    };
    __decorate([
        core_1.HostBinding('@routerTransitionUp')
    ], FuseContentComponent.prototype, "routeAnimationUp", void 0);
    __decorate([
        core_1.HostBinding('@routerTransitionDown')
    ], FuseContentComponent.prototype, "routeAnimationDown", void 0);
    __decorate([
        core_1.HostBinding('@routerTransitionRight')
    ], FuseContentComponent.prototype, "routeAnimationRight", void 0);
    __decorate([
        core_1.HostBinding('@routerTransitionLeft')
    ], FuseContentComponent.prototype, "routeAnimationLeft", void 0);
    __decorate([
        core_1.HostBinding('@routerTransitionFade')
    ], FuseContentComponent.prototype, "routeAnimationFade", void 0);
    FuseContentComponent = __decorate([
        core_1.Component({
            selector: 'fuse-content',
            templateUrl: './content.component.html',
            styleUrls: ['./content.component.scss'],
            animations: animations_1.fuseAnimations
        })
    ], FuseContentComponent);
    return FuseContentComponent;
}());
exports.FuseContentComponent = FuseContentComponent;
