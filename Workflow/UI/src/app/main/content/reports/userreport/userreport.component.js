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
var UserReportComponent = /** @class */ (function () {
    function UserReportComponent(reportService, snackBar, _sanitizer, router, formBuilder, loginService, userService) {
        var _this = this;
        this.reportService = reportService;
        this.snackBar = snackBar;
        this._sanitizer = _sanitizer;
        this.router = router;
        this.formBuilder = formBuilder;
        this.loginService = loginService;
        this.userService = userService;
        this.usersDataList = [];
        this.selectedUsers = [];
        this.settings = {};
        this.reportOptions = [
            { value: 'Pdf', viewValue: 'Pdf' },
            { value: 'Excel', viewValue: 'Excel' }
        ];
        //displayedColumns = [ 'ur_username', 'ur_jobcode', 'ur_title', 'ur_location', 'ur_clientname', 'ur_publisheddate', 'ur_assigneddate', 'ur_duration', 'ur_submission', 'ur_comment'];
        this.displayedColumns = ['ur_username', 'ur_job', 'ur_location', 'ur_clientname', 'ur_publisheddate', 'ur_assigneddate', 'ur_duration', 'ur_submission', 'ur_comment'];
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
                //console.log(ex)
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
                //console.log(ex)
                return Observable_1.Observable.of([]);
            }
        };
        this.autocompleListFormatterJob = function (data) {
            //console.log(data)
            var html = "<span class=\"font-weight-900 font-size-12\">" + data.title + " </span><span class=\"font-size-10\">" + data.location + " </span>";
            return _this._sanitizer.bypassSecurityTrustHtml(html);
        };
        this.autocompleListFormatterUser = function (data) {
            var html = "<span class=\"font-weight-900 font-size-12\">" + data.name + " </span><span class=\"font-size-10\">" + data.email + " </span>";
            return _this._sanitizer.bypassSecurityTrustHtml(html);
        };
        this.autocompleListSelectedJob = function (data) {
            //console.log('selected')
            return (data["title"]);
            //console.log(data)
        };
        this.autocompleListSelectedUser = function (data) {
            //console.log('selected')
            return (data["name"]);
            //console.log(data)
        };
        this.onUserReportChangedSubscription = this.reportService.onUserReportChanged.subscribe(function (jbs) {
            ;
            _this.users = jbs;
        });
        this.rptForm = new reports_model_1.UserReportParam({});
        this.maxFromDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.maxToDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.maxPublishedDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.isSearchExpanded = true;
    }
    UserReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.reduceHeight = 290;
        this.matTableInner = (window.innerHeight - this.reduceHeight);
        this.userReport = this.createJobForm();
        this.dataSource = new FilesDataSource(this.reportService, this.paginator, this.sort);
        this.reportService.getLastDays().then(function (response) {
            if (response) {
                response.map(function (priori) {
                    _this.lastDaysList.push({ "id": priori["Value"], "itemName": priori["Name"] });
                });
            }
        });
        this.userService.getAssignedUser(1).then(function (response) {
            if (response) {
                response.map(function (user) {
                    _this.usersDataList.push({ "roleName": user["rolename"], "id": user["userid"], "itemName": user["name"] });
                });
            }
        });
        this.settings = {
            maxHeight: '250px',
            searchAutofocus: true,
            singleSelection: false,
            text: "Users",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            enableCheckAll: true,
            classes: 'custom_userrpt_list',
            badgeShowLimit: 1
        };
    };
    UserReportComponent.prototype.onResize = function (event) {
        this.matTableInner = (window.innerHeight - this.reduceHeight);
    };
    UserReportComponent.prototype.onItemSelect = function (item) {
        this.searchValidation();
    };
    UserReportComponent.prototype.OnItemDeSelect = function (item) {
        this.searchValidation();
    };
    UserReportComponent.prototype.onSelectAll = function (items) {
        this.searchValidation();
    };
    UserReportComponent.prototype.onDeSelectAll = function (items) {
        this.searchValidation();
    };
    UserReportComponent.prototype.createJobForm = function () {
        return this.formBuilder.group({
            userids: [this.rptForm.userids],
            jobcode: [this.rptForm.jobcode],
            title: [this.rptForm.title],
            location: [this.rptForm.location],
            publisheddate: [this.rptForm.publisheddate],
            assigneddate: [this.rptForm.assigneddate],
            fromdate: [this.rptForm.fromdate],
            todate: [this.rptForm.todate],
            lastdays: [this.rptForm.lastdays]
        });
    };
    UserReportComponent.prototype.searchValidation = function () {
        this.rptForm = this.userReport.getRawValue();
        // if(this.rptForm.status == undefined)
        //     this.rptForm.status = -2;
        if (this.rptForm.lastdays == undefined)
            this.rptForm.lastdays = -1;
        if (this.rptForm.userids.length > 0 || this.rptForm.jobcode != "" || this.rptForm.title != "" || this.rptForm.location != "" || this.rptForm.publisheddate != "" || this.rptForm.assigneddate != ""
            || this.rptForm.fromdate != "" || this.rptForm.todate != "" || this.rptForm.lastdays != -1) {
            this.isSearchEnable = true;
        }
        else
            this.isSearchEnable = false;
    };
    UserReportComponent.prototype.clearSearch = function () {
        this.userReport.patchValue({
            userids: [],
            jobcode: '',
            title: '',
            location: '',
            publisheddate: '',
            assigneddate: '',
            fromdate: '',
            todate: '',
            lastdays: -1
        });
        this.rptForm = this.userReport.getRawValue();
        this.reportService.getUserReport(this.rptForm);
        this.isSearchExpanded = true;
        this.isSearchEnable = false;
    };
    UserReportComponent.prototype.validateReportCriteria = function () {
        this.rptForm = this.userReport.getRawValue();
        var userid = [];
        if (this.userReport.getRawValue()["userids"] != undefined && this.userReport.getRawValue()["userids"] != "" && this.userReport.getRawValue()["userids"].length > 0) {
            userid = this.userReport.getRawValue()["userids"].map(function (user) {
                return (user["id"]);
            });
        }
        this.rptForm.userids = userid;
        // if(this.rptForm.status == undefined)
        //     this.rptForm.status = -2;
        if (this.rptForm.lastdays == undefined)
            this.rptForm.lastdays = -1;
        if (this.rptForm.userids.length == 0 && this.rptForm.jobcode == "" && this.rptForm.title == "" && this.rptForm.location == "" && this.rptForm.publisheddate == "" && this.rptForm.assigneddate == ""
            && this.rptForm.fromdate == "" && this.rptForm.todate == "" && this.rptForm.lastdays == -1) {
            this.openDialog("Please filter by any Values!");
            return false;
        }
        if (this.rptForm.publisheddate != "")
            this.rptForm.publisheddate = this.datePipe.transform(this.rptForm.publisheddate, 'MM/dd/yyyy');
        if (this.rptForm.fromdate != "")
            this.rptForm.fromdate = this.datePipe.transform(this.rptForm.fromdate, 'MM/dd/yyyy');
        if (this.rptForm.todate != "")
            this.rptForm.todate = this.datePipe.transform(this.rptForm.todate, 'MM/dd/yyyy');
        if (this.rptForm.fromdate != "" && this.rptForm.todate == "") {
            this.openDialog("Please select the To date");
            return false;
        }
        if (this.rptForm.fromdate == "" && this.rptForm.todate != "") {
            this.openDialog("Please select the From date");
            return false;
        }
        return true;
    };
    UserReportComponent.prototype.loadReport = function (event) {
        if (this.validateReportCriteria()) {
            this.paginator.pageIndex = 0;
            this.isSearchExpanded = false;
            this.reportService.getUserReport(this.rptForm);
        }
    };
    UserReportComponent.prototype.loadDownloadableReport = function (fileType) {
        if (this.validateReportCriteria()) {
            this.rptForm.reporttype = fileType;
            this.reportService.getUserReportPdf(this.rptForm);
        }
    };
    UserReportComponent.prototype.ngOnDestroy = function () {
        this.onUserReportChangedSubscription.unsubscribe();
    };
    UserReportComponent.prototype.selectedFromDate = function (type, event) {
        this.minToDate = event.value;
        this.searchValidation();
        this.userReport.patchValue({
            lastdays: -1
        });
    };
    UserReportComponent.prototype.selectedToDate = function (type, event) {
        this.maxFromDate = event.value;
        this.searchValidation();
        this.userReport.patchValue({
            lastdays: -1
        });
    };
    UserReportComponent.prototype.selectedNoOfDays = function (event) {
        //console.log(event)
        if (event.value != undefined) {
            this.searchValidation();
            this.userReport.patchValue({
                fromdate: '',
                todate: ''
            });
        }
    };
    UserReportComponent.prototype.selectedExport = function (event) {
        if (event.value != undefined) {
            //this.reportService.getUserReportPdf();
        }
    };
    UserReportComponent.prototype.openDialog = function (message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            verticalPosition: 'top',
            extraClasses: ['mat-light-blue-100-bg']
        });
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], UserReportComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], UserReportComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], UserReportComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], UserReportComponent.prototype, "sort", void 0);
    UserReportComponent = __decorate([
        core_1.Component({
            selector: 'fuse-orderentry',
            templateUrl: './userreport.component.html',
            styleUrls: ['./userreport.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], UserReportComponent);
    return UserReportComponent;
}());
exports.UserReportComponent = UserReportComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(reportService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.reportService = reportService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        if (_this.reportService.userReports != undefined)
            _this.filteredData = _this.reportService.userReports;
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
            this.reportService.onUserReportChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            if (_this.reportService.userReports != undefined) {
                var data = _this.reportService.userReports.slice();
                data = _this.filterData(data);
                _this.filteredData = data.slice();
                data = _this.sortData(data);
                if (_this.directiveScroll) {
                    _this.directiveScroll.scrollToTop(0, 500);
                    _this.directiveScroll.update();
                }
                // Grab the page's slice of data.
                // if(this._paginator.pageSize.toString() == "All")
                // {
                //     this._paginator.pageIndex = 0;
                //     this._paginator.pageSize = data.length;
                //     return data;
                // }
                // else
                {
                    //console.log(this._sort.active)
                    //console.log(this._sort.direction)
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
        //displayedColumns = [ 'ur_userids', 'ur_username', 'ur_jobcode', 'ur_title', 'ur_location', 'ur_publisheddate', 'ur_assingeddate', 'ur_duration', 'ur_submission', 'ur_jobstarted'];
        //this._paginator.pageIndex = 0;
        return data.sort(function (a, b) {
            var propertyA = '';
            var propertyB = '';
            switch (_this._sort.active) {
                case 'ur_username':
                    _a = [a.username, b.username], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'ur_jobcode':
                    _b = [a.jobcode, b.jobcode], propertyA = _b[0], propertyB = _b[1];
                    break;
                case 'ur_title':
                    _c = [a.title, b.title], propertyA = _c[0], propertyB = _c[1];
                    break;
                case 'ur_location':
                    _d = [a.location, b.location], propertyA = _d[0], propertyB = _d[1];
                    break;
                case 'ur_publisheddate':
                    _e = [a.publisheddate, b.publisheddate], propertyA = _e[0], propertyB = _e[1];
                    break;
                case 'ur_assigneddate':
                    _f = [a.assigneddate, b.assigneddate], propertyA = _f[0], propertyB = _f[1];
                    break;
                case 'ur_duration':
                    _g = [a.duration, b.duration], propertyA = _g[0], propertyB = _g[1];
                    break;
                case 'ur_submission':
                    _h = [a.submission, b.submission], propertyA = _h[0], propertyB = _h[1];
                    break;
                case 'ur_jobstarted':
                    _j = [a.jobstarted, b.jobstarted], propertyA = _j[0], propertyB = _j[1];
                    break;
                case 'ur_comment':
                    _k = [a.comment, b.comment], propertyA = _k[0], propertyB = _k[1];
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
