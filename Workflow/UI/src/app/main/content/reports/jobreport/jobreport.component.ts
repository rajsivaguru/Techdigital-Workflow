import { DataSource } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange, MatDialog, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { fuseAnimations } from '../../../../core/animations';
import { ProgressBarConfig } from '../../../../app.model';
import { LoginService } from '../../login/login.service';
import { SnackBarService } from '../../dialog/snackbar.service'
import { FuseUtils } from '../../../../core/fuseUtils';
import { JobReportParam } from '../reports.model';
import { ReportsService } from '../reports.service';
import { Utilities } from '../../common/commonUtil';

@Component({
    selector: 'job-report',
    templateUrl: './jobreport.component.html',
    styleUrls  : ['./jobreport.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class JobReportComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    jobs: any;
    dataSource: FilesDataSource | null;
    displayedColumns = [ 'r_ReferenceId', 'r_Title', 'r_Location', 'r_ClientName', 'r_PublishedDate', 'r_IsActive', 'r_UserCount', 'r_Users', 'r_Duration', 'r_Submission'];
    onJobReportChangedSubscription: Subscription;
    datePipe = new DatePipe("en-US");
    progressbar: ProgressBarConfig;
    isSearchExpanded : boolean
    isSearchEnable : boolean = false;
    lastDaysList  = [];
    jobReport : FormGroup;
    rptForm: JobReportParam;
    todayDate = new Date();    
    minFromDate = null;
    minToDate = null;
    maxFromDate  = null; 
    maxToDate = null;
    maxPublishedDate = null;
    matTableInner: number;

    constructor(
        public reportService: ReportsService,
        private _sanitizer: DomSanitizer, 
        public router : Router,
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    )
    {        
        this.onJobReportChangedSubscription = this.reportService.onJobReportChanged.subscribe(jbs => {
            this.jobs = jbs;
        });
        
        this.rptForm = new JobReportParam({});
        this.maxFromDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.maxToDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.maxPublishedDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.isSearchExpanded = true;
    }

    ngOnInit()
    {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
        this.progressbar = new ProgressBarConfig({});
        this.jobReport = this.createReportForm();
        this.dataSource = new FilesDataSource(this.reportService, this.paginator, this.sort);

        this.getDays();
    }

    ngOnDestroy() {
        this.onJobReportChangedSubscription.unsubscribe();
    }

    onResize(event)
    {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
    }

    searchValidation()
    {
        this.rptForm = this.jobReport.getRawValue();
        
        if (this.rptForm.status == undefined)
            this.rptForm.status = -2;
        
        if (this.rptForm.lastDays == undefined)
            this.rptForm.lastDays = -1;

        if( this.rptForm.jobcode != "" || this.rptForm.title != "" || this.rptForm.location != "" || this.rptForm.publishedDate != "" 
            || (this.rptForm.fromDate != "" && this.rptForm.toDate != "") || this.rptForm.status != -2 || this.rptForm.lastDays != -1 )
        {
            this.isSearchEnable = true;
        }
        else
            this.isSearchEnable = false;
    }

    clearSearch()
    {
        this.jobReport.patchValue(
        {
            jobcode         : '',
            title           : '',
            location        : '',
            publishedDate   : '',
            status          : -2,
            fromDate        : '',
            toDate          : '',
            lastDays       : -1
        });

        this.rptForm = this.jobReport.getRawValue();
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

            this.reportService.getJobReport(this.rptForm)
                .then(response =>
                {
                    this.progressbar.hideProgress();
                    this.snackComp.showSnackBarGet(response, '');
                });
        }
    }

    loadDownloadableReport(fileType)
    {
        if (this.validateReportCriteria()) {
            this.rptForm.reporttype = fileType;
            this.reportService.getJobReportExport(this.rptForm);
        }
    }

    selectedFromDate(type: string, event: MatDatepickerInputEvent<Date>)
    {
        this.minToDate = event.value;         
        this.jobReport.patchValue({ lastDays: -1});
        this.searchValidation();
    }
    
    selectedToDate(type: string, event: MatDatepickerInputEvent<Date>)
    {
        this.maxFromDate = event.value;        
        this.jobReport.patchValue({ lastDays: -1 });
        this.searchValidation();
    }

    selectedNoOfDays(event)
    {
        if(event.value != undefined)
        {
            this.jobReport.patchValue({ fromDate: '', toDate: '' });
            this.searchValidation();
        }
    }
    
    autocompleListFormatterJob = (data: any) : SafeHtml => {
        let html = `<span class="font-weight-900 font-size-12">${data.title} </span><span class="font-size-10">${data.location} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);        
    }
    
    autocompleListFormatterUser = (data: any) : SafeHtml => {
        let html = `<span class="font-weight-900 font-size-12">${data.name} </span><span class="font-size-10">${data.email} </span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);            
    }
    
    autocompleListSelectedJob = (data : any) : void =>
    {
        return (data["title"]);
    }
    
    autocompleListSelectedUser = (data : any) : void =>
    {
        return (data["name"]);
    }


    private createReportForm() {
        return this.formBuilder.group({
            jobcode: [this.rptForm.jobcode],
            title: [this.rptForm.title],
            location: [this.rptForm.location],
            publishedDate: [this.rptForm.publishedDate],
            status: [this.rptForm.status],
            fromDate: [this.rptForm.fromDate],
            toDate: [this.rptForm.toDate],
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

    private validateReportCriteria() {
        this.rptForm = this.jobReport.getRawValue();

        if (this.rptForm.lastDays == undefined)
            this.rptForm.lastDays = -1;
        if (this.rptForm.status == undefined)
            this.rptForm.status = -1;

        if (this.rptForm.jobcode == "" && this.rptForm.title == "" && this.rptForm.location == "" && this.rptForm.publishedDate == "" && this.rptForm.fromDate == "" && this.rptForm.toDate == "" && this.rptForm.lastDays == -1 && this.rptForm.status == -2) {
            this.snackComp.showSimpleWarning(this.utilities.reportSearchMissingFields);
            return false;
        }

        if (this.rptForm.publishedDate != "")
            this.rptForm.publishedDate = this.datePipe.transform(this.rptForm.publishedDate, 'MM/dd/yyyy');
        if (this.rptForm.fromDate != "")
            this.rptForm.fromDate = this.datePipe.transform(this.rptForm.fromDate, 'MM/dd/yyyy');
        if (this.rptForm.toDate != "")
            this.rptForm.toDate = this.datePipe.transform(this.rptForm.toDate, 'MM/dd/yyyy');

        return true;
    }
}

export class FilesDataSource extends DataSource<any>
{    
    @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;

    _filterChange = new BehaviorSubject('');
    _filteredDataChange = new BehaviorSubject('');

    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }

    constructor(private reportService: ReportsService, private _paginator: MatPaginator,        private _sort: MatSort)
    {
        super();
        if(this.reportService.jobReports != undefined)
            this.filteredData = this.reportService.jobReports;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this.reportService.onJobReportChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];

        return Observable.merge(...displayDataChanges).map(() => {

            if(this.reportService.jobReports != undefined)
            {
                let data = this.reportService.jobReports.slice();
    
                data = this.filterData(data);
                this.filteredData = [...data];
                data = this.sortData(data);

                if ( this.directiveScroll )
                {
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
    
    filterData(data)
    {
        if ( !this.filter )
        {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    sortData(data): any[]
    {        
        if ( !this._sort.active || this._sort.direction === '' )
        {
            return data;
        }
        
        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._sort.active )
            {
                case 'r_ReferenceId':
                    [propertyA, propertyB] = [a.ReferenceId, b.ReferenceId];
                    break;
                case 'r_Title':
                    [propertyA, propertyB] = [a.Title, b.Title];
                    break;
                case 'r_Location':
                    [propertyA, propertyB] = [a.Location, b.Location];
                    break;
                case 'r_ClientName':
                    [propertyA, propertyB] = [a.ClientName, b.ClientName];
                    break;
                case 'r_PublishedDate':
                    [propertyA, propertyB] = [a.PublishedDate, b.PublishedDate];
                    break;
                case 'r_IsActive':
                    [propertyA, propertyB] = [a.IsActive, b.IsActive];
                    break;
                case 'r_UserCount':
                    [propertyA, propertyB] = [a.UserCount, b.UserCount];
                    break;
                case 'r_Users':
                    [propertyA, propertyB] = [a.Users, b.Users];
                    break;
                case 'r_Duration':
                    [propertyA, propertyB] = [a.Duration, b.Duration];
                    break;
                 case 'r_Submission':
                    [propertyA, propertyB] = [a.Submission, b.Submission];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
    disconnect()
    {
    }
}
