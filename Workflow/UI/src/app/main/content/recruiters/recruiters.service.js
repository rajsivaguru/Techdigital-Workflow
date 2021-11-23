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
        this.headerOptions = this.loginService.getHeaders();
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
            _this.http.get(_this.serviceURL + 'Recruiter/GetRecruiterJobList', _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    _this.recruiterJobs = response.Output;
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
            }, function (exception) {
                resolve(exception.error);
            });
        });
    };
    RecruitersService.prototype.startRecruiterJob = function (jobassignmentid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Recruiter/StartRecruiterJob?jobassignmentid=' + jobassignmentid, null, _this.headerOptions)
                .subscribe(function (response) {
                response = response;
                _this.getRecruiterJobs();
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            });
        });
    };
    RecruitersService.prototype.stopRecruiterJob = function (job) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Recruiter/StopRecruiterJob', job, _this.headerOptions)
                .subscribe(function (response) {
                response = response;
                _this.getRecruiterJobs();
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            });
        });
    };
    RecruitersService = __decorate([
        core_1.Injectable()
    ], RecruitersService);
    return RecruitersService;
}());
exports.RecruitersService = RecruitersService;
