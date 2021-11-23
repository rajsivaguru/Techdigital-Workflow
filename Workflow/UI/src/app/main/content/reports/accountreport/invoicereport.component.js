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
var InvoiceReportComponent = /** @class */ (function () {
    function InvoiceReportComponent(reportService, jobsService, _sanitizer, router, formBuilder, loginService, snackComp, utilities) {
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
    InvoiceReportComponent.prototype.ngOnInit = function () {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
        this.progressbar = new app_model_1.ProgressBarConfig({});
        this.clientReport = this.createReportForm();
        this.dataSource = new FilesDataSource(this.reportService, this.paginator, this.sort);
        this._chartJSBar();
        this._chartJSPie();
        //this.getDays();
        //this.getClients();
        //var options = {
        //    animationEnabled: true,
        //    exportEnabled: true,
        //    title: {
        //        text: "Forecast for"
        //    },
        //    data: [{
        //        type: "column",
        //        dataPoints: [
        //            { y: 71, label: "Apple" },
        //            { y: 55, label: "Mango" },
        //            { y: 50, label: "Orange" },
        //            { y: 65, label: "Banana" },
        //            { y: 95, label: "Pineapple" },
        //            { y: 68, label: "Pears" },
        //            { y: 28, label: "Grapes" },
        //            { y: 34, label: "Lychee" },
        //            { y: 14, label: "Jackfruit" }
        //        ]
        //    }]
        //};
        //$("#chartContainer").CanvasJSChart(options);
        //let chart = new CanvasJS.Chart("chartContainer", {
        //    animationEnabled: true,
        //    exportEnabled: false,
        //    title: {
        //        text: "Fund Forecast for June 2019"
        //    },
        //    data: [{
        //        type: "stackedColumn",
        //        name: "Expected",
        //        showInLegend: "true",
        //        yValueFormatString: "#,##0mn tonnes",
        //        dataPoints: [
        //            { y: 111338, label: "USA" },
        //            { y: 49088, label: "Russia" },
        //            { y: 62200, label: "China" },
        //            { y: 90085, label: "India" },
        //            { y: 38600, label: "Australia" },
        //            { y: 48750, label: "SA" }
        //        ]
        //    },
        //    {
        //        type: "stackedColumn",
        //        name: "Actual",
        //        showInLegend: "true",
        //        yValueFormatString: "#,##0mn tonnes",
        //        dataPoints: [
        //            { y: 135305, label: "USA" },
        //            { y: 107922, label: "Russia" },
        //            { y: 52300, label: "China" },
        //            { y: 3360, label: "India" },
        //            { y: 39900, label: "Australia" },
        //            { y: 0, label: "SA" }
        //        ]
        //    }]
        //});
        //chart.render();
        //let chart2 = new CanvasJS.Chart("chartContainer2", {
        //    animationEnabled: true,
        //    exportEnabled: true,
        //    title: {
        //        text: "Basic Column Chart in Angular"
        //    },
        //    data: [{
        //        type: "column",
        //        dataPoints: [
        //            { y: 71, label: "Apple" },
        //            { y: 55, label: "Mango" },
        //            { y: 50, label: "Orange" },
        //            { y: 65, label: "Banana" },
        //            { y: 95, label: "Pineapple" },
        //            { y: 68, label: "Pears" },
        //            { y: 28, label: "Grapes" },
        //            { y: 34, label: "Lychee" },
        //            { y: 14, label: "Jackfruit" }
        //        ]
        //    }]
        //});
        //chart2.render();
    };
    InvoiceReportComponent.prototype._chartJSBar = function () {
        var ctx = 'myChart';
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Timesheet Expected', 'Timesheet Actual', 'Invoice', 'Payment', 'Bill Paid', 'Commission'],
                datasets: [
                    {
                        label: 'Expected Amount',
                        stack: 'Stack 1',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: 'Red',
                        hoverBackgroundColor: 'Red',
                        borderWidth: 1
                    },
                    {
                        label: 'Actual Amount',
                        stack: 'Stack 2',
                        data: [10, 15.23, 2, 5, 1.32, 2],
                        backgroundColor: 'Blue',
                        hoverBackgroundColor: 'Blue',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Fund Forecast for Current Month',
                    fontSize: 25,
                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    fontStyle: 'bold',
                    lineHeight: 2.0
                },
                legend: {
                    display: true,
                    labels: {
                        //fontColor: 'rgb(255, 99, 132)',
                        fontSize: 20,
                        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        lineHeight: 2.0
                    }
                },
                //tooltips: {
                //    mode: 'index',
                //    intersect: false
                //},
                responsive: true,
                scales: {
                    xAxes: [{
                            stacked: true
                        }],
                    yAxes: [{
                            stacked: true,
                            labelString: 'Amounts in USD'
                        }]
                }
            }
        });
    };
    InvoiceReportComponent.prototype._chartJSPie = function () {
        var ctx = 'myChartPie';
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Timesheet Expected', 'Timesheet Actual', 'Invoice', 'Payment', 'Bill Paid', 'Commission'],
                datasets: [
                    {
                        data: [12, 13.5, 3, 5.852, 2.05, 3],
                        label: 'Actual Amount',
                        backgroundColor: ['Red', 'Green', 'Orange', 'Blue', 'Gray', 'Yellow'],
                        hoverBackgroundColor: ['Red', 'Green', 'Orange', 'Blue', 'Gray', 'Yellow']
                        //borderWidth: 1
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Fund flow for Last Month',
                    fontSize: 25,
                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    fontStyle: 'bold',
                    lineHeight: 2.0
                },
                legend: {
                    display: true,
                    labels: {
                        //fontColor: 'rgb(255, 99, 132)',
                        fontSize: 20,
                        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        lineHeight: 2.0
                    }
                },
                tooltips: {
                    //mode: 'index',
                    //intersect: false
                    //backgroundColor: 'Beige'
                    footerSpacing: 5,
                    footerMarginTop: 10,
                    footerFontSize: 20,
                    bodyFontSize: 20,
                    bodySpacing: 5,
                    caretSize: 10,
                    xPadding: 15,
                    yPadding: 15
                },
                responsive: true,
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    };
    InvoiceReportComponent.prototype.ngOnDestroy = function () {
    };
    InvoiceReportComponent.prototype.onResize = function (event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
    };
    InvoiceReportComponent.prototype.selectedNoOfDays = function (event) {
        if (event.value != undefined) {
            this.searchValidation();
        }
    };
    InvoiceReportComponent.prototype.selectedClients = function (event) {
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
    InvoiceReportComponent.prototype.searchValidation = function () {
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
    InvoiceReportComponent.prototype.clearSearch = function () {
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
    InvoiceReportComponent.prototype.loadReport = function () {
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
    InvoiceReportComponent.prototype.loadDownloadableReport = function (fileType) {
        if (this.validateReportCriteria()) {
            this.rptForm.reporttype = fileType;
            this.reportService.getClientReportExport(this.rptForm);
        }
    };
    InvoiceReportComponent.prototype.createReportForm = function () {
        return this.formBuilder.group({
            clientIds: [this.rptForm.clientIds],
            jobcode: [this.rptForm.jobcode],
            title: [this.rptForm.title],
            publishedDate: [this.rptForm.publishedDate],
            lastDays: [this.rptForm.lastDays]
        });
    };
    InvoiceReportComponent.prototype.getDays = function () {
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
    InvoiceReportComponent.prototype.getClients = function () {
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
    InvoiceReportComponent.prototype.validateReportCriteria = function () {
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
    ], InvoiceReportComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], InvoiceReportComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], InvoiceReportComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], InvoiceReportComponent.prototype, "sort", void 0);
    InvoiceReportComponent = __decorate([
        core_1.Component({
            selector: 'invoice-report',
            templateUrl: './invoicereport.component.html',
            //styleUrls: ['../report.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], InvoiceReportComponent);
    return InvoiceReportComponent;
}());
exports.InvoiceReportComponent = InvoiceReportComponent;
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
