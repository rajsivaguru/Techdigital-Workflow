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
var forms_1 = require("@angular/forms");
var collections_1 = require("@angular/cdk/collections");
var common_1 = require("@angular/common");
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var fuse_perfect_scrollbar_directive_1 = require("../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive");
var animations_1 = require("../../../../core/animations");
var fuseUtils_1 = require("../../../../core/fuseUtils");
var app_model_1 = require("../../../../app.model");
var reports_model_1 = require("../reports.model");
var ClientReportComponent = /** @class */ (function () {
    function ClientReportComponent(reportService, jobsService, _sanitizer, router, formBuilder, loginService, snackComp, utilities) {
        this.reportService = reportService;
        this.jobsService = jobsService;
        this._sanitizer = _sanitizer;
        this.router = router;
        this.formBuilder = formBuilder;
        this.loginService = loginService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.displayedColumns = ['r_clientname', 'r_jobcode', 'r_title', 'r_location', 'r_publisheddate', 'r_jobstatus', 'r_assignments', 'r_submissions'];
        this.datePipe = new common_1.DatePipe("en-US");
        this.isSearchEnable = false;
        this.clientList = [];
        this.lastDaysList = [];
        this.selectedClientIds = [];
        this.clientIds = new forms_1.FormControl();
        this.todayDate = new Date();
        this.maxPublishedDate = null;
        this.rptForm = new reports_model_1.ClientReportParam({});
        this.maxPublishedDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.isSearchExpanded = true;
    }
    ClientReportComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.clientReport = this.createReportForm();
        this.dataSource = new FilesDataSource(this.reportService, this.paginator, this.sort);
        this.getDays();
        this.getClients();
    };
    ClientReportComponent.prototype.ngOnDestroy = function () {
    };
    ClientReportComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
    };
    ClientReportComponent.prototype.selectedNoOfDays = function (event) {
        if (event.value != undefined) {
            this.searchValidation();
        }
    };
    ClientReportComponent.prototype.selectedClients = function (event) {
        var _this = this;
        if (event.value != undefined) {
            this.selectedClientIds = [];
            event.value.forEach(function (client) {
                var item = _this.clientList.filter(function (x) { return x.clientname == client; });
                if (item.length > 0)
                    _this.selectedClientIds.push(item[0].id);
            });
            this.searchValidation();
        }
    };
    ClientReportComponent.prototype.searchValidation = function () {
        this.rptForm = this.clientReport.getRawValue();
        this.rptForm.clientIds = this.selectedClientIds;
        if (this.rptForm.lastDays == undefined)
            this.rptForm.lastDays = -1;
        if (this.rptForm.clientIds.length > 0 || this.rptForm.jobcode != "" || this.rptForm.title != "" || this.rptForm.publishedDate != "" || this.rptForm.lastDays != -1) {
            this.isSearchEnable = true;
        }
        else
            this.isSearchEnable = false;
    };
    ClientReportComponent.prototype.clearSearch = function () {
        this.clientReport.patchValue({
            clientIds: [],
            jobcode: '',
            title: '',
            publishedDate: '',
            lastDays: -1,
            loginid: 0,
            reporttype: ''
        });
        this.rptForm = this.clientReport.getRawValue();
        this.selectedClientIds = [];
        this.clientIds = new forms_1.FormControl();
        this.isSearchExpanded = true;
        this.isSearchEnable = false;
    };
    ClientReportComponent.prototype.loadReport = function () {
        var _this = this;
        if (this.validateReportCriteria()) {
            this.paginator.pageIndex = 0;
            this.isSearchExpanded = false;
            this.progressbar.showProgress();
            this.reportService.getClientReport(this.rptForm).then(function (response) {
                if (response) {
                    _this.progressbar.hideProgress();
                    _this.snackComp.showSnackBarGet(response, '');
                }
            });
        }
    };
    ClientReportComponent.prototype.loadDownloadableReport = function (fileType) {
        if (this.validateReportCriteria()) {
            this.rptForm.reporttype = fileType;
            this.reportService.getClientReportExport(this.rptForm);
        }
    };
    ClientReportComponent.prototype.createReportForm = function () {
        return this.formBuilder.group({
            clientIds: [this.rptForm.clientIds],
            jobcode: [this.rptForm.jobcode],
            title: [this.rptForm.title],
            publishedDate: [this.rptForm.publishedDate],
            lastDays: [this.rptForm.lastDays]
        });
    };
    ClientReportComponent.prototype.getDays = function () {
        var _this = this;
        this.lastDaysList = [];
        this.reportService.getLastDays().then(function (response) {
            if (response) {
                response.map(function (day) {
                    _this.lastDaysList.push({ "id": day["Value"], "itemName": day["Name"] });
                });
            }
        });
    };
    ClientReportComponent.prototype.getClients = function () {
        var _this = this;
        this.clientList = [];
        this.jobsService.getClients().then(function (response) {
            if (response) {
                response.map(function (client) {
                    _this.clientList.push({ "id": client["id"], "clientname": client["clientname"] });
                });
            }
        });
    };
    ClientReportComponent.prototype.validateReportCriteria = function () {
        this.rptForm = this.clientReport.getRawValue();
        this.rptForm.clientIds = this.selectedClientIds;
        if (this.rptForm.lastDays == undefined)
            this.rptForm.lastDays = -1;
        if (this.rptForm.clientIds.length == 0 && this.rptForm.jobcode == "" && this.rptForm.title == "" && this.rptForm.publishedDate == "" && this.rptForm.lastDays == -1) {
            this.snackComp.showSimpleWarning("Please filter by any values");
            return false;
        }
        if (this.rptForm.publishedDate != "")
            this.rptForm.publishedDate = this.datePipe.transform(this.rptForm.publishedDate, 'MM/dd/yyyy');
        return true;
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], ClientReportComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], ClientReportComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], ClientReportComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], ClientReportComponent.prototype, "sort", void 0);
    ClientReportComponent = __decorate([
        core_1.Component({
            selector: 'client-report',
            templateUrl: './clientreport.component.html',
            styleUrls: ['../report.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], ClientReportComponent);
    return ClientReportComponent;
}());
exports.ClientReportComponent = ClientReportComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(reportService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.reportService = reportService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        if (_this.reportService.clientReports != undefined)
            _this.filteredData = _this.reportService.clientReports;
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
            this.reportService.onClientReportChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            if (_this.reportService.clientReports != undefined) {
                var data = _this.reportService.clientReports.slice();
                data = _this.filterData(data);
                _this.filteredData = data.slice();
                data = _this.sortData(data);
                if (_this.directiveScroll) {
                    _this.directiveScroll.scrollToTop(0, 500);
                    _this.directiveScroll.update();
                }
                {
                    var startIndex = _this._paginator.pageIndex * _this._paginator.pageSize;
                    return data.splice(startIndex, _this._paginator.pageSize);
                }
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
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }
        return data.sort(function (a, b) {
            var propertyA = '';
            var propertyB = '';
            switch (_this._sort.active) {
                case 'r_jobcode':
                    _a = [a.ReferenceId, b.ReferenceId], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'r_title':
                    _b = [a.Title, b.Title], propertyA = _b[0], propertyB = _b[1];
                    break;
                case 'r_location':
                    _c = [a.Location, b.Location], propertyA = _c[0], propertyB = _c[1];
                    break;
                case 'r_clientname':
                    _d = [a.ClientName, b.ClientName], propertyA = _d[0], propertyB = _d[1];
                    break;
                case 'r_publisheddate':
                    _e = [a.PublishedDate, b.PublishedDate], propertyA = _e[0], propertyB = _e[1];
                    break;
                case 'r_jobstatus':
                    _f = [a.IsActive, b.IsActive], propertyA = _f[0], propertyB = _f[1];
                    break;
                case 'r_assignments':
                    _g = [a.UserCount, b.UserCount], propertyA = _g[0], propertyB = _g[1];
                    break;
                case 'r_submissions':
                    _h = [a.Users, b.Users], propertyA = _h[0], propertyB = _h[1];
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
