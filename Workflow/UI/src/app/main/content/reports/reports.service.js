"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/observable/of");
var http_1 = require("@angular/common/http");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Subject_1 = require("rxjs/Subject");
var headers = new http_1.HttpHeaders();
headers.set("Content-Type", "application/json");
var ReportsService = /** @class */ (function () {
    function ReportsService(http, httpObser, configSer, loginService) {
        this.http = http;
        this.httpObser = httpObser;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onJobReportChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onUserReportChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onClientReportChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onProfileSearchReportChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onPunchReportChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onSearchTextChanged = new Subject_1.Subject();
        this.onFilterChanged = new Subject_1.Subject();
        this.serviceURL = configSer.ServiceURL;
    }
    ReportsService.prototype.ngOnInit = function () {
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    ReportsService.prototype.resolve = function (route, state) {
        this.loggedUserId = this.loginService.getLoginId();
        this.jobReports = [];
        this.userReports = [];
        this.clientReports = [];
        this.profileSearchReports = [];
        ////let item = new ProfileSearchReport({ username: 'Test', title: 'Job Title', location: "Job Location", searchengine: "Google", searcheddate: "03:28:2019 10:28 " });
        ////this.profileSearchReports.push(item);
    };
    ReportsService.prototype.getLoginId = function () {
        return this.loggedUserId;
    };
    ReportsService.prototype.getJobReport = function (jobRptParam) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Report/GetJobReport?source=' + JSON.stringify(jobRptParam)).subscribe(function (response) {
                if (response != null && response != undefined)
                    _this.jobReports = response.Output;
                else
                    _this.jobReports = [];
                _this.onJobReportChanged.next(_this.jobReports);
                resolve(_this.jobReports);
            }, reject);
        });
    };
    ReportsService.prototype.getJobReportExport = function (parameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.open(_this.serviceURL + 'Report/GetJobReportFile?sourceParam=' + JSON.stringify(parameters), "_blank");
        });
    };
    ReportsService.prototype.getUserReport = function (userRptParam) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var userid = '0';
            if (_this.loginService.loggedUser != undefined)
                userid = _this.loginService.loggedUser.userid;
            var tempUrl = 'Report/GetUserReport?source=' + JSON.stringify(userRptParam) + '&loginid=' + userid;
            _this.http.get(_this.serviceURL + tempUrl)
                .subscribe(function (response) {
                if (response != null && response != undefined)
                    _this.userReports = response.Output;
                else
                    _this.userReports = [];
                _this.onUserReportChanged.next(_this.userReports);
                resolve(_this.userReports);
            }, reject);
        });
    };
    ReportsService.prototype.getUserReportExport = function (userRptParam) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.open(_this.serviceURL + 'Report/GetUserReportFile?sourceParam=' + JSON.stringify(userRptParam), "_blank");
        });
    };
    ReportsService.prototype.getClientReport = function (parameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Report/GetClientReport?source=' + JSON.stringify(parameters))
                .subscribe(function (response) {
                if (response != null && response != undefined)
                    _this.clientReports = response.Output;
                else
                    _this.clientReports = [];
                _this.onClientReportChanged.next(_this.clientReports);
                resolve(response);
            }, reject);
        });
    };
    ReportsService.prototype.getClientReportExport = function (parameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.open(_this.serviceURL + 'Report/GetClientReportFile?sourceParam=' + JSON.stringify(parameters), "_blank");
        });
    };
    ReportsService.prototype.getProfileSearchReport = function (parameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Report/GetProfileSearchReport?source=' + JSON.stringify(parameters))
                .subscribe(function (response) {
                if (response != null && response != undefined)
                    _this.profileSearchReports = response.Output;
                else
                    _this.profileSearchReports = [];
                _this.onProfileSearchReportChanged.next(_this.profileSearchReports);
                resolve(response);
            }, reject);
        });
    };
    ReportsService.prototype.getProfileSearchReportExport = function (parameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.open(_this.serviceURL + 'Report/GetProfileSearchReportFile?sourceParam=' + JSON.stringify(parameters), "_blank");
        });
    };
    ReportsService.prototype.getPunchReport = function (parameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Report/GetPunchReport?source=' + JSON.stringify(parameters))
                .subscribe(function (response) {
                if (response != null && response != undefined)
                    _this.punchReports = response.Output;
                else
                    _this.punchReports = [];
                _this.onPunchReportChanged.next(_this.punchReports);
                resolve(response);
            }, reject);
        });
    };
    /* Need to implement */
    ReportsService.prototype.getPunchReportExport = function (parameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.open(_this.serviceURL + 'Report/GetPunchReportFile?sourceParam=' + JSON.stringify(parameters), "_blank");
        });
    };
    ReportsService.prototype.getLastDays = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Report/GetPeriods')
                .subscribe(function (response) {
                response = JSON.parse(response);
                resolve(response);
            }, reject);
        });
    };
    ReportsService.prototype.getUserForReport = function (status, isAllUser) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var userid = _this.loggedUserId;
            _this.http.get(_this.serviceURL + 'Report/GetUsersForReport?statusId=' + status + '&isAllUser=' + isAllUser + '&loginId=' + userid)
                .subscribe(function (response) {
                response = JSON.parse(response);
                resolve(response);
            }, reject);
        });
    };
    ReportsService = __decorate([
        core_1.Injectable()
    ], ReportsService);
    return ReportsService;
}());
exports.ReportsService = ReportsService;
