"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var reports_model_1 = require("./reports.model");
var Subject_1 = require("rxjs/Subject");
var ReportsService = /** @class */ (function () {
    function ReportsService(http, httpObser, configSer, loginService) {
        var _this = this;
        this.http = http;
        this.httpObser = httpObser;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onContactsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onUserReportChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onSearchTextChanged = new Subject_1.Subject();
        this.onFilterChanged = new Subject_1.Subject();
        this.searchJob = function (keyword) {
            try {
                //console.log('calling..')
                return _this.httpObser.get(_this.serviceURL + 'TDW/SearchJob?keyword=' + keyword)
                    .map(function (res) {
                    var json = res.json();
                    //console.log(json)
                    return JSON.parse(json);
                });
            }
            catch (ex) {
                return Observable_1.Observable.of([]);
            }
        };
        this.serviceURL = configSer.ServiceURL;
    }
    ReportsService.prototype.ngOnInit = function () {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    ReportsService.prototype.resolve = function (route, state) {
        // this.searchText = "";
        this.jobReports = [];
        this.userReports = [];
    };
    ReportsService.prototype.getJobs = function (rptForm) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var tempUrl = 'TDW/GetJobReport?jobcode=' + rptForm.jobcode + '&title=' + rptForm.title + '&location=' + rptForm.location + '&publisheddate=' + rptForm.publishedDate + '&isactive=' + rptForm.status + '&fromdate=' + rptForm.fromDate + '&todate=' + rptForm.toDate + '&lastdays=' + rptForm.lastDatys + '';
            _this.http.get(_this.serviceURL + tempUrl).subscribe(function (response) {
                if (response != null && response != undefined) {
                    response = JSON.parse(response);
                    _this.jobReports = response;
                    if (_this.jobReports.length > 0) {
                        _this.jobReports = _this.jobReports.map(function (rpt) {
                            return new reports_model_1.JobReport(rpt);
                        });
                    }
                    _this.onContactsChanged.next(_this.jobReports);
                    resolve(_this.jobReports);
                }
                else {
                    _this.jobReports = [];
                    _this.onContactsChanged.next(_this.jobReports);
                    resolve(_this.jobReports);
                }
            }, reject);
        });
    };
    ReportsService.prototype.getUserReport = function (userRptParam) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var userid = '0';
            if (_this.loginService.loggedUser != undefined)
                userid = _this.loginService.loggedUser.userid;
            var tempUrl = 'Report/GetUserReport?userRptParam=' + JSON.stringify(userRptParam) + '&loginid=' + userid;
            _this.http.get(_this.serviceURL + tempUrl)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    response = JSON.parse(response);
                    _this.userReports = response;
                    if (_this.userReports.length > 0) {
                        _this.userReports = _this.userReports.map(function (rpt) {
                            return new reports_model_1.UserReport(rpt);
                        });
                    }
                    _this.onUserReportChanged.next(_this.userReports);
                    resolve(_this.userReports);
                }
                else {
                    _this.userReports = [];
                    _this.onUserReportChanged.next(_this.userReports);
                    resolve(_this.userReports);
                }
            }, reject);
        });
    };
    ReportsService.prototype.getUserReportPdf = function (userRptParam) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.open(_this.serviceURL + 'Report/GetUserReportFile?userRptParam=' + JSON.stringify(userRptParam), "_blank");
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
    ReportsService.prototype.searchUser = function (keyword) {
        return this.httpObser.get(this.serviceURL + 'TDW/SearchUser?keyword=' + keyword)
            .map(function (res) {
            var json = res.json();
            //console.log(json)
            return JSON.parse(json);
        });
    };
    ReportsService = __decorate([
        core_1.Injectable()
    ], ReportsService);
    return ReportsService;
}());
exports.ReportsService = ReportsService;
