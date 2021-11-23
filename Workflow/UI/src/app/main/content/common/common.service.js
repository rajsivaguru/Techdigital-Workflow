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
var Subject_1 = require("rxjs/Subject");
var fuseUtils_1 = require("../../../core/fuseUtils");
var common_model_1 = require("./common.model");
var CommonService = /** @class */ (function () {
    function CommonService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onStatusesChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onCustomerTypesChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onCustomerVendorChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onNotificationChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onSearchCustomerVendorTextChanged = new Subject_1.Subject();
        this.serviceURL = configSer.ServiceURL;
    }
    CommonService.prototype.ngOnInit = function () {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    CommonService.prototype.resolve = function (route, state) {
        var _this = this;
        this.searchText = "";
        if (this.customersvendors == null || this.customersvendors == undefined)
            this.customersvendors = new Array();
        if (this.customerTypes == null || this.customerTypes == undefined)
            this.customerTypes = new Array();
        this.onSearchCustomerVendorTextChanged.subscribe(function (searchText) {
            _this.searchText = searchText;
            _this.getCustomersVendorsSearch();
        });
    };
    CommonService.prototype.getStatuses = function (statustype) {
        var _this = this;
        this.headerOptions = this.loginService.getHeaders();
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Common/GetStatuses?type=' + statustype, _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined && response.Output.length > 0)
                    _this.statuses = response.Output;
                else
                    _this.statuses = [];
                _this.onStatusesChanged.next(_this.statuses);
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    CommonService.prototype.getCustomerTypes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Common/GetCustomerTypes', _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    _this.customerTypes = response.Output;
                }
                else {
                    _this.customerTypes = [];
                }
                _this.onCustomerTypesChanged.next(_this.customerTypes);
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    CommonService.prototype.getCustomersVendors = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Common/GetCustomersVendors', _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    _this.storageCustomersVendors = response.Output;
                    _this.customersvendors = response.Output;
                }
                else {
                    _this.storageCustomersVendors = [];
                    _this.customersvendors = [];
                }
                _this.onCustomerVendorChanged.next(_this.customersvendors);
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    CommonService.prototype.getCustomersVendorsSearch = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.storageCustomersVendors != undefined && _this.storageCustomersVendors.length > 0) {
                if (_this.searchText && _this.searchText !== '') {
                    _this.customersvendors = fuseUtils_1.FuseUtils.filterArrayByString(_this.storageCustomersVendors, _this.searchText);
                    if (_this.customersvendors.length > 0) {
                        _this.customersvendors = _this.customersvendors.map(function (item) {
                            return new common_model_1.CustomerVendor(item);
                        });
                    }
                }
                else
                    _this.customersvendors = _this.storageCustomersVendors.map(function (item) {
                        return new common_model_1.CustomerVendor(item);
                    });
                _this.onCustomerVendorChanged.next(_this.customersvendors);
                resolve(_this.customersvendors);
            }
        });
    };
    CommonService.prototype.saveCustomer = function (customer) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Common/SaveCustomerVendor', customer, _this.headerOptions)
                .subscribe(function (response) {
                response = response;
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            });
        });
    };
    CommonService.prototype.deleteCustomer = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Common/DeleteCustomerVendor?id=' + id, _this.headerOptions)
                .subscribe(function (response) {
                response = response;
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            });
        });
    };
    CommonService.prototype.getMyNotifications = function () {
        var _this = this;
        if (this.headerOptions == undefined && this.loginService.loggedUser != undefined)
            this.headerOptions = this.loginService.getHeaders();
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Common/GetMyNotifications', _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined && response.Output.length > 0) {
                    _this.myNotifications = response;
                }
                else {
                    _this.myNotifications = [];
                }
                _this.onNotificationChanged.next(_this.myNotifications);
                resolve(_this.myNotifications);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    CommonService = __decorate([
        core_1.Injectable()
    ], CommonService);
    return CommonService;
}());
exports.CommonService = CommonService;
