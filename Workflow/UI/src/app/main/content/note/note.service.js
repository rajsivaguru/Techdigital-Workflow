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
var Subject_1 = require("rxjs/Subject");
var NoteService = /** @class */ (function () {
    function NoteService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onFilterChanged = new Subject_1.Subject();
        this.serviceURL = configSer.ServiceURL;
    }
    NoteService.prototype.ngOnInit = function () {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    NoteService.prototype.resolve = function (route, state) {
        this.searchText = "";
        this.loggedUserId = this.loginService.getLoginId();
        ////this.profileResult = new ProfileSearchResult({});
    };
    NoteService.prototype.getLoginId = function () {
        return this.loggedUserId;
    };
    NoteService.prototype.getQuestionList = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Visa/GetNoteQuestions?loginid=' + _this.loggedUserId)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    if (response["ResultStatus"] == "1") {
                        ////this.newJobs = response["Output"];
                        ////if (this.newJobs.length > 0) {
                        ////    this.newJobs = this.newJobs.map(contact => {
                        ////        return new JobsList(contact);
                        ////    });
                        ////}
                        ////this.newJobsChanged.next(this.newJobs);
                        resolve(response["Output"]);
                    }
                    else
                        resolve([]);
                }
                else {
                    resolve([]);
                }
            }, reject);
        });
    };
    NoteService = __decorate([
        core_1.Injectable()
    ], NoteService);
    return NoteService;
}());
exports.NoteService = NoteService;
