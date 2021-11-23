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
var accounts_model_1 = require("../accounts.model");
var ConsultantsComponent = /** @class */ (function () {
    function ConsultantsComponent(accountsService, snackComp, utilities) {
        this.accountsService = accountsService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        /* ic = InvoiceConsultant */
        this.displayedColumns = ['ic_name', 'ic_customer', 'ic_endclient', 'ic_startdate', 'ic_invoicestartdate', 'ic_enddate', 'ic_billingfrequency'];
        this.emailValidator = new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.email]);
        this.emailInvoiceValidator = new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.email]);
        this.showDetail = false;
        this.isNew = false;
        this.showInvoiceEmail = false;
        this.showInvoicePortal = false;
        this.showBillTo = false;
        this.hasEnded = false;
        this.isModelValid = false;
        this.searchInput = new forms_1.FormControl('');
    }
    ConsultantsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.dataSource = new FilesDataSource(this.accountsService, this.paginator, this.sort);
        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(function (searchText) {
            _this.paginator.pageIndex = 0;
            _this.accountsService.onSearchConsultantsTextChanged.next(searchText);
        });
        if (this.accountsService.consultants == undefined || this.accountsService.consultants.length == 0 || this.accountsService.supportingDetail == undefined)
            this.refresh();
        else
            this.supportingDetail = this.accountsService.supportingDetail;
    };
    ConsultantsComponent.prototype.ngOnDestroy = function () {
    };
    ConsultantsComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    };
    ConsultantsComponent.prototype.refresh = function () {
        this._getInvoiceSupportingDetails();
        //this._getConsultants();
    };
    /* show add form */
    ConsultantsComponent.prototype.showAddConsultantForm = function () {
        this.isNew = true;
        this.showDetail = true;
        this.showInvoiceEmail = false;
        this.showInvoicePortal = false;
        this.isModelValid = true;
        this.consultant = new accounts_model_1.Consultant({});
        this.emailValidator = new forms_1.FormControl(this.consultant.email, [forms_1.Validators.required, forms_1.Validators.email]);
        this.emailInvoiceValidator = new forms_1.FormControl(this.consultant.invoiceemail, [forms_1.Validators.required, forms_1.Validators.email]);
    };
    ConsultantsComponent.prototype.getEmailErrorMessage = function (email) {
        if (email == this.utilities.ict_portal)
            return this.emailInvoiceValidator.hasError('required') ? this.utilities.emailRequired : this.emailInvoiceValidator.hasError('email') ? this.utilities.emailInvalid : '';
        else
            return this.emailValidator.hasError('required') ? this.utilities.emailRequired : this.emailValidator.hasError('email') ? this.utilities.emailInvalid : '';
    };
    ConsultantsComponent.prototype.isNumber = function (e) {
        var charcode = (e.which) ? e.which : e.keycode;
        if (!(charcode >= 48 && charcode <= 57)) {
            return false;
        }
        return true;
    };
    ConsultantsComponent.prototype.onEmploymentTypeChange = function (etype) {
        this._getEmploymentTypeById(etype.value);
    };
    ConsultantsComponent.prototype.onCommunicationChange = function (communication) {
        this._filterCommunication(communication);
    };
    /* show edit form */
    ConsultantsComponent.prototype.editConsultant = function (consultant) {
        this.isNew = false;
        this.showDetail = true;
        this.isModelValid = true;
        this.consultant = consultant;
        if (consultant.enddate != null && consultant.enddate != undefined)
            this.hasEnded = true;
        else
            this.hasEnded = false;
        this.oldEndDate = this.consultant.enddate;
        this.minEndDate = this.consultant.invoicestartdate;
        this._filterCommunication(this.consultant.communicationid);
        /* Uncomment if it has to toggle visibility based on Employment Type in Detail form. */
        this._getEmploymentTypeById(this.consultant.employmenttypeid);
    };
    ConsultantsComponent.prototype.addConsultant = function () {
        var _this = this;
        this.consultant.email = this.emailValidator.value;
        this.consultant.invoiceemail = this.emailInvoiceValidator.value;
        if (!this.validate(this.consultant))
            this.isModelValid = false;
        else {
            this.isModelValid = true;
            this.progressbar.showProgress();
            this.accountsService.saveConsultant(this.consultant).then(function (response) {
                _this.progressbar.hideProgress();
                if (response["ResultStatus"] == "1") {
                    _this.showDetail = false;
                    _this._getConsultants();
                }
                _this.snackComp.showSnackBarPost(response, '');
            });
        }
    };
    ConsultantsComponent.prototype.endClient = function () {
        var _this = this;
        if (!this.validate(this.consultant))
            this.isModelValid = false;
        else {
            this.isModelValid = true;
            this.progressbar.showProgress();
            this.accountsService.saveConsultant(this.consultant).then(function (response) {
                _this.progressbar.hideProgress();
                if (response["ResultStatus"] == "1") {
                    _this.showDetail = false;
                    _this.snackComp.showSnackBarPost(response, '');
                }
            });
        }
    };
    ConsultantsComponent.prototype.cancel = function () {
        if (!this.isNew) {
            this.consultant.enddate = this.oldEndDate;
        }
        this.showDetail = false;
    };
    ConsultantsComponent.prototype.validate = function (user) {
        if (this.isNew) {
            if (this.emailValidator.valid) {
                if ((this.showInvoiceEmail && this.emailInvoiceValidator.valid) || (this.showInvoicePortal && user.portalurl.trim().length > 0) || (user.communicationid > 0 && !this.showInvoiceEmail && !this.showInvoicePortal)
                    && /\d{10}/.test(user.phone)) {
                    if (user.payrate == null || user.payrate == undefined)
                        user.payrate = '';
                    if (user.firstname.trim().length > 0 && user.lastname.trim().length > 0 && user.phone.trim().length == 10 && user.customer.trim().length > 2 && user.employmenttypeid > 0
                        && user.billingfrequencyid > 0 && user.startdate.toString().trim().length > 0 && user.invoicestartdate.toString().trim().length > 0 && user.invoicestartdate >= user.startdate
                        && !isNaN(user.billrate) && !isNaN(user.payrate) && user.payrate <= user.billrate && (!this.showBillTo || (this.showBillTo && user.payrate >= 0))
                        && ((user.commissionrate.toString().trim().length > 0 && !isNaN(user.commissionrate) && user.commissionto.toString().trim().length > 0) || (user.commissionrate.toString().trim().length == 0 && user.commissionto.trim().length == 0))
                        && (!this.showBillTo || this.showBillTo && user.billpayto.trim().length > 0)) {
                        if (user.payrate == '')
                            user.payrate = 0;
                        return true;
                    }
                }
            }
        }
        else {
            if (user.enddate.toString().trim().length > 0 && user.enddate >= new Date(user.invoicestartdate))
                return true;
        }
        return false;
    };
    ConsultantsComponent.prototype._getInvoiceSupportingDetails = function () {
        var _this = this;
        this.progressbar.showProgress();
        this.accountsService.getInvoiceSupportingDetails().then(function (response) {
            _this.progressbar.hideProgress();
            if (response) {
                if (response['ResultStatus'] == 1) {
                    _this.supportingDetail = _this.accountsService.supportingDetail;
                    _this.customers = _this._getCustomers();
                    _this.endclients = _this._getEndClients();
                    _this.vendors = _this._getVendors();
                    _this._getConsultants();
                }
                else
                    _this.snackComp.showSnackBarGet(response, '');
            }
        });
    };
    ConsultantsComponent.prototype._getConsultants = function () {
        var _this = this;
        this.progressbar.showProgress();
        this.accountsService.getConsultants().then(function (response) {
            _this.progressbar.hideProgress();
            if (response) {
                _this.snackComp.showSnackBarGet(response, '');
            }
        });
    };
    ConsultantsComponent.prototype._getEmploymentTypeById = function (id) {
        var _this = this;
        this.showBillTo = false;
        this.supportingDetail.employmenttypes.filter(function (x) {
            if (x.employmenttypeid == id) {
                if (x.code == _this.utilities.iet_1099 || x.code == _this.utilities.iet_c2c)
                    _this.showBillTo = true;
            }
        });
    };
    ConsultantsComponent.prototype._getCustomers = function () {
        var _this = this;
        var _customers = [];
        this.supportingDetail.customervendors.filter(function (x) {
            if (x.type == _this.utilities.icv_customer) {
                _customers.push(x);
            }
        });
        return _customers;
    };
    ConsultantsComponent.prototype._getEndClients = function () {
        var _this = this;
        var _endclients = [];
        this.supportingDetail.customervendors.filter(function (x) {
            if (x.type == _this.utilities.icv_endclient) {
                _endclients.push(x);
            }
        });
        return _endclients;
    };
    ConsultantsComponent.prototype._getVendors = function () {
        var _this = this;
        var _vendors = [];
        this.supportingDetail.customervendors.filter(function (x) {
            if (x.type == _this.utilities.icv_vendor || x.type == _this.utilities.icv_consultant) {
                _vendors.push(x);
            }
        });
        return _vendors;
    };
    ConsultantsComponent.prototype._filterCommunication = function (communication) {
        var _this = this;
        var id = this.isNew ? communication.value : communication;
        this.supportingDetail.communicationmodes.filter(function (x) {
            if (x.communicationid == id) {
                _this.showInvoiceEmail = false;
                _this.showInvoicePortal = false;
                if (x.mode == _this.utilities.ict_email)
                    _this.showInvoiceEmail = true;
                else if (x.mode == _this.utilities.ict_portal)
                    _this.showInvoicePortal = true;
            }
        });
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], ConsultantsComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], ConsultantsComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], ConsultantsComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], ConsultantsComponent.prototype, "sort", void 0);
    ConsultantsComponent = __decorate([
        core_1.Component({
            selector: 'consultants',
            templateUrl: './consultants.component.html',
            styleUrls: ['../accounts.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], ConsultantsComponent);
    return ConsultantsComponent;
}());
exports.ConsultantsComponent = ConsultantsComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(accountsService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.accountsService = accountsService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        if (_this.accountsService.consultants != undefined)
            _this.filteredData = _this.accountsService.consultants;
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
                this.accountsService.onConsultantsChanged,
                this._paginator.page,
                this._filterChange,
                this._sort.sortChange
            ];
        else
            displayDataChanges = [
                this.accountsService.onConsultantsChanged,
                this._filterChange
            ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            if (_this.accountsService.consultants != undefined) {
                var data = _this.accountsService.consultants.slice();
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
            //displayedColumns = ['ic_name', 'ic_customer', 'ic_endclient', 'ic_startdate', 'ic_invoicestartdate', 'ic_enddate', 'ic_billingfrequency'];
            switch (_this._sort.active) {
                case 'ic_name':
                    _a = [a.fullname, b.fullname], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'ic_customer':
                    _b = [a.customer, b.customer], propertyA = _b[0], propertyB = _b[1];
                    break;
                case 'ic_endclient':
                    _c = [a.endclient, b.endclient], propertyA = _c[0], propertyB = _c[1];
                    break;
                case 'ic_startdate':
                    _d = [a.startdate, b.startdate], propertyA = _d[0], propertyB = _d[1];
                    break;
                case 'ic_invoicestartdate':
                    _e = [a.invoicestartdate, b.invoicestartdate], propertyA = _e[0], propertyB = _e[1];
                    break;
                case 'ic_enddate':
                    _f = [a.enddate, b.enddate], propertyA = _f[0], propertyB = _f[1];
                    break;
                case 'ic_billingfrequency':
                    _g = [a.frequency, b.frequency], propertyA = _g[0], propertyB = _g[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a, _b, _c, _d, _e, _f, _g;
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
