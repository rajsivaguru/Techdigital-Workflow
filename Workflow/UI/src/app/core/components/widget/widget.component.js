"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var widget_toggle_directive_1 = require("./widget-toggle.directive");
var FuseWidgetComponent = /** @class */ (function () {
    function FuseWidgetComponent(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.flipped = false;
    }
    FuseWidgetComponent.prototype.ngOnInit = function () {
    };
    FuseWidgetComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.toggleButtons.forEach(function (flipButton) {
                _this.renderer.listen(flipButton.el.nativeElement, 'click', function () {
                    _this.toggle();
                });
            });
        });
    };
    FuseWidgetComponent.prototype.toggle = function () {
        this.flipped = !this.flipped;
    };
    __decorate([
        core_1.HostBinding('class.flipped')
    ], FuseWidgetComponent.prototype, "flipped", void 0);
    __decorate([
        core_1.ContentChildren(widget_toggle_directive_1.FuseWidgetToggleDirective, { descendants: true })
    ], FuseWidgetComponent.prototype, "toggleButtons", void 0);
    FuseWidgetComponent = __decorate([
        core_1.Component({
            selector: 'fuse-widget',
            templateUrl: './widget.component.html',
            styleUrls: ['./widget.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], FuseWidgetComponent);
    return FuseWidgetComponent;
}());
exports.FuseWidgetComponent = FuseWidgetComponent;
