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
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var PunchTimeService = /** @class */ (function () {
    function PunchTimeService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onMyPunchDetailsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.serviceURL = configSer.ServiceURL;
    }
    PunchTimeService.prototype.ngOnInit = function () {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    PunchTimeService.prototype.resolve = function (route, state) {
        this.searchText = "";
        this.headerOptions = this.loginService.getHeaders();
    };
    PunchTimeService.prototype.getMyPunchDetails = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Attendance/GetMyPunchDetails', _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    if (response["ResultStatus"] == "1") {
                        _this.myPunchDetails = response["Output"];
                    }
                    else
                        resolve([]);
                }
                else {
                    _this.myPunchDetails = [];
                }
                _this.onMyPunchDetailsChanged.next(_this.myPunchDetails);
                resolve(_this.myPunchDetails);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    PunchTimeService.prototype.saveMyPunchDetails = function (inOutTime) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Attendance/SaveMyPunchDetails', inOutTime, _this.headerOptions)
                .subscribe(function (response) {
                //response = JSON.parse(response);
                _this.getMyPunchDetails();
                resolve(response);
            });
        });
    };
    PunchTimeService = __decorate([
        core_1.Injectable()
    ], PunchTimeService);
    return PunchTimeService;
}());
exports.PunchTimeService = PunchTimeService;
