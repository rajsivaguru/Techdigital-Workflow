"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var collections_1 = require("@angular/cdk/collections");
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var animations_1 = require("../../../../core/animations");
var fuseUtils_1 = require("../../../../core/fuseUtils");
var fuse_perfect_scrollbar_directive_1 = require("../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive");
var app_model_1 = require("../../../../app.model");
var common_model_1 = require("../../common/common.model");
var InvoicesComponent = /** @class */ (function () {
    function InvoicesComponent(accountsService, snackComp, utilities, commonService) {
        this.accountsService = accountsService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.commonService = commonService;
        /* ii = Invoices */
        this.displayedColumns = ['ii_id', 'ii_name', 'ii_customer', 'ii_endclient', 'ii_invoicestartdate', 'ii_invoiceenddate', 'ii_tsexpectedhours', 'ii_tsactualhours', 'ii_status', 'ii_percent'];
        this.showDetail = false;
        this.showPaymentHistory = false;
        this.isTSControlsEnabled = false;
        this.isICreatedControlsEnabled = false;
        this.isISentControlsEnabled = false;
        this.isPaymentControlsEnabled = false;
        this.isBillPaidControlsEnabled = false;
        this.isCommissionPaidControlsEnabled = false;
        this.shouldsendinvoice = false;
        this.hasCommission = false;
        this.isW2 = false;
        this.isModelValid = false;
        this.step = 0;
        this.searchInput = new forms_1.FormControl('');
    }
    InvoicesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.dataSource = new FilesDataSource(this.accountsService, this.paginator, this.sort);
        this.currentDate = new Date();
        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(function (searchText) {
            _this.paginator.pageIndex = 0;
            _this.accountsService.onSearchInvoicesTextChanged.next(searchText);
        });
        if (this.accountsService.invoices == undefined || this.accountsService.invoices.length == 0)
            this.refresh();
        if (this.commonService.statuses == undefined || this.commonService.statuses.length == 0)
            this._getInvoiceStatus();
    };
    InvoicesComponent.prototype.ngOnDestroy = function () {
    };
    InvoicesComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    };
    InvoicesComponent.prototype.refresh = function () {
        this._getActiveInvoices();
    };
    /* Show edit form */
    InvoicesComponent.prototype.editInvoice = function (invoice) {
        this.showPaymentHistory = false;
        this.isModelValid = true;
        this.oldStatusSortOrder = invoice.statussortorder;
        this.step = 0;
        this.invoice = invoice;
        this.isW2 = this.invoice.isw2;
        this.shouldsendinvoice = this.invoice.shouldsendinvoice;
        this.hasCommission = this.invoice.hascommission;
        this._getInvoiceDetails(invoice.invoiceid);
    };
    InvoicesComponent.prototype.setStep = function (index) {
        this.step = index;
    };
    InvoicesComponent.prototype.nextStep = function () {
        this.step++;
    };
    InvoicesComponent.prototype.prevStep = function () {
        this.step--;
    };
    InvoicesComponent.prototype.saveInvoice = function (no) {
        var _this = this;
        if (!this._validate(this.invoice, no))
            this.isModelValid = false;
        else {
            this.isModelValid = true;
            this.progressbar.showProgress();
            this.accountsService.saveInvoice(this.invoice).then(function (response) {
                _this.progressbar.hideProgress();
                if (response["ResultStatus"] == "1") {
                    ////this.showDetail = false;
                    _this._getActiveInvoices();
                }
                else {
                    if (no == 7)
                        _this.invoice.status = '';
                }
                _this.snackComp.showSnackBarPost(response, '');
            });
        }
    };
    InvoicesComponent.prototype.cancel = function () {
        this.showDetail = false;
    };
    InvoicesComponent.prototype._validate = function (invoice, no) {
        switch (no) {
            /* Timesheet Received/Verified */
            case 1:
                if (invoice.tsreceiveddate != null && invoice.tsreceiveddate.toString().trim().length > 0 && invoice.tsreceiveddate <= new Date() && !isNaN(invoice.tsactualhours) && invoice.tsactualhours > 0) {
                    this._updateCurrentInvoiceStatus('Timesheet Received/Verified');
                    return true;
                }
                break;
            /* Invoice Created */
            case 2:
                if (invoice.invoicecreateddate != null && invoice.invoicecreateddate.toString().trim().length > 0 && invoice.invoicecreateddate <= new Date() && invoice.invoicenumber.trim().length > 0 && !isNaN(invoice.invoiceamount) && invoice.invoiceamount > 0) {
                    this._updateCurrentInvoiceStatus('Invoice Created');
                    return true;
                }
                break;
            /* Invoice Sent */
            case 3:
                if (invoice.invoicesentdate != null && invoice.invoicesentdate.toString().trim().length > 0 && invoice.invoicesentdate <= new Date()) {
                    this._updateCurrentInvoiceStatus('Invoice Sent');
                    return true;
                }
                break;
            /* Partial Payment Received, Payment Received */
            case 4:
                if (invoice.paymentreceiveddate != null && invoice.paymentreceiveddate.toString().trim().length > 0 && invoice.paymentreceiveddate <= new Date() && !isNaN(invoice.paymentamount) && invoice.paymentamount > 0) {
                    if (invoice.ispartialpayment)
                        this._updateCurrentInvoiceStatus('Partial Payment Received');
                    else
                        this._updateCurrentInvoiceStatus('Payment Received');
                    return true;
                }
                break;
            /* Bill Paid */
            case 5:
                if (invoice.billpaiddate != null && invoice.billpaiddate.toString().trim().length > 0 && invoice.billpaiddate <= new Date() && !isNaN(invoice.billamount) && invoice.billamount > 0 && !isNaN(invoice.billhours) && invoice.billhours > 0) {
                    this._updateCurrentInvoiceStatus('Bill Paid');
                    return true;
                }
                break;
            /* Commission Paid */
            case 6:
                if (invoice.commissionpaiddate != null && invoice.commissionpaiddate.toString().trim().length > 0 && invoice.commissionpaiddate <= new Date() && !isNaN(invoice.commissionamount) && invoice.commissionamount > 0 && !isNaN(invoice.commissionhours) && invoice.commissionhours > 0) {
                    this._updateCurrentInvoiceStatus('Commission Paid');
                    return true;
                }
                break;
            /* Complete Invoice */
            case 7:
                this._updateCurrentInvoiceStatus('Complete Invoice');
                return true;
        }
        return false;
    };
    InvoicesComponent.prototype._getActiveInvoices = function () {
        var _this = this;
        this.progressbar.showProgress();
        this.accountsService.getActiveInvoices().then(function (response) {
            _this.progressbar.hideProgress();
            if (response) {
                _this.snackComp.showSnackBarGet(response, '');
            }
        });
    };
    InvoicesComponent.prototype._getInvoiceStatus = function () {
        var _this = this;
        this.progressbar.showProgress();
        this.commonService.getStatuses('Invoice').then(function (response) {
            _this.progressbar.hideProgress();
            if (response) {
                if (response['ResultStatus'] == 1)
                    _this.statuses = _this.commonService.statuses;
                _this.snackComp.showSnackBarGet(response, '');
            }
        });
    };
    InvoicesComponent.prototype._getInvoiceDetails = function (invoiceid) {
        var _this = this;
        this.progressbar.showProgress();
        this.accountsService.getInvoiceDetails(invoiceid).then(function (response) {
            _this.progressbar.hideProgress();
            if (response) {
                _this.invoice = response;
                _this.showDetail = true;
                _this._showHideControls(_this.invoice);
                _this.snackComp.showSnackBarGet(response, '');
            }
        });
    };
    InvoicesComponent.prototype._showHideControls = function (invoice) {
        var _isValidStatus = false;
        var statusid = invoice.value == undefined ? invoice.statusid : invoice.value;
        this.isTSControlsEnabled = false;
        this.isICreatedControlsEnabled = false;
        this.isISentControlsEnabled = false;
        this.isPaymentControlsEnabled = false;
        this.isBillPaidControlsEnabled = false;
        this.isCommissionPaidControlsEnabled = false;
        var _activeStatus = this._getStatusById(statusid);
        switch (_activeStatus.name.toLowerCase()) {
            case '':
                break;
            case this.utilities.is_atimesheet.toLocaleLowerCase():
                {
                    this.isTSControlsEnabled = true;
                    break;
                }
            case this.utilities.is_rvtimesheet.toLocaleLowerCase():
                {
                    this.isTSControlsEnabled = false;
                    if (invoice.invoicecreateddate == null)
                        this.isICreatedControlsEnabled = true;
                    if (!this.shouldsendinvoice)
                        this.isISentControlsEnabled = true;
                    break;
                }
            case this.utilities.is_icreated.toLocaleLowerCase():
                {
                    this.isTSControlsEnabled = false;
                    this.isICreatedControlsEnabled = false;
                    if (invoice.invoicesentdate == null && this.shouldsendinvoice)
                        this.isISentControlsEnabled = true;
                    else {
                        this.isPaymentControlsEnabled = true;
                        this.isBillPaidControlsEnabled = true;
                        if (invoice.commissionpaiddate == null && this.hasCommission)
                            this.isCommissionPaidControlsEnabled = true;
                    }
                    break;
                }
            case this.utilities.is_isent.toLocaleLowerCase():
                {
                    this.isTSControlsEnabled = false;
                    this.isICreatedControlsEnabled = false;
                    this.isISentControlsEnabled = false;
                    if (invoice.paymentreceiveddate == null || invoice.ispartialpayment)
                        this.isPaymentControlsEnabled = true;
                    this.isBillPaidControlsEnabled = true;
                    if (invoice.commissionpaiddate == null && invoice.hascommission)
                        this.isCommissionPaidControlsEnabled = true;
                    break;
                }
            default:
                {
                    if (invoice.paymentreceiveddate == null || invoice.ispartialpayment)
                        this.isPaymentControlsEnabled = true;
                    if (invoice.billpaiddate == null)
                        this.isBillPaidControlsEnabled = true;
                    if (invoice.commissionpaiddate == null && this.hasCommission)
                        this.isCommissionPaidControlsEnabled = true;
                }
        }
    };
    InvoicesComponent.prototype._getStatusById = function (id) {
        if (this.statuses == undefined || this.statuses.length == 0)
            this.statuses = this.commonService.statuses;
        var _activeStatus = this.statuses.filter(function (x) { return x.statusid == id; });
        if (_activeStatus != null && _activeStatus != undefined && _activeStatus.length > 0)
            return _activeStatus[0];
        else
            return new common_model_1.Status({});
    };
    InvoicesComponent.prototype._getStatusByName = function (status) {
        if (this.statuses == undefined || this.statuses.length == 0)
            this.statuses = this.commonService.statuses;
        var _activeStatus = this.statuses.filter(function (x) { return x.name == status; });
        if (_activeStatus != null && _activeStatus != undefined && _activeStatus.length > 0)
            return _activeStatus[0];
        else
            return new common_model_1.Status({});
    };
    InvoicesComponent.prototype._isW2 = function (employmenttypeid) {
        this.isW2 = false;
        var _types = this.accountsService.supportingDetail.employmenttypes.filter(function (x) { return x.employmenttypeid == employmenttypeid; });
        if (_types != null && _types != undefined && _types.length > 0) {
            this.isW2 = true;
            return _types[0];
        }
        else
            return [];
    };
    InvoicesComponent.prototype._updateCurrentInvoiceStatus = function (status) {
        var _status = this._getStatusByName(status);
        if (_status.statusid > 0) {
            this.invoice.status = _status.name;
            this.invoice.statusid = _status.statusid;
        }
    };
    InvoicesComponent.prototype.onStatusChange = function (invoice) {
        //this._showHideControls(invoice);
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], InvoicesComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], InvoicesComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], InvoicesComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], InvoicesComponent.prototype, "sort", void 0);
    InvoicesComponent = __decorate([
        core_1.Component({
            selector: 'invoices',
            templateUrl: './invoices.component.html',
            styleUrls: ['../accounts.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], InvoicesComponent);
    return InvoicesComponent;
}());
exports.InvoicesComponent = InvoicesComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(accountsService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.accountsService = accountsService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        if (_this.accountsService.invoices != undefined)
            _this.filteredData = _this.accountsService.invoices;
        return _this;
    }
    Object.defineProperty(FilesDataSource.prototype, "filteredData", {
        get: function () {
            return this._filteredDataChange.value;
        },
        set: function (value) {
            this._filteredDataChange.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilesDataSource.prototype, "filter", {
        get: function () {
            return this._filterChange.value;
        },
        set: function (filter) {
            this._filterChange.next(filter);
        },
        enumerable: true,
        configurable: true
    });
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    FilesDataSource.prototype.connect = function () {
        var _this = this;
        var displayDataChanges = [];
        if (this._paginator != undefined)
            displayDataChanges = [
                this.accountsService.onInvoicesChanged,
                this._paginator.page,
                this._filterChange,
                this._sort.sortChange
            ];
        else
            displayDataChanges = [
                this.accountsService.onInvoicesChanged,
                this._filterChange
            ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            if (_this.accountsService.invoices != undefined) {
                var data = _this.accountsService.invoices.slice();
                data = _this.filterData(data);
                _this.filteredData = data.slice();
                data = _this.sortData(data);
                if (_this.directiveScroll) {
                    _this.directiveScroll.scrollToTop(0, 500);
                    _this.directiveScroll.update();
                }
                var pageindex = _this._paginator != undefined ? _this._paginator.pageIndex : 1;
                var pagesize = _this._paginator != undefined ? _this._paginator.pageSize : 25;
                var startIndex = pageindex * pagesize;
                return data.splice(startIndex, pagesize);
            }
        });
    };
    FilesDataSource.prototype.filterData = function (data) {
        if (!this.filter) {
            return data;
        }
        return fuseUtils_1.FuseUtils.filterArrayByString(data, this.filter);
    };
    FilesDataSource.prototype.sortData = function (data) {
        var _this = this;
        if (this._sort == undefined || !this._sort.active || this._sort.direction === '') {
            return data;
        }
        return data.sort(function (a, b) {
            var propertyA = '';
            var propertyB = '';
            switch (_this._sort.active) {
                case 'ii_name':
                    _a = [a.name, b.name], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'ii_customer':
                    _b = [a.customer, b.customer], propertyA = _b[0], propertyB = _b[1];
                    break;
                case 'ii_endclient':
                    _c = [a.endclient, b.endclient], propertyA = _c[0], propertyB = _c[1];
                    break;
                case 'ii_invoicestartdate':
                    _d = [a.invoicestartdate, b.invoicestartdate], propertyA = _d[0], propertyB = _d[1];
                    break;
                case 'ii_invoiceenddate':
                    _e = [a.invoiceenddate, b.invoiceenddate], propertyA = _e[0], propertyB = _e[1];
                    break;
                case 'ii_tsexpectedhours':
                    _f = [a.tsexpectedhours, b.tsexpectedhours], propertyA = _f[0], propertyB = _f[1];
                    break;
                case 'ii_tsactualhours':
                    _g = [a.tsactualhours, b.tsactualhours], propertyA = _g[0], propertyB = _g[1];
                    break;
                case 'ii_status':
                    _h = [a.status, b.status], propertyA = _h[0], propertyB = _h[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a, _b, _c, _d, _e, _f, _g, _h;
        });
    };
    FilesDataSource.prototype.disconnect = function () {
    };
    __decorate([
        core_1.ViewChild(fuse_perfect_scrollbar_directive_1.FusePerfectScrollbarDirective)
    ], FilesDataSource.prototype, "directiveScroll", void 0);
    return FilesDataSource;
}(collections_1.DataSource));
exports.FilesDataSource = FilesDataSource;
