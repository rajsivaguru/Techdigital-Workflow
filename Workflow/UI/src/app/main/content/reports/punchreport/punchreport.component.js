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
var PunchReportComponent = /** @class */ (function () {
    function PunchReportComponent(reportService, _sanitizer, router, formBuilder, loginService, snackComp, utilities) {
        this.reportService = reportService;
        this._sanitizer = _sanitizer;
        this.router = router;
        this.formBuilder = formBuilder;
        this.loginService = loginService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.usersDataList = [];
        this.selectedUsers = [];
        this.settings = {};
        this.displayedColumns = ['r_punchdate', 'r_user', 'r_intime', 'r_outtime', 'r_notes', 'r_hourday', 'r_isabsent'];
        this.datePipe = new common_1.DatePipe("en-US");
        this.isSearchEnable = false;
        this.userRoleList = [];
        this.selectedUserRoleIds = [];
        this.userRoleIds = new forms_1.FormControl();
        this.todayDate = new Date();
        this.minFromDate = null;
        this.minToDate = null;
        this.maxFromDate = null;
        this.maxToDate = null;
        this.rptForm = new reports_model_1.PunchReportParam({});
        this.maxFromDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.maxToDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.isSearchExpanded = true;
    }
    PunchReportComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.punchReport = this.createReportForm();
        this.dataSource = new FilesDataSource(this.reportService, this.paginator, this.sort);
        this.getUsersForReport();
        this.settings = {
            height: '350px',
            maxHeight: '350px',
            searchAutofocus: true,
            singleSelection: false,
            text: "Users",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            enableCheckAll: true,
            classes: 'custom_punchreport_list',
            badgeShowLimit: 1
        };
    };
    PunchReportComponent.prototype.ngOnDestroy = function () {
    };
    PunchReportComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
    };
    PunchReportComponent.prototype.onItemSelect = function (item) {
        this.searchValidation();
    };
    PunchReportComponent.prototype.OnItemDeSelect = function (item) {
        this.searchValidation();
    };
    PunchReportComponent.prototype.onSelectAll = function (items) {
        this.searchValidation();
    };
    PunchReportComponent.prototype.onDeSelectAll = function (items) {
        this.searchValidation();
    };
    PunchReportComponent.prototype.selectedFromDate = function (type, event) {
        this.minToDate = event.value;
        this.searchValidation();
    };
    PunchReportComponent.prototype.selectedToDate = function (type, event) {
        this.maxFromDate = event.value;
        this.searchValidation();
    };
    PunchReportComponent.prototype.selectedNoOfDays = function (event) {
        if (event.value != undefined) {
            this.punchReport.patchValue({ fromDate: '', toDate: '' });
            this.searchValidation();
        }
    };
    PunchReportComponent.prototype.searchValidation = function () {
        this.rptForm = this.punchReport.getRawValue();
        if ((this.rptForm.fromDate != "" && this.rptForm.toDate != "")) {
            this.isSearchEnable = true;
        }
        else
            this.isSearchEnable = false;
    };
    PunchReportComponent.prototype.clearSearch = function () {
        this.punchReport.patchValue({
            userRoleIds: [],
            userids: [],
            showOnlyMissingTime: false,
            includeWeekends: true,
            fromDate: '',
            toDate: '',
            loginid: 0,
            reporttype: ''
        });
        this.rptForm = this.punchReport.getRawValue();
        this.selectedUserRoleIds = [];
        this.userRoleIds = new forms_1.FormControl();
        this.isSearchExpanded = true;
        this.isSearchEnable = false;
    };
    PunchReportComponent.prototype.loadReport = function () {
        var _this = this;
        if (this.validateReportCriteria()) {
            this.paginator.pageIndex = 0;
            this.isSearchExpanded = false;
            this.progressbar.showProgress();
            this.reportService.getPunchReport(this.rptForm).then(function (response) {
                if (response) {
                    _this.progressbar.hideProgress();
                    _this.snackComp.showSnackBarGet(response, '');
                }
            });
        }
    };
    PunchReportComponent.prototype.loadDownloadableReport = function (fileType) {
        this.snackComp.showSimpleWarning("Export is not available for this Report.");
        //if (this.validateReportCriteria()) {
        //    this.rptForm.reporttype = fileType;
        //    this.reportService.getPunchReportExport(this.rptForm);
        //}
    };
    PunchReportComponent.prototype.createReportForm = function () {
        return this.formBuilder.group({
            userids: [this.rptForm.userids],
            showOnlyMissingTime: [this.rptForm.showOnlyMissingTime],
            includeWeekends: [this.rptForm.includeWeekends],
            userRoleIds: [this.rptForm.userRoleIds],
            fromDate: [this.rptForm.fromDate],
            toDate: [this.rptForm.toDate]
        });
    };
    PunchReportComponent.prototype.getUsersForReport = function () {
        var _this = this;
        this.usersDataList = [];
        this.reportService.getUserForReport(1, false).then(function (response) {
            if (response) {
                response.map(function (user) {
                    _this.usersDataList.push({ "roleName": user["rolename"], "id": user["userid"], "itemName": user["name"] });
                });
            }
        });
    };
    PunchReportComponent.prototype.validateReportCriteria = function () {
        this.rptForm = this.punchReport.getRawValue();
        var userid = [];
        if (this.punchReport.getRawValue()["userids"] != undefined && this.punchReport.getRawValue()["userids"] != "" && this.punchReport.getRawValue()["userids"].length > 0) {
            userid = this.punchReport.getRawValue()["userids"].map(function (user) {
                return (user["id"]);
            });
        }
        this.rptForm.userids = userid;
        if (this.rptForm.fromDate == "" && this.rptForm.toDate == "") {
            this.snackComp.showSimpleWarning("Please filter by any values");
            return false;
        }
        if (this.rptForm.fromDate != "")
            this.rptForm.fromDate = this.datePipe.transform(this.rptForm.fromDate, 'MM/dd/yyyy');
        if (this.rptForm.toDate != "")
            this.rptForm.toDate = this.datePipe.transform(this.rptForm.toDate, 'MM/dd/yyyy');
        return true;
    };
    /* Not used.  Need to check the code once get the UserRole implementation. */
    PunchReportComponent.prototype.selectedUserRole = function (event) {
        var _this = this;
        if (event.value != undefined) {
            this.selectedUserRoleIds = [];
            event.value.forEach(function (role) {
                var item = _this.userRoleList.filter(function (x) { return x.rolename == role; });
                if (item.length > 0)
                    _this.selectedUserRoleIds.push(item[0].id);
            });
            this.searchValidation();
        }
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], PunchReportComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], PunchReportComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], PunchReportComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], PunchReportComponent.prototype, "sort", void 0);
    PunchReportComponent = __decorate([
        core_1.Component({
            selector: 'punch-report',
            templateUrl: './punchreport.component.html',
            styleUrls: ['../report.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], PunchReportComponent);
    return PunchReportComponent;
}());
exports.PunchReportComponent = PunchReportComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(reportService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.reportService = reportService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        if (_this.reportService.punchReports != undefined)
            _this.filteredData = _this.reportService.punchReports;
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
            this.reportService.onPunchReportChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            if (_this.reportService.punchReports != undefined) {
                var data = _this.reportService.punchReports.slice();
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
            //switch (this._sort.active) {
            //    case 'r_jobcode':
            //        [propertyA, propertyB] = [a.ReferenceId, b.ReferenceId];
            //        break;
            //    case 'r_title':
            //        [propertyA, propertyB] = [a.Title, b.Title];
            //        break;
            //    case 'r_location':
            //        [propertyA, propertyB] = [a.Location, b.Location];
            //        break;
            //    case 'r_clientname':
            //        [propertyA, propertyB] = [a.ClientName, b.ClientName];
            //        break;
            //    case 'r_publisheddate':
            //        [propertyA, propertyB] = [a.PublishedDate, b.PublishedDate];
            //        break;
            //    case 'r_jobstatus':
            //        [propertyA, propertyB] = [a.IsActive, b.IsActive];
            //        break;
            //    case 'r_assignments':
            //        [propertyA, propertyB] = [a.UserCount, b.UserCount];
            //        break;
            //    case 'r_submissions':
            //        [propertyA, propertyB] = [a.Users, b.Users];
            //        break;
            //}
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
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
