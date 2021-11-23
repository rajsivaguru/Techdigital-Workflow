import { Component, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange, MatDialog, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { AbstractControl, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { fuseAnimations } from '../../../../core/animations';
import { FuseUtils } from '../../../../core/fuseUtils';
import { ProgressBarConfig } from '../../../../app.model';
import { LoginService } from '../../login/login.service';
import { JobsService } from '../../jobs/jobs.service';
import { ReportsService } from '../reports.service';
import { SnackBarService } from '../../dialog/snackbar.service'
import { ClientReportParam } from '../reports.model';
import { Utilities } from '../../common/commonUtil';

declare let CanvasJS: any;
declare let Chart: any;

@Component({
    selector: 'invoice-report',
    templateUrl: './invoicereport.component.html',
    //styleUrls: ['../report.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class InvoiceReportComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: FilesDataSource | null;
    displayedColumns = ['r_clientname', 'r_jobcode', 'r_title', 'r_location', 'r_publisheddate', 'r_jobstatus', 'r_assignments', 'r_submissions'];
    datePipe = new DatePipe("en-US");
    progressbar: ProgressBarConfig;
    isSearchExpanded: boolean
    isSearchEnable: boolean = false;
    clientList = [];
    lastDaysList = [];
    selectedClientIds = [];
    clientReport: FormGroup;
    rptForm: ClientReportParam;
    clientIds = new FormControl();
    todayDate = new Date();
    maxPublishedDate = null;
    matTableInner: number;

    constructor(
        private reportService: ReportsService,
        private jobsService: JobsService,
        private _sanitizer: DomSanitizer,
        private router: Router,
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    )
    {
        this.rptForm = new ClientReportParam({});
        this.maxPublishedDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.isSearchExpanded = true;
    }

    ngOnInit()
    {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
        this.progressbar = new ProgressBarConfig({});
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
    }

    private _chartJSBar()
    {
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
                    }
                    , {
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
    }

    private _chartJSPie() {
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
    }


    ngOnDestroy() {
        
    }

    onResize(event)
    {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
    }

    selectedNoOfDays(event)
    {
        if (event.value != undefined) {
            this.searchValidation();
        }
    }

    selectedClients(event)
    {
        if (event.value != undefined)
        {
            this.selectedClientIds = [];

            event.value.forEach(client => {
                var item = this.clientList.filter(x => x.clientname == client);
                if(item.length > 0)
                    this.selectedClientIds.push(item[0].id);
            })

            this.searchValidation();
        }
    }

    searchValidation()
    {
        this.rptForm = this.clientReport.getRawValue();

        this.rptForm.clientIds = this.selectedClientIds;

        if (this.rptForm.lastDays == undefined)
            this.rptForm.lastDays = -1;

        if (this.rptForm.clientIds.length > 0 || this.rptForm.jobcode != "" || this.rptForm.title != "" || this.rptForm.publishedDate != "" || this.rptForm.lastDays != -1)
        {
            this.isSearchEnable = true;
        }
        else
            this.isSearchEnable = false;
    }

    clearSearch() {
        this.clientReport.patchValue(
        {
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
        this.clientIds = new FormControl();
        this.isSearchExpanded = true;
        this.isSearchEnable = false;
    }

    loadReport()
    {
        if (this.validateReportCriteria())
        {
            this.paginator.pageIndex = 0;
            this.isSearchExpanded = false;
            this.progressbar.showProgress();

            this.reportService.getClientReport(this.rptForm).then(response => {
                if (response) {
                    this.progressbar.hideProgress();
                    this.snackComp.showSnackBarGet(response, '');
                }
            });
        }
    }

    loadDownloadableReport(fileType) {
        if (this.validateReportCriteria()) {
            this.rptForm.reporttype = fileType;
            this.reportService.getClientReportExport(this.rptForm);
        }
    }


    private createReportForm() {
        return this.formBuilder.group({
            clientIds: [this.rptForm.clientIds],
            jobcode: [this.rptForm.jobcode],
            title: [this.rptForm.title],
            publishedDate: [this.rptForm.publishedDate],
            lastDays: [this.rptForm.lastDays]
        });
    }

    private getDays() {
        this.lastDaysList = [];
        this.reportService.getLastDays().then(response => {
            if (response) {
                response.map(day => {
                    this.lastDaysList.push({ "id": day["Value"], "itemName": day["Name"] })
                });
            }
        });
    }

    private getClients() {
        this.clientList = [];
        this.jobsService.getClients().then(response => {
            if (response) {
                response.map(client => {
                    this.clientList.push({ "id": client["id"], "clientname": client["clientname"] })
                });
            }
        });
    }

    private validateReportCriteria()
    {
        this.rptForm = this.clientReport.getRawValue();
        this.rptForm.clientIds = this.selectedClientIds;

        if (this.rptForm.lastDays == undefined)
            this.rptForm.lastDays = -1;

        if (this.rptForm.clientIds.length == 0 && this.rptForm.jobcode == "" && this.rptForm.title == "" && this.rptForm.publishedDate == "" && this.rptForm.lastDays == -1) {
            this.snackComp.showSimpleWarning("Please filter by any values")
            return false;
        }

        if (this.rptForm.publishedDate != "")
            this.rptForm.publishedDate = this.datePipe.transform(this.rptForm.publishedDate, 'MM/dd/yyyy');

        return true;
    }
}

export class FilesDataSource extends DataSource<any>
{
    @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;

    _filterChange = new BehaviorSubject('');
    _filteredDataChange = new BehaviorSubject('');

    get filteredData(): any {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any) {
        this._filteredDataChange.next(value);
    }

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    constructor(private reportService: ReportsService, private _paginator: MatPaginator, private _sort: MatSort) {
        super();
        if (this.reportService.clientReports != undefined)
            this.filteredData = this.reportService.clientReports;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
        const displayDataChanges = [
            this.reportService.onClientReportChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];

        return Observable.merge(...displayDataChanges).map(() => {

            if (this.reportService.clientReports != undefined) {
                let data = this.reportService.clientReports.slice();

                data = this.filterData(data);
                this.filteredData = [...data];
                data = this.sortData(data);

                if (this.directiveScroll) {
                    this.directiveScroll.scrollToTop(0, 500);
                    this.directiveScroll.update();
                }
                {
                    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
                    return data.splice(startIndex, this._paginator.pageSize);
                }
            }
        });
    }

    filterData(data) {
        if (!this.filter) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    sortData(data): any[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'r_jobcode':
                    [propertyA, propertyB] = [a.ReferenceId, b.ReferenceId];
                    break;
                case 'r_title':
                    [propertyA, propertyB] = [a.Title, b.Title];
                    break;
                case 'r_location':
                    [propertyA, propertyB] = [a.Location, b.Location];
                    break;
                case 'r_clientname':
                    [propertyA, propertyB] = [a.ClientName, b.ClientName];
                    break;
                case 'r_publisheddate':
                    [propertyA, propertyB] = [a.PublishedDate, b.PublishedDate];
                    break;
                case 'r_jobstatus':
                    [propertyA, propertyB] = [a.IsActive, b.IsActive];
                    break;
                case 'r_assignments':
                    [propertyA, propertyB] = [a.UserCount, b.UserCount];
                    break;
                case 'r_submissions':
                    [propertyA, propertyB] = [a.Users, b.Users];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
    disconnect() {
    }
}
