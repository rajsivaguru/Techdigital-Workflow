"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var router_1 = require("@angular/router");
var FuseConfigService = /** @class */ (function () {
    /**
     * @param router
     * @param platform
     */
    function FuseConfigService(router, platform) {
        //////if (location.port == "" && location.origin.indexOf('Workflow-Dev') >= 0 )
        //////{
        //////    //this.ServiceURL = location.origin + '/StaffingService/api/'  // local
        //////    this.ServiceURL = location.origin + '/WorkflowApi/api/'  // live
        //////}
        //////else
        //////{
        //////    this.ServiceURL = "https://www.apps.techdigitalcorp.com/WorkflowApi-Dev/api/"
        //////    //this.ServiceURL = 'http://demo.csfinance.in/StaffingService/api/';
        //////    //this.ServiceURL = location.origin + '0/api/'  // local
        //////}
        var _this = this;
        this.router = router;
        this.platform = platform;
        this.isLoginAuthenticated = false;
        this.ServiceURL = "";
        this.GoogleClientID = "";
        if (location.port.trim().length > 0 || (location.port == '' && location.pathname.toLowerCase().indexOf('workflow-dev') >= 0)) {
            ////this.ServiceURL = 'https://www.apps.techdigitalcorp.com/WorkflowApi-Dev/api/'; /* for Dev URL */
            ////this.ServiceURL = location.origin + '0/api/'; /* for localhost */
            if (location.port.trim().length > 0)
                this.ServiceURL = location.origin + '0/api/'; /* for localhost */
            else {
                if (location.href.toLowerCase().indexOf('www') >= 0)
                    this.ServiceURL = 'https://www.apps.techdigitalcorp.com/WorkflowApi-Dev/api/'; /* for Dev URL */
                else
                    this.ServiceURL = 'https://apps.techdigitalcorp.com/WorkflowApi-Dev/api/'; /* for Dev URL */
            }
        }
        else {
            if (location.href.toLowerCase().indexOf('www') >= 0)
                this.ServiceURL = 'https://www.apps.techdigitalcorp.com/WorkflowApi/api/'; /* for Dev URL */
            else
                this.ServiceURL = 'https://apps.techdigitalcorp.com/WorkflowApi/api/';
        }
        this.isLoginAuthenticated = false;
        this.defaultSettings = {
            showProgress: false,
            layout: {
                navigation: 'left',
                navigationFolded: false,
                toolbar: 'above',
                footer: 'none',
                mode: 'boxed' // 'boxed', 'fullwidth'
            },
            colorClasses: {
                toolbar: 'mat-white-500-bg',
                navbar: 'mat-light-blue-900-bg',
                footer: 'mat-light-blue-900-bg'
            },
            customScrollbars: true,
            routerAnimation: 'fadeIn' // fadeIn, slideUp, slideDown, slideRight, slideLeft
        };
        /**
         * Disable Custom Scrollbars if Browser is Mobile
         */
        if (this.platform.ANDROID || this.platform.IOS) {
            this.defaultSettings.customScrollbars = false;
        }
        // Set the settings from the default settings
        this.settings = Object.assign({}, this.defaultSettings);
        // Reload the default settings on every navigation start
        router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationStart) {
                _this.setSettings({ layout: _this.defaultSettings.layout });
            }
        });
        // Create the behavior subject
        this.onSettingsChanged = new BehaviorSubject_1.BehaviorSubject(this.settings);
    }
    /**
     * Sets settings
     * @param settings
     */
    FuseConfigService.prototype.setSettings = function (settings) {
        // Set the settings from the given object
        this.settings = Object.assign({}, this.settings, settings);
        // Trigger the event
        this.onSettingsChanged.next(this.settings);
    };
    FuseConfigService = __decorate([
        core_1.Injectable()
    ], FuseConfigService);
    return FuseConfigService;
}());
exports.FuseConfigService = FuseConfigService;
