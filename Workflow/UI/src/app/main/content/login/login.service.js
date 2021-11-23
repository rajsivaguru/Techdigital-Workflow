"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var dialog_component_1 = require("../dialog/dialog.component");
var LoginService = /** @class */ (function () {
    function LoginService(http, configSer, localStorageService, dialog, router) {
        this.http = http;
        this.configSer = configSer;
        this.localStorageService = localStorageService;
        this.dialog = dialog;
        this.router = router;
        this.serviceURL = configSer.ServiceURL;
        //this.navigationModel = fuseNavigationService.navigationModel.model;
    }
    LoginService.prototype.openDialog = function (message) {
        this.confirmDialogRef = this.dialog.open(dialog_component_1.DialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.data = message;
    };
    LoginService.prototype.getConfigurationData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/GetConfiguration')
                .subscribe(function (response) {
                response = JSON.parse(response);
                resolve(response);
            }, reject);
        });
    };
    LoginService.prototype.syncUserData = function (email, img, firstname, lastname, name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'User/SyncUser?email=' + email + '&imgurl=' + img + '&firstname=' + firstname + '&lastname=' + lastname + '&name=' + name)
                .subscribe(function (response) {
                response = JSON.parse(response);
                resolve(response);
            }, reject);
        });
    };
    LoginService.prototype.getLoginId = function () {
        var user = this.loggedUser;
        if (user == null || user == undefined || user.userid == null || user.userid == '0' || user.userid == '' || user.userid == undefined)
            this.googleUser.disconnect();
        else
            return this.loggedUser.userid;
    };
    LoginService.prototype.getLoginToken = function () {
        var user = this.loggedUser;
        if (user == null || user == undefined || user.userid == null || user.userid == '0' || user.userid == '' || user.userid == undefined)
            this.googleUser.disconnect();
        else
            return this.loggedUser.token;
    };
    LoginService.prototype.getHeaders = function () {
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.loggedUser.token
            })
        };
        return httpOptions;
    };
    LoginService = __decorate([
        core_1.Injectable()
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, fuseConfig, fuseNavigationService, localStorageService, router) {
        this.authService = authService;
        this.fuseConfig = fuseConfig;
        this.fuseNavigationService = fuseNavigationService;
        this.localStorageService = localStorageService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        //console.log('login check')
        //console.log(this.router.url)
        if (this.fuseNavigationService.findNavigationItemByURL(state.url) == null) {
            if ((this.router.url == "/users" && (state.url == "/user")) || (this.router.url == "/jobs" && (state.url == "/prioritizejob"))) {
            }
            else {
                this.router.navigateByUrl(this.router.url);
                this.fuseConfig.setSettings({
                    showProgress: false
                });
            }
        }
        if (this.localStorageService.get("login_id") == null && this.localStorageService.get("login_id") == undefined) {
            this.fuseConfig.setSettings({
                layout: {
                    navigation: 'none',
                    toolbar: 'none',
                    footer: 'none'
                }
            });
            if (this.authService.googleUser != null && this.authService.googleUser.isSignedIn())
                this.authService.googleUser.disconnect();
            this.router.navigate(['login']);
        }
        else if (this.authService.googleUser != null && !this.authService.googleUser.isSignedIn()) {
            this.fuseConfig.setSettings({
                layout: {
                    navigation: 'none',
                    toolbar: 'none',
                    footer: 'none'
                }
            });
            if (this.localStorageService.get("login_id") != null && this.localStorageService.get("login_id") != undefined)
                this.localStorageService.remove("login_id");
            this.router.navigate(['login']);
        }
        if (this.authService.loggedUser == undefined) {
            this.fuseConfig.setSettings({
                layout: {
                    navigation: 'none',
                    toolbar: 'none',
                    footer: 'none'
                }
            });
            if (this.localStorageService.get("login_id") != null && this.localStorageService.get("login_id") != undefined)
                this.localStorageService.remove("login_id");
            if (this.authService.googleUser != null && this.authService.googleUser.isSignedIn())
                this.authService.googleUser.disconnect();
            this.router.navigate(['login']);
        }
        return true;
    };
    AuthGuard.prototype.canActivateChild = function () {
        //console.log('checking child route access');
        return true;
    };
    AuthGuard = __decorate([
        core_1.Injectable()
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
