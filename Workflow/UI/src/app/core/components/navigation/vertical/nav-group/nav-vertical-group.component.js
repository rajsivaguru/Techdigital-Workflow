"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FuseNavVerticalGroupComponent = /** @class */ (function () {
    function FuseNavVerticalGroupComponent() {
        this.classes = 'nav-group nav-item';
    }
    FuseNavVerticalGroupComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.HostBinding('class')
    ], FuseNavVerticalGroupComponent.prototype, "classes", void 0);
    __decorate([
        core_1.Input()
    ], FuseNavVerticalGroupComponent.prototype, "item", void 0);
    FuseNavVerticalGroupComponent = __decorate([
        core_1.Component({
            selector: 'fuse-nav-vertical-group',
            templateUrl: './nav-vertical-group.component.html',
            styleUrls: ['./nav-vertical-group.component.scss']
        })
    ], FuseNavVerticalGroupComponent);
    return FuseNavVerticalGroupComponent;
}());
exports.FuseNavVerticalGroupComponent = FuseNavVerticalGroupComponent;
