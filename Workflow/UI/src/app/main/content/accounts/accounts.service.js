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
var accounts_model_1 = require("./accounts.model");
//let headers = new HttpHeaders();
//headers.set("Content-Type", "application/json");
var AccountsService = /** @class */ (function () {
    function AccountsService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onSupportingDetailsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onConsultantsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onInvoicesChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onSearchConsultantsTextChanged = new Subject_1.Subject();
        this.onSearchInvoicesTextChanged = new Subject_1.Subject();
        this.serviceURL = configSer.ServiceURL;
    }
    AccountsService.prototype.ngOnInit = function () {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    AccountsService.prototype.resolve = function (route, state) {
        var _this = this;
        this.searchText = "";
        this.headerOptions = this.loginService.getHeaders();
        this.onSearchConsultantsTextChanged.subscribe(function (searchText) {
            _this.searchText = searchText;
            _this.getConsultantsSearch();
        });
        this.onSearchInvoicesTextChanged.subscribe(function (searchText) {
            _this.searchText = searchText;
            _this.getActiveInvoicesSearch();
        });
    };
    AccountsService.prototype.getInvoiceSupportingDetails = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Invoice/GetInvoiceSupportingDetails', _this.headerOptions).subscribe(function (response) {
                if (response != null && response != undefined && response.Output.length > 0)
                    _this.supportingDetail = response.Output[0];
                else
                    _this.supportingDetail = new accounts_model_1.InvoiceSupportingDetail({});
                _this.onSupportingDetailsChanged.next(_this.supportingDetail);
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    AccountsService.prototype.getConsultants = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ////this.http.get(this.serviceURL + 'Invoice/GetConsultants', { headers: this.headers }).subscribe((response: any) => {
            _this.http.get(_this.serviceURL + 'Invoice/GetConsultants', _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    _this.storageConsultants = response.Output;
                    _this.consultants = response.Output;
                }
                else {
                    _this.storageConsultants = [];
                    _this.consultants = [];
                }
                _this.onConsultantsChanged.next(_this.consultants);
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    AccountsService.prototype.getConsultantsSearch = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.storageConsultants != undefined && _this.storageConsultants.length > 0) {
                if (_this.searchText && _this.searchText !== '') {
                    _this.consultants = fuseUtils_1.FuseUtils.filterArrayByString(_this.storageConsultants, _this.searchText);
                    if (_this.consultants.length > 0) {
                        _this.consultants = _this.consultants.map(function (item) {
                            return new accounts_model_1.Consultant(item);
                        });
                    }
                }
                else
                    _this.consultants = _this.storageConsultants.map(function (item) {
                        return new accounts_model_1.Consultant(item);
                    });
                _this.onConsultantsChanged.next(_this.consultants);
                resolve(_this.consultants);
            }
        });
    };
    AccountsService.prototype.getActiveInvoices = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Invoice/GetActiveInvoices?generateInvoice=true', _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    _this.storageInvoices = response.Output;
                    _this.invoices = response.Output;
                }
                else {
                    _this.storageInvoices = [];
                    _this.invoices = [];
                }
                _this.onInvoicesChanged.next(_this.invoices);
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    AccountsService.prototype.getActiveInvoicesSearch = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.storageInvoices != undefined && _this.storageInvoices.length > 0) {
                if (_this.searchText && _this.searchText !== '') {
                    _this.invoices = fuseUtils_1.FuseUtils.filterArrayByString(_this.storageInvoices, _this.searchText);
                    if (_this.invoices.length > 0) {
                        _this.invoices = _this.invoices.map(function (item) {
                            return new accounts_model_1.Invoice(item);
                        });
                    }
                }
                else
                    _this.invoices = _this.storageInvoices.map(function (item) {
                        return new accounts_model_1.Invoice(item);
                    });
                _this.onInvoicesChanged.next(_this.invoices);
                resolve(_this.invoices);
            }
        });
    };
    AccountsService.prototype.getInvoiceDetails = function (invoiceid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Invoice/GetInvoiceDetail?invoiceId=' + invoiceid, _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined)
                    resolve(response.Output);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    AccountsService.prototype.saveConsultant = function (consultant) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Invoice/SaveConsultant', consultant, _this.headerOptions)
                .subscribe(function (response) {
                response = response;
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            });
        });
    };
    AccountsService.prototype.saveInvoice = function (invoice) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.post(_this.serviceURL + 'Invoice/SaveInvoice', invoice, _this.headerOptions)
                .subscribe(function (response) {
                response = response;
                resolve(response);
            }, function (exception) {
                resolve(exception.error);
            });
        });
    };
    AccountsService = __decorate([
        core_1.Injectable()
    ], AccountsService);
    return AccountsService;
}());
exports.AccountsService = AccountsService;
