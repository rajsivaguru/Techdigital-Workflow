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
import { ReportsService } from '../reports.service';
import { SnackBarService } from '../../dialog/snackbar.service'
import { ProfileSearchReportParam } from '../reports.model';
import { DialogComponent, DialogDataComponent, DialogProfileSeachReportDetailComponent } from '../../dialog/dialog.component'
import { Utilities } from '../../common/commonUtil';

@Component({
    selector: 'profilesearch-report',
    templateUrl: './profilesearchreport.component.html',
    styleUrls: ['./profilesearchreport.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ProfileSearchReportComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: FilesDataSource | null;
    settings = {};
    displayedColumns = ['r_username', 'r_title', 'r_location', 'r_searchengine', 'r_searcheddate', 'r_buttons_1'];
    datePipe = new DatePipe("en-US");
    progressbar: ProgressBarConfig;
    isSearchExpanded: boolean
    isSearchEnable: boolean = false;
    usersDataList = [];
    lastDaysList = [];
    selectedUserIds = [];
    profileSearchReport: FormGroup;
    rptForm: ProfileSearchReportParam;
    userIds = new FormControl();
    todayDate = new Date();
    maxPublishedDate = null;
    matTableInner: number;

    constructor(
        public dialog: MatDialog,
        private reportService: ReportsService,
        private _sanitizer: DomSanitizer,
        private router: Router,
        private formBuilder: FormBuilder,
        private snackComp: SnackBarService,
        private utilities: Utilities
    ) {
        this.rptForm = new ProfileSearchReportParam({});
        this.maxPublishedDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.isSearchExpanded = true;
    }

    ngOnInit() {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
        this.progressbar = new ProgressBarConfig({});
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
    }

    ngOnDestroy() {

    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
    }

    onItemSelect(item: any) {
        this.searchValidation();
    }

    OnItemDeSelect(item: any) {
        this.searchValidation();
    }

    onSelectAll(items: any) {
        this.searchValidation();
    }

    onDeSelectAll(items: any) {
        this.searchValidation();
    }

    selectedNoOfDays(event) {
        if (event.value != undefined) {
            this.searchValidation();
        }
    }
    
    searchValidation() {
        this.rptForm = this.profileSearchReport.getRawValue();

        this.rptForm.userIds = this.selectedUserIds;

        if (this.rptForm.lastDays == undefined)
            this.rptForm.lastDays = -1;

        if (this.rptForm.userIds.length > 0 || this.rptForm.title != "" || this.rptForm.location != "" || this.rptForm.searcheddate != "" || this.rptForm.lastDays != -1) {
            this.isSearchEnable = true;
        }
        else
            this.isSearchEnable = false;
    }

    clearSearch() {
        this.profileSearchReport.patchValue(
            {
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
        this.userIds = new FormControl();
        this.isSearchExpanded = true;
        this.isSearchEnable = false;
    }

    loadReport() {
        if (this.validateReportCriteria()) {
            this.paginator.pageIndex = 0;
            this.isSearchExpanded = false;
            this.progressbar.showProgress();

            this.reportService.getProfileSearchReport(this.rptForm).then(response => {
                if (response) {
                    this.progressbar.hideProgress();
                    this.snackComp.showSnackBarGet(response, '');
                }
            });
        }
    }

    openDetailsInModal(recordid) {
        let dialogUserList = this.dialog.open(DialogProfileSeachReportDetailComponent, {
            height: "490px",
            width: "600px",
            data: {
                title: 'Profile Search Details',
                item: this.reportService.profileSearchReports[0]
            }
        });

        dialogUserList.afterClosed().subscribe(result => {

        });
    }

    loadDownloadableReport(fileType) {
        if (this.validateReportCriteria()) {
            this.rptForm.reporttype = fileType;
            this.reportService.getProfileSearchReportExport(this.rptForm);
        }
    }

    private createReportForm() {
        return this.formBuilder.group({
            userIds: [this.rptForm.userIds],
            title: [this.rptForm.title],
            location: [this.rptForm.location],
            searcheddate: [this.rptForm.searcheddate],
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

    private getUsers() {
        this.usersDataList = [];
        this.reportService.getUserForReport(1, true).then(response => {
            if (response) {
                response.map(user => {
                    this.usersDataList.push({ "roleName": user["rolename"], "id": user["userid"], "itemName": user["name"] })
                });
            }
        });
    }

    private validateReportCriteria() {
        this.rptForm = this.profileSearchReport.getRawValue();
        this.rptForm.userIds = this.selectedUserIds;

        if (this.rptForm.lastDays == undefined)
            this.rptForm.lastDays = -1;

        if (this.rptForm.userIds.length == 0 && this.rptForm.title == "" && this.rptForm.location == "" && this.rptForm.searcheddate == "" && this.rptForm.lastDays == -1) {
            this.snackComp.showSimpleWarning("Please filter by any values")
            return false;
        }

        if (this.rptForm.searcheddate != "")
            this.rptForm.searcheddate = this.datePipe.transform(this.rptForm.searcheddate, 'MM/dd/yyyy');

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
        if (this.reportService.profileSearchReports != undefined)
            this.filteredData = this.reportService.profileSearchReports;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
        const displayDataChanges = [
            this.reportService.onProfileSearchReportChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];

        return Observable.merge(...displayDataChanges).map(() => {

            if (this.reportService.profileSearchReports != undefined) {
                let data = this.reportService.profileSearchReports.slice();

                data = this.filterData(data);

                this.filteredData = [...data];

                data = this.sortData(data);

                if (this.directiveScroll) {
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
        //displayedColumns = [ 'ur_userids', 'ur_username', 'ur_jobcode', 'ur_title', 'ur_location', 'ur_publisheddate', 'ur_assingeddate', 'ur_duration', 'ur_submission', 'ur_jobstarted'];

        //this._paginator.pageIndex = 0;
        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'r_username':
                    [propertyA, propertyB] = [a.username, b.username];
                    break;
                case 'r_title':
                    [propertyA, propertyB] = [a.title, b.title];
                    break;
                case 'r_location':
                    [propertyA, propertyB] = [a.location, b.location];
                    break;
                case 'r_searcheddate':
                    [propertyA, propertyB] = [a.searcheddate, b.searcheddate];
                    break;
                case 'r_searchengine':
                    [propertyA, propertyB] = [a.searchengine, b.searchengine];
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