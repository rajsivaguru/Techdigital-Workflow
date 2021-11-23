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
var invoice_model_1 = require("./invoice.model");
//let headers = new HttpHeaders();
//headers.set("Content-Type", "application/json");
var InvoiceService = /** @class */ (function () {
    function InvoiceService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onSupportingDetailsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onConsultantsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onInvoicesChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.serviceURL = configSer.ServiceURL;
    }
    InvoiceService.prototype.ngOnInit = function () {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    InvoiceService.prototype.resolve = function (route, state) {
        //this.searchText = "";
        this.headerOptions = this.loginService.getHeaders();
    };
    InvoiceService.prototype.getInvoiceSupportingDetails = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Invoice/GetInvoiceSupportingDetails', _this.headerOptions).subscribe(function (response) {
                if (response != null && response != undefined && response.Output.length > 0)
                    _this.supportingDetail = response.Output[0];
                else
                    _this.supportingDetail = new invoice_model_1.InvoiceSupportingDetail({});
                _this.onSupportingDetailsChanged.next(_this.supportingDetail);
                resolve(_this.supportingDetail);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    InvoiceService.prototype.getConsultants = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ////this.http.get(this.serviceURL + 'Invoice/GetConsultants', { headers: this.headers }).subscribe((response: any) => {
            _this.http.get(_this.serviceURL + 'Invoice/GetConsultants', _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined)
                    _this.consultants = response.Output;
                else
                    _this.consultants = [];
                _this.onConsultantsChanged.next(_this.consultants);
                resolve(_this.consultants);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    InvoiceService.prototype.getActiveInvoices = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'Invoice/GetActiveInvoices?generateInvoice=true', _this.headerOptions)
                .subscribe(function (response) {
                if (response != null && response != undefined)
                    _this.invoices = response.Output;
                else
                    _this.invoices = [];
                _this.onInvoicesChanged.next(_this.invoices);
                resolve(_this.invoices);
            }, function (exception) {
                resolve(exception.error);
            }, reject);
        });
    };
    InvoiceService.prototype.getInvoiceDetails = function (invoiceid) {
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
    InvoiceService.prototype.saveConsultant = function (consultant) {
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
    InvoiceService = __decorate([
        core_1.Injectable()
    ], InvoiceService);
    return InvoiceService;
}());
exports.InvoiceService = InvoiceService;
