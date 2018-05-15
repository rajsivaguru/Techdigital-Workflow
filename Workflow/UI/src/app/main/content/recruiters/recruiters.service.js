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
var recruiters_model_1 = require("./recruiters.model");
var fuseUtils_1 = require("../../../core/fuseUtils");
var Subject_1 = require("rxjs/Subject");
var RecruitersService = /** @class */ (function () {
    function RecruitersService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onRecruiterJobChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onSearchTextChanged = new Subject_1.Subject();
        this.onFilterChanged = new Subject_1.Subject();
        this.searchText = "";
        this.serviceURL = configSer.ServiceURL;
    }
    RecruitersService.prototype.ngOnInit = function () {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    RecruitersService.prototype.resolve = function (route, state) {
        var _this = this;
        this.searchText = "";
        return new Promise(function (resolve, reject) {
            Promise.all([
                _this.getRecruiterJobs()
            ]).then(function (_a) {
                var files = _a[0];
                _this.onSearchTextChanged.subscribe(function (searchText) {
                    _this.searchText = searchText;
                    _this.getRecruiterJobs();
                });
                _this.onFilterChanged.subscribe(function (filter) {
                    _this.filterBy = filter;
                    _this.getRecruiterJobs();
                });
                resolve();
            }, reject);
        });
    };
    RecruitersService.prototype.getRecruiterJobs = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var userid = '0';
            if (_this.loginService.loggedUser != undefined)
                userid = _this.loginService.loggedUser.userid;
            _this.http.get(_this.serviceURL + 'TDW/GetRecruiterJobList?loginid=' + userid)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    response = JSON.parse(response);
                    _this.recruiterJobs = response;
                    //console.log(this.recruiterJobs);
                    if (_this.searchText && _this.searchText !== '') {
                        _this.recruiterJobs = fuseUtils_1.FuseUtils.filterArrayByString(_this.recruiterJobs, _this.searchText);
                    }
                    if (_this.recruiterJobs.length > 0) {
                        _this.recruiterJobs = _this.recruiterJobs.map(function (contact) {
                            var rectJob = new recruiters_model_1.RecruitersJobs(contact);
                            rectJob.countdown = {
                                days: 0,
                                hours: 0,
                                minutes: 0,
                                seconds: 0
                            };
                            rectJob.diff = 1;
                            return rectJob;
                        });
                    }
                    _this.onRecruiterJobChanged.next(_this.recruiterJobs);
                    resolve(_this.recruiterJobs);
                }
                else {
                    resolve([]);
                }
            }, reject);
        });
    };
    RecruitersService.prototype.startRecruiterJob = function (jobassignmentid) {
        var _this = this;
        var userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/StartRecruiterJobStatus?jobassignmentid=' + jobassignmentid + '&userid=' + userid)
                .subscribe(function (response) {
                if (response != null && response != undefined && response != "") {
                    response = JSON.parse(response);
                    _this.getRecruiterJobs();
                    resolve(response);
                }
                else
                    resolve('');
            });
        });
    };
    RecruitersService.prototype.stopRecruiterJob = function (jaid, jobassignmentstatusid, submission, comment) {
        var _this = this;
        var userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/StopRecruiterJobStatus?jobassignmentid=' + jaid + '&jobassignmentstatusid=' + jobassignmentstatusid + '&submission=' + submission + '&comment=' + comment + '&userid=' + userid)
                .subscribe(function (response) {
                if (response != null && response != undefined && response != "") {
                    response = JSON.parse(response);
                    _this.getRecruiterJobs();
                    resolve(response);
                }
                else
                    resolve('');
            });
        });
    };
    RecruitersService = __decorate([
        core_1.Injectable()
    ], RecruitersService);
    return RecruitersService;
}());
exports.RecruitersService = RecruitersService;
