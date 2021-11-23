"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FuseNavigationComponent = /** @class */ (function () {
    function FuseNavigationComponent(fuseNavigationService) {
        var _this = this;
        this.fuseNavigationService = fuseNavigationService;
        this.layout = 'vertical';
        this.navigationModelChangeSubscription =
            this.fuseNavigationService.onNavigationModelChange
                .subscribe(function (navigationModel) {
                //console.log('nav...')
                _this.navigationModel = navigationModel;
            });
    }
    FuseNavigationComponent.prototype.ngOnDestroy = function () {
        this.navigationModelChangeSubscription.unsubscribe();
    };
    __decorate([
        core_1.Input('layout')
    ], FuseNavigationComponent.prototype, "layout", void 0);
    FuseNavigationComponent = __decorate([
        core_1.Component({
            selector: 'fuse-navigation',
            templateUrl: './navigation.component.html',
            styleUrls: ['./navigation.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], FuseNavigationComponent);
    return FuseNavigationComponent;
}());
exports.FuseNavigationComponent = FuseNavigationComponent;
