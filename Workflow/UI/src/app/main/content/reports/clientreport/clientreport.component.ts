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

@Component({
    selector: 'client-report',
    templateUrl: './clientreport.component.html',
    styleUrls: ['../report.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ClientReportComponent implements OnInit, OnDestroy
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

        this.getDays();
        this.getClients();
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
