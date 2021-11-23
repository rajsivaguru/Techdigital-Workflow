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
var material_1 = require("@angular/material");
var collections_1 = require("@angular/cdk/collections");
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var animations_1 = require("../../../../core/animations");
var fuseUtils_1 = require("../../../../core/fuseUtils");
var fuse_perfect_scrollbar_directive_1 = require("../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive");
var app_model_1 = require("../../../../app.model");
var ConsultantComponent = /** @class */ (function () {
    function ConsultantComponent(invoiceService, router, snackComp, utilities) {
        this.invoiceService = invoiceService;
        this.router = router;
        this.snackComp = snackComp;
        this.utilities = utilities;
        /* ic = InvoiceConsultant */
        this.displayedColumns = ['ic_Name', 'ic_customer', 'ic_endclient', 'ic_startdate', 'ic_invoicestartdate', 'ic_billingfrequency'];
    }
    ConsultantComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.dataSource = new FilesDataSource(this.invoiceService, this.paginator, this.sort);
        //this.getConsultants();
    };
    ConsultantComponent.prototype.ngOnDestroy = function () {
    };
    ConsultantComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    };
    ConsultantComponent.prototype.addConsultant = function () {
        //this.contactsService.action = 'edit';
        //this.contactsService.editContacts = contact;
        //this.router.navigateByUrl('/user');
        //this.contactsService.action = 'new';
        //this.router.navigateByUrl('/user');
        this.snackComp.showSimpleSnackBar('Add consultant is under development !!!');
    };
    ConsultantComponent.prototype.editConsultant = function (consultant) {
        //this.contactsService.action = 'edit';
        //this.contactsService.editContacts = contact;
        //this.router.navigateByUrl('/user');
        this.snackComp.showSimpleSnackBar(consultant.fullname + '; Edit functionality under development !!!');
    };
    ConsultantComponent.prototype.getConsultants = function () {
        var _this = this;
        this.showHideProgressBar(true);
        this.invoiceService.getConsultants().then(function (response) {
            _this.showHideProgressBar(false);
            if (response) {
                //this.consultants = response;
                _this.snackComp.showSnackBarGet(response, '');
            }
        });
    };
    ConsultantComponent.prototype.showHideProgressBar = function (isVisible) {
        this.progressbar.isVisible = isVisible;
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], ConsultantComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], ConsultantComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], ConsultantComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], ConsultantComponent.prototype, "sort", void 0);
    ConsultantComponent = __decorate([
        core_1.Component({
            selector: 'consultants',
            templateUrl: './consultant.component.html',
            styleUrls: ['../invoice.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], ConsultantComponent);
    return ConsultantComponent;
}());
exports.ConsultantComponent = ConsultantComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(invoiceService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.invoiceService = invoiceService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        if (_this.invoiceService.consultants != undefined)
            _this.filteredData = _this.invoiceService.consultants;
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
                this.invoiceService.onConsultantsChanged,
                this._paginator.page,
                this._filterChange,
                this._sort.sortChange
            ];
        else
            displayDataChanges = [
                this.invoiceService.onConsultantsChanged,
                this._filterChange
            ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            if (_this.invoiceService.consultants != undefined) {
                var data = _this.invoiceService.consultants.slice();
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
                case 'ic_Name':
                    _a = [a.name, b.name], propertyA = _a[0], propertyB = _a[1];
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
                case 'ic_billingfrequency':
                    _f = [a.billingfrequency, b.billingfrequency], propertyA = _f[0], propertyB = _f[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a, _b, _c, _d, _e, _f;
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
