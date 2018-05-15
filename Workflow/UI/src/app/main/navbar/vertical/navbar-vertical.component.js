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
var fuse_perfect_scrollbar_directive_1 = require("../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive");
var animations_1 = require("@angular/animations");
var FuseNavbarVerticalComponent = /** @class */ (function () {
    function FuseNavbarVerticalComponent(fuseMainComponent, fuseMatchMedia, fuseNavigationService, navBarService, router, _renderer, _elementRef, animationBuilder, media) {
        var _this = this;
        this.fuseMainComponent = fuseMainComponent;
        this.fuseMatchMedia = fuseMatchMedia;
        this.fuseNavigationService = fuseNavigationService;
        this.navBarService = navBarService;
        this.router = router;
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.animationBuilder = animationBuilder;
        this.media = media;
        this._backdropElement = null;
        this._folded = false;
        navBarService.setNavBar(this);
        this.navigationServiceWatcher =
            this.fuseNavigationService.onNavCollapseToggle.subscribe(function () {
                _this.fusePerfectScrollbarUpdateTimeout = setTimeout(function () {
                    _this.fusePerfectScrollbarDirective.update();
                }, 310);
            });
        this.matchMediaWatcher =
            this.fuseMatchMedia.onMediaChange
                .subscribe(function (mediaStep) {
                setTimeout(function () {
                    if (_this.media.isActive('lt-lg')) {
                        _this.closeBar();
                        _this.deActivateFolded();
                    }
                    else {
                        _this.openBar();
                        _this._detachBackdrop();
                    }
                });
            });
        router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
                if (_this.media.isActive('lt-lg')) {
                    setTimeout(function () {
                        _this.closeBar();
                    });
                }
            }
        });
    }
    Object.defineProperty(FuseNavbarVerticalComponent.prototype, "folded", {
        get: function () {
            return this._folded;
        },
        set: function (value) {
            this._folded = value;
            if (this._folded) {
                this.activateFolded();
            }
            else {
                this.deActivateFolded();
            }
        },
        enumerable: true,
        configurable: true
    });
    FuseNavbarVerticalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isClosed = false;
        this.isFoldedActive = this._folded;
        this.isFoldedOpen = false;
        this.initialized = false;
        this.updateCssClasses();
        setTimeout(function () {
            _this.initialized = true;
        });
        if (this.media.isActive('lt-lg')) {
            this.closeBar();
            this.deActivateFolded();
        }
        else {
            if (!this._folded) {
                this.deActivateFolded();
            }
            else {
                this.activateFolded();
            }
        }
    };
    FuseNavbarVerticalComponent.prototype.ngOnDestroy = function () {
        clearTimeout(this.fusePerfectScrollbarUpdateTimeout);
        this.matchMediaWatcher.unsubscribe();
        this.navigationServiceWatcher.unsubscribe();
    };
    FuseNavbarVerticalComponent.prototype.openBar = function () {
        if (!this.isClosed) {
            return;
        }
        this.isClosed = false;
        this.updateCssClasses();
        if (this.media.isActive('lt-lg')) {
            this._attachBackdrop();
        }
    };
    FuseNavbarVerticalComponent.prototype.closeBar = function () {
        if (this.isClosed) {
            return;
        }
        this.isClosed = true;
        this.updateCssClasses();
        this._detachBackdrop();
    };
    FuseNavbarVerticalComponent.prototype.toggleBar = function () {
        if (this.isClosed) {
            this.openBar();
        }
        else {
            this.closeBar();
        }
    };
    FuseNavbarVerticalComponent.prototype.toggleFold = function () {
        if (!this.isFoldedActive) {
            this.activateFolded();
        }
        else {
            this.deActivateFolded();
        }
    };
    FuseNavbarVerticalComponent.prototype.activateFolded = function () {
        this.isFoldedActive = true;
        this.fuseMainComponent.addClass('fuse-nav-bar-folded');
        this.isFoldedOpen = false;
    };
    FuseNavbarVerticalComponent.prototype.deActivateFolded = function () {
        this.isFoldedActive = false;
        this.fuseMainComponent.removeClass('fuse-nav-bar-folded');
        this.isFoldedOpen = false;
    };
    FuseNavbarVerticalComponent.prototype.onMouseEnter = function () {
        this.isFoldedOpen = true;
    };
    FuseNavbarVerticalComponent.prototype.onMouseLeave = function () {
        this.isFoldedOpen = false;
    };
    FuseNavbarVerticalComponent.prototype.updateCssClasses = function () {
        if (!this.isClosed) {
            this.fuseMainComponent.addClass('fuse-navbar-opened');
            this.fuseMainComponent.removeClass('fuse-navbar-closed');
        }
        else {
            this.fuseMainComponent.addClass('fuse-navbar-closed');
            this.fuseMainComponent.removeClass('fuse-navbar-opened');
        }
    };
    FuseNavbarVerticalComponent.prototype._attachBackdrop = function () {
        var _this = this;
        this._backdropElement = this._renderer.createElement('div');
        this._backdropElement.classList.add('fuse-navbar-backdrop');
        this._renderer.appendChild(this._elementRef.nativeElement.parentElement, this._backdropElement);
        this.player =
            this.animationBuilder
                .build([
                animations_1.animate('400ms ease', animations_1.style({ opacity: 1 }))
            ]).create(this._backdropElement);
        this.player.play();
        this._backdropElement.addEventListener('click', function () {
            _this.closeBar();
        });
    };
    FuseNavbarVerticalComponent.prototype._detachBackdrop = function () {
        var _this = this;
        if (this._backdropElement) {
            this.player =
                this.animationBuilder
                    .build([
                    animations_1.animate('400ms cubic-bezier(.25,.8,.25,1)', animations_1.style({ opacity: 0 }))
                ]).create(this._backdropElement);
            this.player.play();
            this.player.onDone(function () {
                if (_this._backdropElement) {
                    _this._backdropElement.parentNode.removeChild(_this._backdropElement);
                    _this._backdropElement = null;
                }
            });
        }
    };
    __decorate([
        core_1.HostBinding('class.close')
    ], FuseNavbarVerticalComponent.prototype, "isClosed", void 0);
    __decorate([
        core_1.HostBinding('class.folded')
    ], FuseNavbarVerticalComponent.prototype, "isFoldedActive", void 0);
    __decorate([
        core_1.HostBinding('class.folded-open')
    ], FuseNavbarVerticalComponent.prototype, "isFoldedOpen", void 0);
    __decorate([
        core_1.HostBinding('class.initialized')
    ], FuseNavbarVerticalComponent.prototype, "initialized", void 0);
    __decorate([
        core_1.ViewChild(fuse_perfect_scrollbar_directive_1.FusePerfectScrollbarDirective)
    ], FuseNavbarVerticalComponent.prototype, "fusePerfectScrollbarDirective", void 0);
    __decorate([
        core_1.Input()
    ], FuseNavbarVerticalComponent.prototype, "folded", null);
    __decorate([
        core_1.HostListener('mouseenter')
    ], FuseNavbarVerticalComponent.prototype, "onMouseEnter", null);
    __decorate([
        core_1.HostListener('mouseleave')
    ], FuseNavbarVerticalComponent.prototype, "onMouseLeave", null);
    FuseNavbarVerticalComponent = __decorate([
        core_1.Component({
            selector: 'fuse-navbar-vertical',
            templateUrl: './navbar-vertical.component.html',
            styleUrls: ['./navbar-vertical.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], FuseNavbarVerticalComponent);
    return FuseNavbarVerticalComponent;
}());
exports.FuseNavbarVerticalComponent = FuseNavbarVerticalComponent;
