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
var Observable_1 = require("rxjs/Observable");
var material_1 = require("@angular/material");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var collections_1 = require("@angular/cdk/collections");
var animations_1 = require("../../../../core/animations");
var fuseUtils_1 = require("../../../../core/fuseUtils");
var reports_model_1 = require("../reports.model");
var common_1 = require("@angular/common");
var fuse_perfect_scrollbar_directive_1 = require("../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive");
var JobReportComponent = /** @class */ (function () {
    function JobReportComponent(reportService, snackBar, _sanitizer, router, formBuilder, loginService) {
        var _this = this;
        this.reportService = reportService;
        this.snackBar = snackBar;
        this._sanitizer = _sanitizer;
        this.router = router;
        this.formBuilder = formBuilder;
        this.loginService = loginService;
        //displayedColumns = [ 'r_ReferenceId', 'r_Title', 'r_Location', 'r_PublishedDate', 'r_IsActive', 'r_UserCount', 'r_Users', 'r_Duration', 'r_Submission'];
        this.displayedColumns = ['r_ReferenceId', 'r_Title', 'r_Location', 'r_ClientName', 'r_PublishedDate', 'r_IsActive', 'r_UserCount', 'r_Users', 'r_Duration', 'r_Submission'];
        this.datePipe = new common_1.DatePipe("en-US");
        this.isSearchEnable = false;
        this.lastDaysList = [];
        this.todayDate = new Date();
        this.minFromDate = null;
        this.minToDate = null;
        this.maxFromDate = null;
        this.maxToDate = null;
        this.maxPublishedDate = null;
        this.searchJob = function (keyword) {
            try {
                if (keyword) {
                    return _this.reportService.searchJob(keyword);
                }
                else {
                    return Observable_1.Observable.of([]);
                }
            }
            catch (ex) {
                return Observable_1.Observable.of([]);
            }
        };
        this.searchUser = function (keyword) {
            try {
                if (keyword) {
                    return _this.reportService.searchUser(keyword);
                }
                else {
                    return Observable_1.Observable.of([]);
                }
            }
            catch (ex) {
                return Observable_1.Observable.of([]);
            }
        };
        this.autocompleListFormatterJob = function (data) {
            var html = "<span class=\"font-weight-900 font-size-12\">" + data.title + " </span><span class=\"font-size-10\">" + data.location + " </span>";
            return _this._sanitizer.bypassSecurityTrustHtml(html);
        };
        this.autocompleListFormatterUser = function (data) {
            var html = "<span class=\"font-weight-900 font-size-12\">" + data.name + " </span><span class=\"font-size-10\">" + data.email + " </span>";
            return _this._sanitizer.bypassSecurityTrustHtml(html);
        };
        this.autocompleListSelectedJob = function (data) {
            return (data["title"]);
        };
        this.autocompleListSelectedUser = function (data) {
            return (data["name"]);
        };
        this.onContactsChangedSubscription = this.reportService.onContactsChanged.subscribe(function (jbs) {
            _this.jobs = jbs;
        });
        this.rptForm = new reports_model_1.JobReportForm({});
        this.maxFromDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.maxToDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.maxPublishedDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.isSearchExpanded = true;
    }
    JobReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.reduceHeight = 290;
        this.matTableInner = (window.innerHeight - this.reduceHeight);
        this.jobReport = this.createJobForm();
        this.dataSource = new FilesDataSource(this.reportService, this.paginator, this.sort);
        this.reportService.getLastDays().then(function (response) {
            if (response) {
                response.map(function (priori) {
                    _this.lastDaysList.push({ "id": priori["Value"], "itemName": priori["Name"] });
                });
            }
        });
    };
    JobReportComponent.prototype.onResize = function (event) {
        this.matTableInner = (window.innerHeight - this.reduceHeight);
    };
    JobReportComponent.prototype.createJobForm = function () {
        return this.formBuilder.group({
            jobcode: [this.rptForm.jobcode],
            title: [this.rptForm.title],
            location: [this.rptForm.location],
            publishedDate: [this.rptForm.publishedDate],
            status: [this.rptForm.status],
            fromDate: [this.rptForm.fromDate],
            toDate: [this.rptForm.toDate],
            lastDatys: [this.rptForm.lastDatys]
        });
    };
    JobReportComponent.prototype.searchValidation = function () {
        this.rptForm = this.jobReport.getRawValue();
        if (this.rptForm.status == undefined)
            this.rptForm.status = -2;
        if (this.rptForm.lastDatys == undefined)
            this.rptForm.lastDatys = -1;
        if (this.rptForm.jobcode != "" || this.rptForm.title != "" || this.rptForm.location != "" || this.rptForm.publishedDate != ""
            || this.rptForm.fromDate != "" || this.rptForm.toDate != "" || this.rptForm.status != -2 || this.rptForm.lastDatys != -1) {
            this.isSearchEnable = true;
        }
        else
            this.isSearchEnable = false;
    };
    JobReportComponent.prototype.clearSearch = function () {
        this.jobReport.patchValue({
            jobcode: '',
            title: '',
            location: '',
            publishedDate: '',
            status: -2,
            fromDate: '',
            toDate: '',
            lastDatys: -1
        });
        this.rptForm = this.jobReport.getRawValue();
        this.reportService.getJobs(this.rptForm);
        this.isSearchExpanded = true;
        this.isSearchEnable = false;
    };
    JobReportComponent.prototype.loadReport = function () {
        this.rptForm = this.jobReport.getRawValue();
        if (this.rptForm.status == undefined)
            this.rptForm.status = -2;
        if (this.rptForm.lastDatys == undefined)
            this.rptForm.lastDatys = -1;
        if (this.rptForm.jobcode == "" && this.rptForm.title == "" && this.rptForm.location == "" && this.rptForm.publishedDate == ""
            && this.rptForm.fromDate == "" && this.rptForm.toDate == "" && this.rptForm.status == -2 && this.rptForm.lastDatys == -1) {
            this.openDialog("Please filter by any Values!");
            return;
        }
        if (this.rptForm.publishedDate != "")
            this.rptForm.publishedDate = this.datePipe.transform(this.rptForm.publishedDate, 'MM/dd/yyyy');
        if (this.rptForm.fromDate != "")
            this.rptForm.fromDate = this.datePipe.transform(this.rptForm.fromDate, 'MM/dd/yyyy');
        if (this.rptForm.toDate != "")
            this.rptForm.toDate = this.datePipe.transform(this.rptForm.toDate, 'MM/dd/yyyy');
        if (this.rptForm.fromDate != "" && this.rptForm.toDate == "") {
            this.openDialog("Please select the To date");
            return;
        }
        if (this.rptForm.fromDate == "" && this.rptForm.toDate != "") {
            this.openDialog("Please select the From date");
            return;
        }
        this.paginator.pageIndex = 0;
        this.isSearchExpanded = false;
        this.reportService.getJobs(this.rptForm);
    };
    JobReportComponent.prototype.ngOnDestroy = function () {
        this.onContactsChangedSubscription.unsubscribe();
    };
    JobReportComponent.prototype.selectedFromDate = function (type, event) {
        this.minToDate = event.value;
        this.searchValidation();
        this.jobReport.patchValue({
            lastDatys: -1
        });
    };
    JobReportComponent.prototype.selectedToDate = function (type, event) {
        this.maxFromDate = event.value;
        this.searchValidation();
        this.jobReport.patchValue({
            lastDatys: -1
        });
    };
    JobReportComponent.prototype.selectedNoOfDays = function (event) {
        if (event.value != undefined) {
            this.searchValidation();
            this.jobReport.patchValue({
                fromDate: '',
                toDate: ''
            });
        }
    };
    JobReportComponent.prototype.openDialog = function (message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            verticalPosition: 'top',
            extraClasses: ['mat-light-blue-100-bg']
        });
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], JobReportComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], JobReportComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], JobReportComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], JobReportComponent.prototype, "sort", void 0);
    JobReportComponent = __decorate([
        core_1.Component({
            selector: 'fuse-orderentry',
            templateUrl: './jobreport.component.html',
            styleUrls: ['./jobreport.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], JobReportComponent);
    return JobReportComponent;
}());
exports.JobReportComponent = JobReportComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(reportService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.reportService = reportService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        if (_this.reportService.jobReports != undefined)
            _this.filteredData = _this.reportService.jobReports;
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
            this.reportService.onContactsChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            if (_this.reportService.jobReports != undefined) {
                var data = _this.reportService.jobReports.slice();
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
                case 'r_ReferenceId':
                    _a = [a.ReferenceId, b.ReferenceId], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'r_Title':
                    _b = [a.Title, b.Title], propertyA = _b[0], propertyB = _b[1];
                    break;
                case 'r_Location':
                    _c = [a.Location, b.Location], propertyA = _c[0], propertyB = _c[1];
                    break;
                case 'r_ClientName':
                    _d = [a.ClientName, b.ClientName], propertyA = _d[0], propertyB = _d[1];
                    break;
                case 'r_PublishedDate':
                    _e = [a.PublishedDate, b.PublishedDate], propertyA = _e[0], propertyB = _e[1];
                    break;
                case 'r_IsActive':
                    _f = [a.IsActive, b.IsActive], propertyA = _f[0], propertyB = _f[1];
                    break;
                case 'r_UserCount':
                    _g = [a.UserCount, b.UserCount], propertyA = _g[0], propertyB = _g[1];
                    break;
                case 'r_Users':
                    _h = [a.Users, b.Users], propertyA = _h[0], propertyB = _h[1];
                    break;
                case 'r_Duration':
                    _j = [a.Duration, b.Duration], propertyA = _j[0], propertyB = _j[1];
                    break;
                case 'r_Submission':
                    _k = [a.Submission, b.Submission], propertyA = _k[0], propertyB = _k[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
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
