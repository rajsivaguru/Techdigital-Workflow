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
var dialog_component_1 = require("../../dialog/dialog.component");
var ProfileSearchReportComponent = /** @class */ (function () {
    function ProfileSearchReportComponent(dialog, reportService, _sanitizer, router, formBuilder, snackComp, utilities) {
        this.dialog = dialog;
        this.reportService = reportService;
        this._sanitizer = _sanitizer;
        this.router = router;
        this.formBuilder = formBuilder;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.settings = {};
        this.displayedColumns = ['r_username', 'r_title', 'r_location', 'r_searchengine', 'r_searcheddate', 'r_buttons_1'];
        this.datePipe = new common_1.DatePipe("en-US");
        this.isSearchEnable = false;
        this.usersDataList = [];
        this.lastDaysList = [];
        this.selectedUserIds = [];
        this.userIds = new forms_1.FormControl();
        this.todayDate = new Date();
        this.maxPublishedDate = null;
        this.rptForm = new reports_model_1.ProfileSearchReportParam({});
        this.maxPublishedDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.isSearchExpanded = true;
    }
    ProfileSearchReportComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.profileSearchReport = this.createReportForm();
        this.dataSource = new FilesDataSource(this.reportService, this.paginator, this.sort);
        this.getDays();
        this.getUsers();
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
            classes: 'custom_profilesearchreport_list',
            badgeShowLimit: 1
        };
    };
    ProfileSearchReportComponent.prototype.ngOnDestroy = function () {
    };
    ProfileSearchReportComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
    };
    ProfileSearchReportComponent.prototype.onItemSelect = function (item) {
        this.searchValidation();
    };
    ProfileSearchReportComponent.prototype.OnItemDeSelect = function (item) {
        this.searchValidation();
    };
    ProfileSearchReportComponent.prototype.onSelectAll = function (items) {
        this.searchValidation();
    };
    ProfileSearchReportComponent.prototype.onDeSelectAll = function (items) {
        this.searchValidation();
    };
    ProfileSearchReportComponent.prototype.selectedNoOfDays = function (event) {
        if (event.value != undefined) {
            this.searchValidation();
        }
    };
    ProfileSearchReportComponent.prototype.searchValidation = function () {
        this.rptForm = this.profileSearchReport.getRawValue();
        this.rptForm.userIds = this.selectedUserIds;
        if (this.rptForm.lastDays == undefined)
            this.rptForm.lastDays = -1;
        if (this.rptForm.userIds.length > 0 || this.rptForm.title != "" || this.rptForm.location != "" || this.rptForm.searcheddate != "" || this.rptForm.lastDays != -1) {
            this.isSearchEnable = true;
        }
        else
            this.isSearchEnable = false;
    };
    ProfileSearchReportComponent.prototype.clearSearch = function () {
        this.profileSearchReport.patchValue({
            userIds: [],
            title: '',
            location: '',
            searcheddate: '',
            lastDays: -1,
            loginid: 0,
            reporttype: ''
        });
        this.rptForm = this.profileSearchReport.getRawValue();
        this.selectedUserIds = [];
        this.userIds = new forms_1.FormControl();
        this.isSearchExpanded = true;
        this.isSearchEnable = false;
    };
    ProfileSearchReportComponent.prototype.loadReport = function () {
        var _this = this;
        if (this.validateReportCriteria()) {
            this.paginator.pageIndex = 0;
            this.isSearchExpanded = false;
            this.progressbar.showProgress();
            this.reportService.getProfileSearchReport(this.rptForm).then(function (response) {
                if (response) {
                    _this.progressbar.hideProgress();
                    _this.snackComp.showSnackBarGet(response, '');
                }
            });
        }
    };
    ProfileSearchReportComponent.prototype.openDetailsInModal = function (recordid) {
        var dialogUserList = this.dialog.open(dialog_component_1.DialogProfileSeachReportDetailComponent, {
            height: "490px",
            width: "600px",
            data: {
                title: 'Profile Search Details',
                item: this.reportService.profileSearchReports[0]
            }
        });
        dialogUserList.afterClosed().subscribe(function (result) {
        });
    };
    ProfileSearchReportComponent.prototype.loadDownloadableReport = function (fileType) {
        if (this.validateReportCriteria()) {
            this.rptForm.reporttype = fileType;
            this.reportService.getProfileSearchReportExport(this.rptForm);
        }
    };
    ProfileSearchReportComponent.prototype.createReportForm = function () {
        return this.formBuilder.group({
            userIds: [this.rptForm.userIds],
            title: [this.rptForm.title],
            location: [this.rptForm.location],
            searcheddate: [this.rptForm.searcheddate],
            lastDays: [this.rptForm.lastDays]
        });
    };
    ProfileSearchReportComponent.prototype.getDays = function () {
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
    ProfileSearchReportComponent.prototype.getUsers = function () {
        var _this = this;
        this.usersDataList = [];
        this.reportService.getUserForReport(1, true).then(function (response) {
            if (response) {
                response.map(function (user) {
                    _this.usersDataList.push({ "roleName": user["rolename"], "id": user["userid"], "itemName": user["name"] });
                });
            }
        });
    };
    ProfileSearchReportComponent.prototype.validateReportCriteria = function () {
        this.rptForm = this.profileSearchReport.getRawValue();
        this.rptForm.userIds = this.selectedUserIds;
        if (this.rptForm.lastDays == undefined)
            this.rptForm.lastDays = -1;
        if (this.rptForm.userIds.length == 0 && this.rptForm.title == "" && this.rptForm.location == "" && this.rptForm.searcheddate == "" && this.rptForm.lastDays == -1) {
            this.snackComp.showSimpleWarning("Please filter by any values");
            return false;
        }
        if (this.rptForm.searcheddate != "")
            this.rptForm.searcheddate = this.datePipe.transform(this.rptForm.searcheddate, 'MM/dd/yyyy');
        return true;
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], ProfileSearchReportComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], ProfileSearchReportComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], ProfileSearchReportComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], ProfileSearchReportComponent.prototype, "sort", void 0);
    ProfileSearchReportComponent = __decorate([
        core_1.Component({
            selector: 'profilesearch-report',
            templateUrl: './profilesearchreport.component.html',
            styleUrls: ['./profilesearchreport.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], ProfileSearchReportComponent);
    return ProfileSearchReportComponent;
}());
exports.ProfileSearchReportComponent = ProfileSearchReportComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(reportService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.reportService = reportService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        if (_this.reportService.profileSearchReports != undefined)
            _this.filteredData = _this.reportService.profileSearchReports;
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
            this.reportService.onProfileSearchReportChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            if (_this.reportService.profileSearchReports != undefined) {
                var data = _this.reportService.profileSearchReports.slice();
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
                case 'r_username':
                    _a = [a.username, b.username], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'r_title':
                    _b = [a.title, b.title], propertyA = _b[0], propertyB = _b[1];
                    break;
                case 'r_location':
                    _c = [a.location, b.location], propertyA = _c[0], propertyB = _c[1];
                    break;
                case 'r_searcheddate':
                    _d = [a.searcheddate, b.searcheddate], propertyA = _d[0], propertyB = _d[1];
                    break;
                case 'r_searchengine':
                    _e = [a.searchengine, b.searchengine], propertyA = _e[0], propertyB = _e[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a, _b, _c, _d, _e;
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
