"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var perfect_scrollbar_1 = require("perfect-scrollbar");
var FusePerfectScrollbarDirective = /** @class */ (function () {
    function FusePerfectScrollbarDirective(element, fuseConfig, platform) {
        var _this = this;
        this.element = element;
        this.fuseConfig = fuseConfig;
        this.platform = platform;
        this.isDisableCustomScrollbars = false;
        this.isMobile = false;
        this.isInitialized = true;
        this.onSettingsChanged =
            this.fuseConfig.onSettingsChanged
                .subscribe(function (settings) {
                _this.isDisableCustomScrollbars = !settings.customScrollbars;
            });
        if (this.platform.ANDROID || this.platform.IOS) {
            this.isMobile = true;
        }
    }
    FusePerfectScrollbarDirective.prototype.ngOnInit = function () {
        if (!this.fuseConfig.isLoginAuthenticated)
            return;
    };
    FusePerfectScrollbarDirective.prototype.ngAfterViewInit = function () {
        if (this.isMobile || this.isDisableCustomScrollbars) {
            this.isInitialized = false;
            return;
        }
        // Initialize the perfect-scrollbar
        this.ps = new perfect_scrollbar_1.default(this.element.nativeElement);
    };
    FusePerfectScrollbarDirective.prototype.ngOnDestroy = function () {
        if (!this.isInitialized) {
            return;
        }
        this.onSettingsChanged.unsubscribe();
        // Destroy the perfect-scrollbar
        this.ps.destroy();
    };
    FusePerfectScrollbarDirective.prototype.update = function () {
        if (!this.isInitialized) {
            return;
        }
        // Update the perfect-scrollbar
        this.ps.update();
    };
    FusePerfectScrollbarDirective.prototype.destroy = function () {
        this.ngOnDestroy();
    };
    FusePerfectScrollbarDirective.prototype.scrollToX = function (x, speed) {
        this.animateScrolling('scrollLeft', x, speed);
    };
    FusePerfectScrollbarDirective.prototype.scrollToY = function (y, speed) {
        this.animateScrolling('scrollTop', y, speed);
    };
    FusePerfectScrollbarDirective.prototype.scrollToTop = function (offset, speed) {
        this.animateScrolling('scrollTop', (offset || 0), speed);
    };
    FusePerfectScrollbarDirective.prototype.scrollToLeft = function (offset, speed) {
        this.animateScrolling('scrollLeft', (offset || 0), speed);
    };
    FusePerfectScrollbarDirective.prototype.scrollToRight = function (offset, speed) {
        var width = this.element.nativeElement.scrollWidth;
        this.animateScrolling('scrollLeft', width - (offset || 0), speed);
    };
    FusePerfectScrollbarDirective.prototype.scrollToBottom = function (offset, speed) {
        var height = this.element.nativeElement.scrollHeight;
        this.animateScrolling('scrollTop', height - (offset || 0), speed);
    };
    FusePerfectScrollbarDirective.prototype.animateScrolling = function (target, value, speed) {
        var _this = this;
        if (!speed) {
            this.element.nativeElement[target] = value;
            // PS has weird event sending order, this is a workaround for that
            this.update();
            this.update();
        }
        else if (value !== this.element.nativeElement[target]) {
            var newValue_1 = 0;
            var scrollCount_1 = 0;
            var oldTimestamp_1 = performance.now();
            var oldValue_1 = this.element.nativeElement[target];
            var cosParameter_1 = (oldValue_1 - value) / 2;
            var step_1 = function (newTimestamp) {
                scrollCount_1 += Math.PI / (speed / (newTimestamp - oldTimestamp_1));
                newValue_1 = Math.round(value + cosParameter_1 + cosParameter_1 * Math.cos(scrollCount_1));
                // Only continue animation if scroll position has not changed
                if (_this.element.nativeElement[target] === oldValue_1) {
                    if (scrollCount_1 >= Math.PI) {
                        _this.element.nativeElement[target] = value;
                        // PS has weird event sending order, this is a workaround for that
                        _this.update();
                        _this.update();
                    }
                    else {
                        _this.element.nativeElement[target] = oldValue_1 = newValue_1;
                        oldTimestamp_1 = newTimestamp;
                        window.requestAnimationFrame(step_1);
                    }
                }
            };
            window.requestAnimationFrame(step_1);
        }
    };
    FusePerfectScrollbarDirective = __decorate([
        core_1.Directive({
            selector: '[fusePerfectScrollbar]'
        })
    ], FusePerfectScrollbarDirective);
    return FusePerfectScrollbarDirective;
}());
exports.FusePerfectScrollbarDirective = FusePerfectScrollbarDirective;
