import { Component, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatSelectChange, MatDialog, MatDialogRef, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { AbstractControl, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { Router }   from '@angular/router';
import { LoginService } from '../../login/login.service';
import { FuseUtils } from '../../../../core/fuseUtils';
import { JobReportForm } from '../reports.model';
import { ReportsService} from '../reports.service';
import { DatePipe } from '@angular/common';
import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';




@Component({
    selector   : 'fuse-orderentry',
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
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = [ 'r_ReferenceId', 'r_Title', 'r_Location', 'r_PublishedDate', 'r_IsActive', 'r_UserCount', 'r_Users', 'r_Duration', 'r_Submission'];
    selectedContacts: any[];
    checkboxes: {};


    onContactsChangedSubscription: Subscription;
    							


    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    datePipe = new DatePipe("en-US");

    isSearchExpanded : boolean
    isSearchEnable : boolean = false;

    lastDaysList  = [];

    jobReport : FormGroup;
    rptForm : JobReportForm;

    todayDate = new Date();
    
    minFromDate = null;
    minToDate = null;

    maxFromDate  = null; 
    maxToDate = null;

    maxPublishedDate = null;

    constructor(
        public reportService: ReportsService,
        public snackBar: MatSnackBar,
        private _sanitizer: DomSanitizer, 
        public router : Router,
        private formBuilder: FormBuilder,
        private loginService : LoginService
    )
    {
        
        this.onContactsChangedSubscription = this.reportService.onContactsChanged.subscribe(jbs => {
                this.jobs = jbs;
            });

        
        this.rptForm = new JobReportForm({});

        this.maxFromDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.maxToDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());

        this.maxPublishedDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());

        this.isSearchExpanded = true;
        
    }

    ngOnInit()
    {
        // if( this.loginService.loggedUser == undefined)
        // {
        //     this.router.navigateByUrl('/login');
        //     return;
        // }

        this.jobReport = this.createJobForm();
        
        this.dataSource = new FilesDataSource(this.reportService, this.paginator, this.sort);

        this.reportService.getLastDays().then(response => {

                if (response)
                {
                    response.map(priori => {
                            this.lastDaysList.push( {"id":priori["Value"], "itemName" : priori["Name"]})
                        });

                    //console.log(this.priorityList);

                }
            });

    }

    createJobForm()
    {
        return this.formBuilder.group({
            jobcode         : [this.rptForm.jobcode],
            title           : [this.rptForm.title],
            location        : [this.rptForm.location],
            publishedDate   : [this.rptForm.publishedDate],
            status          : [this.rptForm.status],
            fromDate        : [this.rptForm.fromDate],
            toDate          : [this.rptForm.toDate],
            lastDatys       : [this.rptForm.lastDatys]
        });
    }

    searchValidation()
    {
        this.rptForm = this.jobReport.getRawValue();

        if(this.rptForm.status == undefined)
            this.rptForm.status = -2;
        
        if (this.rptForm.lastDatys == undefined)
            this.rptForm.lastDatys = -1;

        if( this.rptForm.jobcode != "" || this.rptForm.title != "" || this.rptForm.location != "" || this.rptForm.publishedDate != "" 
            || this.rptForm.fromDate != "" || this.rptForm.toDate != "" || this.rptForm.status != -2 || this.rptForm.lastDatys != -1 )
            {

                this.isSearchEnable = true;
            }
            else
                this.isSearchEnable = false;
    }

    clearSearch()
    {
        //this.jobReport.reset();

        this.jobReport.patchValue(
            {
                jobcode         : '',
                title           : '',
                location        : '',
                publishedDate   : '',
                status          : -2,
                fromDate        : '',
                toDate          : '',
                lastDatys       : -1
            }
        );

        this.rptForm = this.jobReport.getRawValue();
        this.reportService.getJobs(this.rptForm);
        this.isSearchExpanded = true;
        this.isSearchEnable = false;
    }
    

    loadReport()
    {   
        
        this.rptForm = this.jobReport.getRawValue();

        if(this.rptForm.status == undefined)
            this.rptForm.status = -2;
        
        if (this.rptForm.lastDatys == undefined)
            this.rptForm.lastDatys = -1;

        if( this.rptForm.jobcode == "" && this.rptForm.title == "" && this.rptForm.location == "" && this.rptForm.publishedDate == "" 
            && this.rptForm.fromDate == "" && this.rptForm.toDate == "" && this.rptForm.status == -2 && this.rptForm.lastDatys == -1 )
            {

                this.openDialog("Please filter by any Values!")
                return;
            }

        if( this.rptForm.publishedDate != "")
            this.rptForm.publishedDate = this.datePipe.transform(this.rptForm.publishedDate, 'MM/dd/yyyy');

        if( this.rptForm.fromDate != "")
            this.rptForm.fromDate = this.datePipe.transform(this.rptForm.fromDate, 'MM/dd/yyyy');
        
        if( this.rptForm.toDate != "")
            this.rptForm.toDate = this.datePipe.transform(this.rptForm.toDate, 'MM/dd/yyyy');

        if( this.rptForm.fromDate != "" && this.rptForm.toDate == "")
        {
                this.openDialog("Please select the To date")
                return;
        }
        
        if( this.rptForm.fromDate == "" && this.rptForm.toDate != "")
        {
            this.openDialog("Please select the From date")
            return;
        }

        this.paginator.pageIndex = 0;
        this.isSearchExpanded = false;
        this.reportService.getJobs(this.rptForm);
        
        
    }


    ngOnDestroy()
    {
        this.onContactsChangedSubscription.unsubscribe();
    }

    
    selectedFromDate(type: string, event: MatDatepickerInputEvent<Date>) {
        
        
        this.minToDate = event.value; 
        this.searchValidation();
        this.jobReport.patchValue(
            {
                lastDatys     : -1
            }
        );
    }
    selectedToDate(type: string, event: MatDatepickerInputEvent<Date>) {

        this.maxFromDate = event.value;
        this.searchValidation();
        this.jobReport.patchValue(
            {
                lastDatys     : -1
            }
        );
    }

    selectedNoOfDays(event)
    {
        //console.log(event)
        
        if(event.value != undefined)
        {
            this.searchValidation();
            this.jobReport.patchValue(
            {
                fromDate    : '',
                toDate      : ''
            });
        }
    }

     searchJob = (keyword: any): Observable<any[]> => {

        try
        {
            if (keyword) {

                return this.reportService.searchJob(keyword);

            } else 
            {
                return Observable.of([]);
            }
        }
        catch(ex)
        {
            //console.log(ex)
            return Observable.of([]);
        }
    
    }

    searchUser = (keyword: any): Observable<any[]> => {

        try
        {
            if (keyword) {
            
                return this.reportService.searchUser(keyword);
            } else 
            {
                return Observable.of([]);
            }
        }
        catch(ex)
        {
            //console.log(ex)
            return Observable.of([]);
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

    openDialog(message) : void
    {
        this.snackBar.open(message, '', {
            duration: 2000,
            verticalPosition : 'top',
            extraClasses: ['mat-light-blue-100-bg']


        });


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
            this.reportService.onContactsChanged,
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
//displayedColumns = [ 'r_ReferenceId', 'r_Title', 'r_Location', 'r_PublishedDate', 'r_IsActive', 'r_UserCount', 'r_Duration', 'r_Submission'];
//ReferenceId	Title	Location	PublishedDate	IsActive	UserCount	Duration	Submission

        //this._paginator.pageIndex = 0;

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
