import { Component, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange, MatDialog, MatDialogRef, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { AbstractControl, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { Router } from '@angular/router';
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
import { UserReportParam } from '../reports.model';
import { ReportsService} from '../reports.service';
import { UsersService } from '../../users/users.service';
import { SnackBarService } from '../../dialog/snackbar.service'
import { Utilities } from '../../common/commonUtil';

@Component({
    selector   : 'fuse-orderentry',
    templateUrl: './userreport.component.html',
    styleUrls  : ['./userreport.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class UserReportComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    usersDataList = [];
    selectedUsers = [];
    settings = {};

    users: any;
    dataSource: FilesDataSource | null;
    displayedColumns = [ 'ur_username', 'ur_job', 'ur_location', 'ur_clientname', 'ur_publisheddate', 'ur_assigneddate', 'ur_duration', 'ur_submission', 'ur_comment'];
    selectedContacts: any[];
    checkboxes: {};
    onUserReportChangedSubscription: Subscription;
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    datePipe = new DatePipe("en-US");
    progressbar: ProgressBarConfig;
    isSearchExpanded : boolean
    isSearchEnable : boolean = false;
    lastDaysList  = [];
    userReport : FormGroup;
    rptForm : UserReportParam;
    todayDate = new Date();    
    minFromDate = null;
    minToDate = null;
    maxFromDate  = null; 
    maxToDate = null;
    maxPublishedDate = null;
    matTableInner: number;

    constructor(
        private reportService: ReportsService,
        private snackBar: MatSnackBar,
        private _sanitizer: DomSanitizer, 
        private router : Router,
        private formBuilder: FormBuilder,
        private loginService : LoginService,
        private userService: UsersService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    )
    {        
        this.onUserReportChangedSubscription = this.reportService.onUserReportChanged.subscribe(jbs => {;
            this.users = jbs;
        });
        
        this.rptForm = new UserReportParam({});
        this.maxFromDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.maxToDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.maxPublishedDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.isSearchExpanded = true;
    }

    ngOnInit()
    {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
        this.progressbar = new ProgressBarConfig({});
        this.userReport = this.createReportForm();
        this.dataSource = new FilesDataSource(this.reportService, this.paginator, this.sort);

        this.getDays();
        this.getUsersForReport();
        
        this.settings = {
            height: '350px',
            maxHeight : '350px',
            searchAutofocus : true,
            singleSelection: false, 
            text:"Users",
            selectAllText:'Select All',
            unSelectAllText:'UnSelect All',
            enableSearchFilter: true,
            enableCheckAll : true,
            classes : 'custom_userreport_list',
            badgeShowLimit: 1
        };
    }

    ngOnDestroy()
    {
        this.onUserReportChangedSubscription.unsubscribe();
    }

    onResize(event)
    {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
    }

    onItemSelect(item:any ){
       this.searchValidation();
    }

    OnItemDeSelect(item:any ){
        this.searchValidation();
    }

    onSelectAll(items: any ){
        this.searchValidation();
    }

    onDeSelectAll(items: any ){
        this.searchValidation();
    }

    searchValidation()
    {
        this.rptForm = this.userReport.getRawValue();

        // if(this.rptForm.status == undefined)
        //     this.rptForm.status = -2;

        if (this.rptForm.lastdays == undefined)
            this.rptForm.lastdays = -1;

        if( this.rptForm.userids.length >  0 || this.rptForm.jobcode != "" || this.rptForm.title != "" || this.rptForm.location != "" || this.rptForm.publisheddate != "" || this.rptForm.assigneddate != "" 
            || (this.rptForm.fromdate != "" && this.rptForm.todate != "") || this.rptForm.lastdays != -1 )
        {
            this.isSearchEnable = true;
        }
        else
            this.isSearchEnable = false;
    }

    clearSearch()
    {
        this.userReport.patchValue(
        {
            userids         : [],
            jobcode         : '',
            title           : '',
            location        : '',
            publisheddate   : '',
            assigneddate    : '',
            fromdate        : '',
            todate          : '',
            lastdays       : -1
        });

        this.rptForm = this.userReport.getRawValue();
        ////this.reportService.getUserReport(this.rptForm);
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

            this.reportService.getUserReport(this.rptForm)
                .then(response => {
                    this.progressbar.hideProgress();
                    this.snackComp.showSnackBarGet(response, '');
                });
        }
    }

    loadDownloadableReport(fileType) {
        if (this.validateReportCriteria()) {
            this.rptForm.reporttype = fileType;
            this.reportService.getUserReportExport(this.rptForm);
        }
    }

    selectedFromDate(type: string, event: MatDatepickerInputEvent<Date>)
    {
        this.minToDate = event.value;         
        this.userReport.patchValue({ lastdays: -1 });
        this.searchValidation();
    }
    
    selectedToDate(type: string, event: MatDatepickerInputEvent<Date>)
    {
        this.maxFromDate = event.value;        
        this.userReport.patchValue({ lastdays: -1 });
        this.searchValidation();
    }

    selectedNoOfDays(event)
    {
        if(event.value != undefined)
        {
            this.userReport.patchValue({ fromdate: '', todate: '' });
            this.searchValidation();
        }
    }
        
    autocompleListFormatterJob = (data: any) : SafeHtml => {
        //console.log(data)
            let html = `<span class="font-weight-900 font-size-12">${data.title} </span><span class="font-size-10">${data.location} </span>`;
            return this._sanitizer.bypassSecurityTrustHtml(html);            
    }

    autocompleListFormatterUser = (data: any) : SafeHtml => {
            let html = `<span class="font-weight-900 font-size-12">${data.name} </span><span class="font-size-10">${data.email} </span>`;
            return this._sanitizer.bypassSecurityTrustHtml(html);
            
    }

    autocompleListSelectedJob = (data : any) : void =>
    {
        //console.log('selected')
        return (data["title"]);
        //console.log(data)
    }

    autocompleListSelectedUser = (data : any) : void =>
    {
        //console.log('selected')
        return (data["name"]);
        //console.log(data)
    }


    private createReportForm() {
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

    private getUsersForReport()
    {
        this.usersDataList = [];
        this.reportService.getUserForReport(1, false).then(response => {
            if (response) {
                response.map(user => {
                    this.usersDataList.push({ "roleName": user["rolename"], "id": user["userid"], "itemName": user["name"] })
                });
            }
        });
    }

    private validateReportCriteria()
    {
        this.rptForm = this.userReport.getRawValue();

        let userid = [];

        if (this.userReport.getRawValue()["userids"] != undefined && this.userReport.getRawValue()["userids"] != "" && this.userReport.getRawValue()["userids"].length > 0) {
            userid = this.userReport.getRawValue()["userids"].map(user => {
                return (user["id"])
            });
        }

        this.rptForm.userids = userid;
        
        if (this.rptForm.lastdays == undefined)
            this.rptForm.lastdays = -1;

        if (this.rptForm.userids.length == 0 && this.rptForm.jobcode == "" && this.rptForm.title == "" && this.rptForm.location == "" && this.rptForm.publisheddate == "" && this.rptForm.assigneddate == ""
            && this.rptForm.fromdate == "" && this.rptForm.todate == "" && this.rptForm.lastdays == -1)
        {
            this.snackComp.showSimpleWarning("Please filter by any values!")
            return false;
        }

        if (this.rptForm.publisheddate != "")
            this.rptForm.publisheddate = this.datePipe.transform(this.rptForm.publisheddate, 'MM/dd/yyyy');

        if (this.rptForm.fromdate != "")
            this.rptForm.fromdate = this.datePipe.transform(this.rptForm.fromdate, 'MM/dd/yyyy');

        if (this.rptForm.todate != "")
            this.rptForm.todate = this.datePipe.transform(this.rptForm.todate, 'MM/dd/yyyy');

        if (this.rptForm.fromdate != "" && this.rptForm.todate == "") {
            this.snackComp.showSimpleWarning("Please select the 'To Date'");
            return false;
        }

        if (this.rptForm.fromdate == "" && this.rptForm.todate != "") {
            this.snackComp.showSimpleWarning("Please select the 'From Date'");
            return false;
        }

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
        if(this.reportService.userReports != undefined)
            this.filteredData = this.reportService.userReports;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this.reportService.onUserReportChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];      
       
        return Observable.merge(...displayDataChanges).map(() => {

            if(this.reportService.userReports != undefined)
            {
            let data = this.reportService.userReports.slice();

            data = this.filterData(data);

            this.filteredData = [...data];

            data = this.sortData(data);

             if ( this.directiveScroll )
            {
                this.directiveScroll.scrollToTop(0, 500);
                this.directiveScroll.update();
                
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
//displayedColumns = [ 'ur_userids', 'ur_username', 'ur_jobcode', 'ur_title', 'ur_location', 'ur_publisheddate', 'ur_assingeddate', 'ur_duration', 'ur_submission', 'ur_jobstarted'];

        //this._paginator.pageIndex = 0;

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._sort.active )
            {
                case 'ur_username':
                    [propertyA, propertyB] = [a.username, b.username];
                    break;
                case 'ur_jobcode':
                    [propertyA, propertyB] = [a.jobcode, b.jobcode];
                    break;
                case 'ur_title':
                    [propertyA, propertyB] = [a.title, b.title];
                    break;
                case 'ur_location':
                    [propertyA, propertyB] = [a.location, b.location];
                    break;
                case 'ur_publisheddate':
                    [propertyA, propertyB] = [a.publisheddate, b.publisheddate];
                    break;
                case 'ur_assigneddate':
                    [propertyA, propertyB] = [a.assigneddate, b.assigneddate];
                    break;
                case 'ur_duration':
                    [propertyA, propertyB] = [a.duration, b.duration];
                    break;
                case 'ur_submission':
                    [propertyA, propertyB] = [a.submission, b.submission];
                    break;
                case 'ur_jobstarted':
                    [propertyA, propertyB] = [a.jobstarted, b.jobstarted];
                    break;
                case 'ur_comment':
                    [propertyA, propertyB] = [a.comment, b.comment];
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
