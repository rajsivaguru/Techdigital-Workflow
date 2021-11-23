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
require("rxjs/add/observable/of");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var headers = new http_1.HttpHeaders();
headers.set("Content-Type", "application/json");
var EmailService = /** @class */ (function () {
    function EmailService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onEmailDetailsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.serviceURL = configSer.ServiceURL;
    }
    EmailService.prototype.ngOnInit = function () {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    EmailService.prototype.resolve = function (route, state) {
        this.searchText = "";
        this.loggedUserId = this.loginService.getLoginId();
        this.emailDetails = [];
    };
    EmailService.prototype.getLoginId = function () {
        return this.loggedUserId;
    };
    EmailService.prototype.getEmailDetails = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Email/GetEmailDetails').subscribe(function (response) {
                if (response != null && response != undefined)
                    _this.emailDetails = response.Output;
                else
                    _this.emailDetails = [];
                _this.onEmailDetailsChanged.next(_this.emailDetails);
                resolve(_this.emailDetails);
            }, reject);
        });
    };
    /* Compose Email. */
    EmailService.prototype.sendEmail = function (email) {
        var _this = this;
        email.userid = this.loggedUserId;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Email/SendEmail', email, { headers: headers })
                .subscribe(function (response) {
                resolve(response);
            });
        });
    };
    EmailService = __decorate([
        core_1.Injectable()
    ], EmailService);
    return EmailService;
}());
exports.EmailService = EmailService;
