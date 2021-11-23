"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app_model_1 = require("../../app.model");
var users_model_1 = require("../content/users/users.model");
var FuseToolbarComponent = /** @class */ (function () {
    function FuseToolbarComponent(router, fuseConfig, localStorageService, rouer, loginService, commonService, snackComp) {
        var _this = this;
        this.router = router;
        this.fuseConfig = fuseConfig;
        this.localStorageService = localStorageService;
        this.rouer = rouer;
        this.loginService = loginService;
        this.commonService = commonService;
        this.snackComp = snackComp;
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];
        this.languages = [
            {
                'id': 'en',
                'title': 'English',
                'flag': 'us'
            },
            {
                'id': 'tr',
                'title': 'Turkish',
                'flag': 'tr'
            }
        ];
        this.selectedLanguage = this.languages[0];
        // router.events.subscribe(
        //     (event) => {
        //         if ( event instanceof NavigationStart )
        //         {
        //             this.showLoadingBar = true;
        //         }
        //         if ( event instanceof NavigationEnd )
        //         {
        //             this.showLoadingBar = false;
        //         }
        //     });
        this.fuseConfig.onSettingsChanged.subscribe(function (settings) {
            _this.horizontalNav = settings.layout.navigation === 'top';
        });
    }
    FuseToolbarComponent.prototype.ngOnInit = function () {
        this.notifications = [];
        this.progressbar = new app_model_1.ProgressBarConfig({});
        if (this.loginService.loggedUser == undefined)
            this.loginUser = new users_model_1.Contact({});
        else
            this.loginUser = this.loginService.loggedUser;
        if (this.loginUser.userid != undefined && this.loginUser.userid != '0') {
            this.isValidUser = true;
            //////this.getMyNotifications();
        }
    };
    FuseToolbarComponent.prototype.search = function (value) {
        // Do your search here...
        //console.log(value);
    };
    FuseToolbarComponent.prototype.setLanguage = function (lang) {
        // Set the selected language for toolbar
        this.selectedLanguage = lang;
        // Use the selected language for translations
        //this.translate.use(lang.id);
    };
    FuseToolbarComponent.prototype.submitLogout = function () {
        if (this.localStorageService.get("login_id") != null && this.localStorageService.get("login_id") != undefined)
            this.localStorageService.remove("login_id");
        if (this.loginService.googleUser != null && this.loginService.googleUser.isSignedIn())
            this.loginService.googleUser.disconnect();
        localStorage.setItem('notificationCount', '');
        localStorage.setItem('notification', '');
    };
    FuseToolbarComponent.prototype.helpdesk = function () {
        if (this.fuseConfig.helpDeskURL != undefined || this.fuseConfig.helpDeskURL != "")
            window.open(this.fuseConfig.helpDeskURL, 'blank');
    };
    FuseToolbarComponent.prototype.staffDirectory = function () {
        if (this.fuseConfig.staffDirectoryURL != undefined || this.fuseConfig.staffDirectoryURL != "")
            window.open(this.fuseConfig.staffDirectoryURL);
    };
    FuseToolbarComponent.prototype.getMyNotifications = function () {
        var _this = this;
        this.notifications = [];
        localStorage.setItem('notificationCount', '');
        localStorage.setItem('notification', '');
        this.progressbar.showProgress();
        this.commonService.getMyNotifications().then(function (response) {
            _this.progressbar.hideProgress();
            if (response) {
                if (response['ResultStatus'] == 1) {
                    response.Output.map(function (notification) {
                        _this.notifications.push(notification);
                    });
                    if (_this.notifications.length > 4)
                        _this.notifications = _this.notifications.slice(0, 4);
                    if (_this.notifications.length == 0)
                        _this.isnotificationCountVisible = false;
                    else
                        _this.isnotificationCountVisible = true;
                    var unreadNotification = _this.notifications.filter(function (x) { return x.isread == false; }).length;
                    if (unreadNotification > 0)
                        _this.notificationCount = unreadNotification.toString();
                    else
                        _this.notificationCount = '';
                    localStorage.setItem('notificationCount', _this.notificationCount);
                }
                _this.notify();
            }
        });
    };
    FuseToolbarComponent.prototype.notify = function () {
        var _this = this;
        setInterval(function () {
            _this.notificationCount = localStorage.getItem('notificationCount');
            _this.isnotificationCountVisible = true;
            if (_this.notificationCount == null || _this.notificationCount == undefined || _this.notificationCount == '') {
                _this.notificationCount = '';
                _this.isnotificationCountVisible = false;
            }
            var notification = localStorage.getItem('notification');
            if (notification != null && notification != undefined && notification.length > 0) {
                var notifications = notification.split('~');
                notifications.map(function (notification) {
                    var item = JSON.parse(notification);
                    _this.snackComp.showSimpleNotificationSnackBar(item.messagetext);
                    _this.notifications.unshift(item);
                });
                localStorage.setItem('notification', '');
                if (_this.notifications.length > 4)
                    _this.notifications = _this.notifications.slice(0, 4);
                ////this.notifications = this.notifications.map(notification => {
                ////    return new Notification(notification);
                ////});
            }
        }, 10000);
    };
    FuseToolbarComponent = __decorate([
        core_1.Component({
            selector: 'fuse-toolbar',
            templateUrl: './toolbar.component.html',
            styleUrls: ['./toolbar.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], FuseToolbarComponent);
    return FuseToolbarComponent;
}());
exports.FuseToolbarComponent = FuseToolbarComponent;
