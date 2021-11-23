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
var confirm_dialog_component_1 = require("../../../../core/components/confirm-dialog/confirm-dialog.component");
var animations_1 = require("../../../../core/animations");
var fuseUtils_1 = require("../../../../core/fuseUtils");
var fuse_perfect_scrollbar_directive_1 = require("../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive");
var app_model_1 = require("../../../../app.model");
var common_model_1 = require("../common.model");
var CustomerVendorComponent = /** @class */ (function () {
    function CustomerVendorComponent(confirmDialog, commonService, formBuilder, snackComp, utilities) {
        this.confirmDialog = confirmDialog;
        this.commonService = commonService;
        this.formBuilder = formBuilder;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.displayedColumns = ['cv_name', 'cv_type', 'cv_buttons'];
        this.isFormExpanded = true;
        this.isSavable = false;
        this.searchInput = new forms_1.FormControl('');
        this.customervendor = new common_model_1.CustomerVendor({});
    }
    CustomerVendorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.dataSource = new FilesDataSource(this.commonService, this.paginator, this.sort);
        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(function (searchText) {
            _this.paginator.pageIndex = 0;
            _this.commonService.onSearchCustomerVendorTextChanged.next(searchText);
        });
        if (this.commonService.customersvendors == undefined || this.commonService.customersvendors.length == 0 || this.commonService.customerTypes == undefined || this.commonService.customerTypes.length == 0)
            this.refresh();
        else {
            this.customerTypes = this.commonService.customerTypes;
            this.customervendors = this.commonService.customersvendors;
        }
    };
    CustomerVendorComponent.prototype.ngOnDestroy = function () {
    };
    CustomerVendorComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
    };
    CustomerVendorComponent.prototype.refresh = function () {
        this._getCustomerTypes();
        this._getCustomerVendorList();
    };
    CustomerVendorComponent.prototype.validateForm = function () {
        this.isSavable = false;
        var _item = this.customervendor;
        if (_item.name.length > 0 && _item.type.length > 0) {
            if (!this._isDuplicate()) {
                this.isSavable = true;
                return true;
            }
        }
        return false;
    };
    CustomerVendorComponent.prototype.clearForm = function () {
        this.isSavable = false;
        if (this.customervendor.customervendorid > 0)
            this._getCustomerVendorList();
        this.customervendor = new common_model_1.CustomerVendor({});
    };
    CustomerVendorComponent.prototype.selectedItem = function (customervendor) {
        this.customervendor = customervendor;
        this.isFormExpanded = true;
        this.validateForm();
    };
    CustomerVendorComponent.prototype.save = function () {
        var _this = this;
        if (this.validateForm()) {
            this.progressbar.showProgress();
            this.commonService.saveCustomer(this.customervendor).then(function (response) {
                if (response) {
                    _this.progressbar.hideProgress();
                    _this.clearForm();
                    _this.snackComp.showSnackBarPost(response, '');
                    _this._getCustomerVendorList();
                }
            });
        }
    };
    CustomerVendorComponent.prototype.deleteItem = function (customervendor) {
        var _this = this;
        this.confirmDialogRef = this.confirmDialog.open(confirm_dialog_component_1.FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.title = this.utilities.customerVendorDeleteConfirmTitle;
        this.confirmDialogRef.componentInstance.confirmMessage = this.utilities.customerVendorDeleteConfirmMessage;
        this.confirmDialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.progressbar.showProgress();
                _this.commonService.deleteCustomer(customervendor.customervendorid).then(function (response) {
                    if (response) {
                        _this.progressbar.hideProgress();
                        _this.clearForm();
                        _this.snackComp.showSnackBarPost(response, '');
                        _this._getCustomerVendorList();
                    }
                });
            }
            _this.confirmDialogRef = null;
        });
    };
    CustomerVendorComponent.prototype._getCustomerVendorList = function () {
        var _this = this;
        this.progressbar.showProgress();
        this.commonService.getCustomersVendors().then(function (response) {
            _this.progressbar.hideProgress();
            if (response) {
                _this.customervendors = _this.commonService.customersvendors;
                _this.snackComp.showSnackBarGet(response, '');
            }
        });
    };
    CustomerVendorComponent.prototype._getCustomerTypes = function () {
        var _this = this;
        this.progressbar.showProgress();
        this.commonService.getCustomerTypes().then(function (response) {
            _this.progressbar.hideProgress();
            if (response) {
                _this.customerTypes = _this.commonService.customerTypes;
                _this.snackComp.showSnackBarGet(response, '');
            }
        });
    };
    CustomerVendorComponent.prototype._isDuplicate = function () {
        var _this = this;
        var items = this.customervendors.filter(function (x) { return x.name.toLocaleLowerCase() == _this.customervendor.name.trim().toLocaleLowerCase() && x.type == _this.customervendor.type; });
        if (items == null || items == undefined || items.length == 0 || (items.length <= 1 && this.customervendor.customervendorid > 0))
            return false;
        else
            return true;
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], CustomerVendorComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], CustomerVendorComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], CustomerVendorComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], CustomerVendorComponent.prototype, "sort", void 0);
    CustomerVendorComponent = __decorate([
        core_1.Component({
            selector: 'customer-vendor',
            templateUrl: './customer-vendor.component.html',
            styleUrls: ['../common.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], CustomerVendorComponent);
    return CustomerVendorComponent;
}());
exports.CustomerVendorComponent = CustomerVendorComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(commonService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.commonService = commonService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        _this.filteredData = _this.commonService.customersvendors;
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
        var displayDataChanges = [
            this.commonService.onCustomerVendorChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            var data = _this.commonService.customersvendors.slice();
            data = _this.filterData(data);
            _this.filteredData = data.slice();
            data = _this.sortData(data);
            if (_this.directiveScroll) {
                _this.directiveScroll.scrollToTop(0, 500);
                _this.directiveScroll.update();
            }
            //Grab the page's slice of data.
            var startIndex = _this._paginator.pageIndex * _this._paginator.pageSize;
            return data.splice(startIndex, _this._paginator.pageSize);
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
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }
        return data.sort(function (a, b) {
            var propertyA = '';
            var propertyB = '';
            switch (_this._sort.active) {
                case 'cv_name':
                    _a = [a.name, b.name], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'cv_type':
                    _b = [a.type, b.type], propertyA = _b[0], propertyB = _b[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a, _b;
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
