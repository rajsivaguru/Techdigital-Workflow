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
var jobs_model_1 = require("../jobs.model");
var JobsClientComponent = /** @class */ (function () {
    function JobsClientComponent(confirmDialog, jobsService, router, formBuilder, loginService, snackComp, utilities) {
        this.confirmDialog = confirmDialog;
        this.jobsService = jobsService;
        this.router = router;
        this.formBuilder = formBuilder;
        this.loginService = loginService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.displayedColumns = ['jn_clientname', 'jn_shortcode', 'jn_buttons'];
        this.isFormExpanded = true;
        this.isSavable = false;
        this.searchInput = new forms_1.FormControl('');
        this.clientForm = new jobs_model_1.Client({});
    }
    JobsClientComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.clientFormGroup = this.createClientForm();
        this.dataSource = new FilesDataSource(this.jobsService, this.paginator, this.sort);
        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(function (searchText) {
            _this.paginator.pageIndex = 0;
            _this.jobsService.onSearchClientTextChanged.next(searchText);
        });
    };
    JobsClientComponent.prototype.ngOnDestroy = function () {
    };
    JobsClientComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion_Client();
    };
    JobsClientComponent.prototype.validateForm = function () {
        var form = this.clientFormGroup.getRawValue();
        if (form.id == 0) {
            if (form.clientName.length > 0 && this.clientFormGroup.dirty)
                this.isSavable = true;
            else
                this.isSavable = false;
        }
        else if (form.id > 0) {
            if (form.clientName.length > 0 && this.clientFormGroup.dirty)
                this.isSavable = true;
            else
                this.isSavable = false;
        }
    };
    JobsClientComponent.prototype.clearForm = function () {
        this.clientFormGroup.patchValue({
            id: 0,
            clientName: '',
            shortName: ''
        });
        this.clientForm = new jobs_model_1.Client({});
        this.isSavable = false;
    };
    JobsClientComponent.prototype.getClientList = function () {
        var _this = this;
        this.clients = [];
        this.jobsService.getClients().then(function (response) {
            if (response) {
                response.map(function (client) {
                    _this.clients.push({ "id": client["id"], "clientname": client["clientname"] });
                });
            }
        });
    };
    JobsClientComponent.prototype.selectedClient = function (client) {
        this.clientFormGroup.patchValue({
            id: client.id,
            clientName: client.clientname,
            shortName: client.shortname
        });
        this.isFormExpanded = true;
    };
    JobsClientComponent.prototype.saveClient = function () {
        var _this = this;
        this.clientForm = this.clientFormGroup.getRawValue();
        this.progressbar.showProgress();
        this.jobsService.saveClient(this.clientForm).then(function (response) {
            if (response) {
                _this.clearForm();
                _this.progressbar.hideProgress();
                _this.snackComp.showUnfinishedSnackBar(response["Message"]);
            }
        });
    };
    JobsClientComponent.prototype.deleteClient = function (client) {
        var _this = this;
        this.confirmDialogRef = this.confirmDialog.open(confirm_dialog_component_1.FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.title = this.utilities.clientDeleteConfirmTitle;
        this.confirmDialogRef.componentInstance.confirmMessage = this.utilities.clientDeleteConfirmMessage;
        this.confirmDialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.progressbar.showProgress();
                _this.jobsService.deleteJobClient(client).then(function (response) {
                    if (response) {
                        _this.clearForm();
                        _this.progressbar.hideProgress();
                        _this.snackComp.showUnfinishedSnackBar(response["Message"]);
                    }
                });
            }
            _this.confirmDialogRef = null;
        });
    };
    JobsClientComponent.prototype.createClientForm = function () {
        return this.formBuilder.group({
            id: [this.clientForm.id],
            clientName: [this.clientForm.clientname],
            shortName: [this.clientForm.shortname]
        });
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], JobsClientComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], JobsClientComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], JobsClientComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], JobsClientComponent.prototype, "sort", void 0);
    JobsClientComponent = __decorate([
        core_1.Component({
            selector: 'clients',
            templateUrl: './jobs-client.component.html',
            styleUrls: ['./jobs-client.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], JobsClientComponent);
    return JobsClientComponent;
}());
exports.JobsClientComponent = JobsClientComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(jobsService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.jobsService = jobsService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        _this.filteredData = _this.jobsService.clients;
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
            this.jobsService.onClientChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            var data = _this.jobsService.clients.slice();
            data = _this.filterData(data);
            _this.filteredData = data.slice();
            data = _this.sortData(data);
            if (_this.directiveScroll) {
                _this.directiveScroll.scrollToTop(0, 500);
                _this.directiveScroll.update();
            }
            // Grab the page's slice of data.
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
                case 'jn_clientname':
                    _a = [a.clientname, b.clientname], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'jn_shortcode':
                    _b = [a.shortcode, b.shortcode], propertyA = _b[0], propertyB = _b[1];
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
