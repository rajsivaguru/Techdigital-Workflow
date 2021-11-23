"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var navigation_model_1 = require("../../../navigation.model");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var FuseNavigationService = /** @class */ (function () {
    function FuseNavigationService() {
        this.onNavCollapseToggle = new core_1.EventEmitter();
        this.onNavCollapseToggled = new core_1.EventEmitter();
        this.onNavigationModelChange = new BehaviorSubject_1.BehaviorSubject({});
        this.flatNavigation = [];
        this.navigationModel = new navigation_model_1.NavigationModel();
        this.onNavigationModelChange.next(this.navigationModel.model);
    }
    FuseNavigationService.prototype.removeMenu = function (id) {
        if (this.navigationModel.model.length <= 0) {
            return this.navigationModel.model;
        }
        // Iterate through the given navigation
        for (var _i = 0, _a = this.navigationModel.model; _i < _a.length; _i++) {
            var navItem = _a[_i];
            //console.log(this.navigationModel.model.indexOf(navItem))
            // If the nav item id equals the first location...
            if (navItem.id === id) {
                //console.log(id)
                var index = this.navigationModel.model.indexOf(navItem);
                // If there is more location to look at...
                //if ( location.length > 1 )
                {
                    // Remove the first item of the location
                    this.navigationModel.model.splice(index, 1);
                    // Go nested...
                }
            }
        }
    };
    FuseNavigationService.prototype.removeChildMenu = function (id, childid) {
        if (this.navigationModel.model.length <= 0) {
            return this.navigationModel.model;
        }
        for (var _i = 0, _a = this.navigationModel.model; _i < _a.length; _i++) {
            var navItem = _a[_i];
            if (navItem.id === id) {
                var parentIndex = this.navigationModel.model.indexOf(navItem);
                for (var _b = 0, _c = this.navigationModel.model[parentIndex].children; _b < _c.length; _b++) {
                    var navChildItem = _c[_b];
                    if (navChildItem.id === childid) {
                        var childIndex = this.navigationModel.model[parentIndex].children.indexOf(navChildItem);
                        this.navigationModel.model[parentIndex].children.splice(childIndex, 1);
                        break;
                    }
                }
                break;
            }
        }
    };
    /**
     * Get navigation model
     *
     * @returns {any[]}
     */
    FuseNavigationService.prototype.getNavigationModel = function () {
        return this.navigationModel.model;
    };
    /**
     * Set the navigation model
     *
     * @param model
     */
    FuseNavigationService.prototype.setNavigationModel = function (model) {
        this.navigationModel = model;
        this.onNavigationModelChange.next(this.navigationModel.model);
    };
    /**
     * Add new navigation item
     * to the given location
     */
    FuseNavigationService.prototype.addNavigationItem = function (location, item) {
        // Parse the location
        var locationArr = location.split('.');
        if (locationArr.length === 0) {
            return;
        }
        // Find the navigation item
        var navItem = this.findNavigationItemById(locationArr);
        //console.log(navItem)
        // Act according to the item type
        switch (navItem.type) {
            case 'item':
                // Create a children array
                navItem.children = [];
                // Push the item
                navItem.children.push(item);
                // Change the item type to collapsable
                navItem.type = 'collapse';
                break;
            case 'collapse':
                // Push the item
                navItem.children.push(item);
                break;
            case 'group':
                // Push the item
                navItem.children.push(item);
                break;
            default:
                break;
        }
    };
    /**
     * Get navigation item from
     * given location
     *
     * @param location
     */
    FuseNavigationService.prototype.getNavigationItem = function (location) {
        // Parse the location
        var locationArr = location.split('.');
        if (locationArr.length === 0) {
            return;
        }
        // Find and return the navigation item
        return this.findNavigationItemById(locationArr);
    };
    /**
     * Find navigation item by location
     *
     * @param location
     * @param navigation
     */
    FuseNavigationService.prototype.findNavigationItemById = function (location, navigation) {
        if (!navigation) {
            navigation = this.navigationModel.model;
        }
        // Iterate through the given navigation
        for (var _i = 0, navigation_1 = navigation; _i < navigation_1.length; _i++) {
            var navItem = navigation_1[_i];
            // If the nav item id equals the first location...
            if (navItem.id === location[0]) {
                // If there is more location to look at...
                if (location.length > 1) {
                    // Remove the first item of the location
                    location.splice(0, 1);
                    // Go nested...
                    return this.findNavigationItemById(location, navItem.children);
                }
                else {
                    return navItem;
                }
            }
        }
    };
    FuseNavigationService.prototype.findNavigationItemByURL = function (url, navigation) {
        if (!navigation) {
            navigation = this.navigationModel.model;
        }
        // Iterate through the given navigation
        for (var _i = 0, navigation_2 = navigation; _i < navigation_2.length; _i++) {
            var navItem = navigation_2[_i];
            // If the nav item id equals the first location...
            if (navItem.type == "item") {
                if (navItem.url === url) {
                    return navItem;
                }
            }
            else if (navItem.type == "collapse") {
                var item = this.findNavigationItemByURL(url, navItem.children);
                if (item != null)
                    return item;
            }
        }
        return null;
    };
    /**
     * Get flattened navigation array
     * @param navigationItems
     * @returns {any[]}
     */
    FuseNavigationService.prototype.getFlatNavigation = function (navigationItems) {
        //console.log(navigationItems)
        if (!navigationItems) {
            navigationItems = this.navigationModel.model;
        }
        for (var _i = 0, navigationItems_1 = navigationItems; _i < navigationItems_1.length; _i++) {
            var navItem = navigationItems_1[_i];
            if (navItem.type === 'subheader') {
                continue;
            }
            if (navItem.type === 'item') {
                this.flatNavigation.push({
                    title: navItem.title,
                    type: navItem.type,
                    icon: navItem.icon || false,
                    url: navItem.url
                });
                continue;
            }
            if (navItem.type === 'collapse' || navItem.type === 'group') {
                this.getFlatNavigation(navItem.children);
            }
        }
        return this.flatNavigation;
    };
    FuseNavigationService = __decorate([
        core_1.Injectable()
    ], FuseNavigationService);
    return FuseNavigationService;
}());
exports.FuseNavigationService = FuseNavigationService;
