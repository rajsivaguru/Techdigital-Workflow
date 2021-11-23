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
var search_model_1 = require("./search.model");
var headers = new http_1.HttpHeaders();
headers.set("Content-Type", "application/json");
var SearchService = /** @class */ (function () {
    function SearchService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onSearchProfileChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.serviceURL = configSer.ServiceURL;
    }
    SearchService.prototype.ngOnInit = function () {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    SearchService.prototype.resolve = function (route, state) {
        this.searchText = "";
        this.loggedUserId = this.loginService.getLoginId();
        this.profileResult = new search_model_1.ProfileSearchResult({});
    };
    SearchService.prototype.getLoginId = function () {
        return this.loggedUserId;
    };
    SearchService.prototype.searchProfile = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(query)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    //if (response.context != null && response.context != undefined)
                    //    applicationname = response.context.title;
                    if (response.searchInformation != null && response.searchInformation != undefined)
                        _this.profileResult.resultCount = parseInt(response.searchInformation.totalResults);
                    if (response.items != null && response.items != undefined)
                        _this.profileResult.profiles = response.items;
                    else
                        _this.profileResult.profiles = [];
                    if (_this.profileResult.profiles.length > 0) {
                        _this.profileResult.profiles = _this.profileResult.profiles.map(function (profile) {
                            return new search_model_1.Profile(profile);
                        });
                    }
                    _this.onSearchProfileChanged.next(_this.profileResult);
                    resolve(_this.profileResult);
                }
                else {
                    resolve([]);
                }
            }, reject);
        });
    };
    /* Save profile search. */
    SearchService.prototype.saveProfileSearch = function (search) {
        var _this = this;
        search.userid = this.loggedUserId;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'ProfileSearch/SaveProfileSearch', search, { headers: headers })
                .subscribe(function (response) {
                response = JSON.parse(response);
                resolve(response);
            });
        });
    };
    SearchService.prototype.indexing = function (token) {
        var _this = this;
        debugger;
        ////let headers = new HttpHeaders();
        ////headers.set("Content-Type", "application/json");
        ////headers.set("Access-Control-Allow-Origin", "*");
        ////headers.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD,OPTIONS");
        ////headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-Csrf-Token,Authorization");
        ////headers.set('Authorization', 'BEARER ' + token);
        var headers = new http_1.HttpHeaders();
        headers = headers.set("Content-Type", "application/json; charset=utf-8");
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD,OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-Csrf-Token,Authorization");
        headers.append('Authorization', 'BEARER ' + token);
        return new Promise(function (resolve, reject) {
            _this.http.post('https://content-indexing.googleapis.com/v3/urlNotifications:publish?key=AIzaSyCHT7SEp5bPMxvafWIYs_QcYgIelGgFDWo&alt=json', 
            //////this.http.post('https://content-indexing.googleapis.com/v3/urlNotifications:publish?key=AIzaSyCXd3M-Cb0KvyBMKTNS23nfaoiez6l51Go&alt=json',
            {
                "url": "https://www.apps.techdigitalcorp.com/Workflow-Dev/gjobs/qa.html",
                "type": "URL_UPDATED" //,
                //"scope": "https://www.googleapis.com/auth/indexing"
            }, { headers: headers })
                .subscribe(function (response) {
                debugger;
            }, reject);
        });
    };
    SearchService = __decorate([
        core_1.Injectable()
    ], SearchService);
    return SearchService;
}());
exports.SearchService = SearchService;
