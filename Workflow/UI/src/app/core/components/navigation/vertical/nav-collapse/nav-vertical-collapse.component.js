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
var animations_1 = require("../../../../animations");
var FuseNavVerticalCollapseComponent = /** @class */ (function () {
    function FuseNavVerticalCollapseComponent(navigationService, router) {
        var _this = this;
        this.navigationService = navigationService;
        this.router = router;
        this.classes = 'nav-collapse nav-item';
        this.isOpen = false;
        // Listen for route changes
        router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
                // Check if the url can be found in
                // one of the children of this item
                if (_this.isUrlInChildren(_this.item, event.urlAfterRedirects)) {
                    _this.expand();
                }
                else {
                    _this.collapse();
                }
            }
        });
        // Listen for collapsing of any navigation item
        this.navigationService.onNavCollapseToggled
            .subscribe(function (clickedItem) {
            if (clickedItem && clickedItem.children) {
                // Check if the clicked item is one
                // of the children of this item
                if (_this.isChildrenOf(_this.item, clickedItem)) {
                    return;
                }
                // Check if the url can be found in
                // one of the children of this item
                if (_this.isUrlInChildren(_this.item, _this.router.url)) {
                    return;
                }
                // If the clicked item is not this item, collapse...
                if (_this.item !== clickedItem) {
                    _this.collapse();
                }
            }
        });
    }
    /**
     * Toggle collapse
     *
     * @param ev
     */
    FuseNavVerticalCollapseComponent.prototype.toggleOpen = function (ev) {
        ev.preventDefault();
        this.isOpen = !this.isOpen;
        // Navigation collapse toggled...
        this.navigationService.onNavCollapseToggled.emit(this.item);
        this.navigationService.onNavCollapseToggle.emit();
    };
    /**
     * Expand the collapsable navigation
     */
    FuseNavVerticalCollapseComponent.prototype.expand = function () {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        this.navigationService.onNavCollapseToggle.emit();
    };
    /**
     * Collapse the collapsable navigation
     */
    FuseNavVerticalCollapseComponent.prototype.collapse = function () {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.navigationService.onNavCollapseToggle.emit();
    };
    /**
     * Check if the given parent has the
     * given item in one of its children
     *
     * @param parent
     * @param item
     * @return {any}
     */
    FuseNavVerticalCollapseComponent.prototype.isChildrenOf = function (parent, item) {
        if (!parent.children) {
            return false;
        }
        if (parent.children.indexOf(item) !== -1) {
            return true;
        }
        for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
            var children = _a[_i];
            if (children.children) {
                return this.isChildrenOf(children, item);
            }
        }
    };
    /**
     * Check if the given url can be found
     * in one of the given parent's children
     *
     * @param parent
     * @param url
     * @returns {any}
     */
    FuseNavVerticalCollapseComponent.prototype.isUrlInChildren = function (parent, url) {
        if (!parent.children) {
            return false;
        }
        for (var i = 0; i < parent.children.length; i++) {
            if (parent.children[i].children) {
                if (this.isUrlInChildren(parent.children[i], url)) {
                    return true;
                }
            }
            if (parent.children[i].url === url || url.includes(parent.children[i].url)) {
                return true;
            }
        }
        return false;
    };
    FuseNavVerticalCollapseComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input()
    ], FuseNavVerticalCollapseComponent.prototype, "item", void 0);
    __decorate([
        core_1.HostBinding('class')
    ], FuseNavVerticalCollapseComponent.prototype, "classes", void 0);
    __decorate([
        core_1.HostBinding('class.open')
    ], FuseNavVerticalCollapseComponent.prototype, "isOpen", void 0);
    FuseNavVerticalCollapseComponent = __decorate([
        core_1.Component({
            selector: 'fuse-nav-vertical-collapse',
            templateUrl: './nav-vertical-collapse.component.html',
            styleUrls: ['./nav-vertical-collapse.component.scss'],
            animations: animations_1.fuseAnimations
        })
    ], FuseNavVerticalCollapseComponent);
    return FuseNavVerticalCollapseComponent;
}());
exports.FuseNavVerticalCollapseComponent = FuseNavVerticalCollapseComponent;
