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
import { ReportsService } from '../reports.service';
import { SnackBarService } from '../../dialog/snackbar.service'
import { PunchReportParam } from '../reports.model';
import { Utilities } from '../../common/commonUtil';

@Component({
    selector: 'punch-report',
    templateUrl: './punchreport.component.html', 
    styleUrls: ['../report.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class PunchReportComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    usersDataList = [];
    selectedUsers = [];
    settings = {};

    dataSource: FilesDataSource | null;
    displayedColumns = ['r_punchdate', 'r_user', 'r_intime', 'r_outtime', 'r_notes', 'r_hourday', 'r_isabsent'];
    datePipe = new DatePipe("en-US");
    progressbar: ProgressBarConfig;
    isSearchExpanded: boolean
    isSearchEnable: boolean = false;
    userRoleList = [];
    selectedUserRoleIds = [];
    punchReport: FormGroup;
    rptForm: PunchReportParam;
    userRoleIds = new FormControl();
    todayDate = new Date();
    minFromDate = null;
    minToDate = null;
    maxFromDate = null;
    maxToDate = null;
    matTableInner: number;

    constructor(
        private reportService: ReportsService,
        private _sanitizer: DomSanitizer,
        private router: Router,
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    )
    {
        this.rptForm = new PunchReportParam({});
        this.maxFromDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.maxToDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
        this.isSearchExpanded = true;
    }

    ngOnInit()
    {
        this.matTableInner = this.utilities.GetPageContentHeightWithAccordion();
        this.progressbar = new ProgressBarConfig({});
        this.punchReport = this.createReportForm();
        this.dataSource = new FilesDataSource(this.reportService, this.paginator, this.sort);

        this.getUsersForReport();

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
            classes: 'custom_punchreport_list',
            badgeShowLimit: 1
        };
    }

    ngOnDestroy() {
        
    }

    onResize(event)
    {
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

    selectedFromDate(type: string, event: MatDatepickerInputEvent<Date>) {
        this.minToDate = event.value;
        this.searchValidation();
    }

    selectedToDate(type: string, event: MatDatepickerInputEvent<Date>) {
        this.maxFromDate = event.value;
        this.searchValidation();
    }

    selectedNoOfDays(event)
    {
        if (event.value != undefined) {
            this.punchReport.patchValue({ fromDate: '', toDate: '' });
            this.searchValidation();
        }
    }

    searchValidation()
    {
        this.rptForm = this.punchReport.getRawValue();

        if ((this.rptForm.fromDate != "" && this.rptForm.toDate != ""))
        {
            this.isSearchEnable = true;
        }
        else
            this.isSearchEnable = false;
    }

    clearSearch() {
        this.punchReport.patchValue(
        {
            userRoleIds: [],
            userids: [],
            showOnlyMissingTime: false,
            includeWeekends: true,
            fromDate: '',
            toDate: '',
            loginid: 0,
            reporttype: ''
        });

        this.rptForm = this.punchReport.getRawValue();
        this.selectedUserRoleIds = [];
        this.userRoleIds = new FormControl();
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

            this.reportService.getPunchReport(this.rptForm).then(response => {
                if (response) {
                    this.progressbar.hideProgress();
                    this.snackComp.showSnackBarGet(response, '');
                }
            });
        }
    }

    loadDownloadableReport(fileType) {

        this.snackComp.showSimpleWarning("Export is not available for this Report.");

        //if (this.validateReportCriteria()) {
        //    this.rptForm.reporttype = fileType;
        //    this.reportService.getPunchReportExport(this.rptForm);
        //}
    }


    private createReportForm() {
        return this.formBuilder.group({
            userids: [this.rptForm.userids],
            showOnlyMissingTime: [this.rptForm.showOnlyMissingTime],
            includeWeekends: [this.rptForm.includeWeekends],
            userRoleIds: [this.rptForm.userRoleIds],
            fromDate: [this.rptForm.fromDate],
            toDate: [this.rptForm.toDate]
        });
    }

    private getUsersForReport() {
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
        this.rptForm = this.punchReport.getRawValue();

        let userid = [];

        if (this.punchReport.getRawValue()["userids"] != undefined && this.punchReport.getRawValue()["userids"] != "" && this.punchReport.getRawValue()["userids"].length > 0) {
            userid = this.punchReport.getRawValue()["userids"].map(user => {
                return (user["id"])
            });
        }

        this.rptForm.userids = userid;

        if (this.rptForm.fromDate == "" && this.rptForm.toDate == "")
        {
            this.snackComp.showSimpleWarning("Please filter by any values")
            return false;
        }

        if (this.rptForm.fromDate != "")
            this.rptForm.fromDate = this.datePipe.transform(this.rptForm.fromDate, 'MM/dd/yyyy');
        if (this.rptForm.toDate != "")
            this.rptForm.toDate = this.datePipe.transform(this.rptForm.toDate, 'MM/dd/yyyy');

        return true;
    }


    /* Not used.  Need to check the code once get the UserRole implementation. */
    selectedUserRole(event) {
        if (event.value != undefined) {
            this.selectedUserRoleIds = [];

            event.value.forEach(role => {
                var item = this.userRoleList.filter(x => x.rolename == role);
                if (item.length > 0)
                    this.selectedUserRoleIds.push(item[0].id);
            });

            this.searchValidation();
        }
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
        if (this.reportService.punchReports != undefined)
            this.filteredData = this.reportService.punchReports;
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
        const displayDataChanges = [
            this.reportService.onPunchReportChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];

        return Observable.merge(...displayDataChanges).map(() => {

            if (this.reportService.punchReports != undefined) {
                let data = this.reportService.punchReports.slice();

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

            //switch (this._sort.active) {
            //    case 'r_jobcode':
            //        [propertyA, propertyB] = [a.ReferenceId, b.ReferenceId];
            //        break;
            //    case 'r_title':
            //        [propertyA, propertyB] = [a.Title, b.Title];
            //        break;
            //    case 'r_location':
            //        [propertyA, propertyB] = [a.Location, b.Location];
            //        break;
            //    case 'r_clientname':
            //        [propertyA, propertyB] = [a.ClientName, b.ClientName];
            //        break;
            //    case 'r_publisheddate':
            //        [propertyA, propertyB] = [a.PublishedDate, b.PublishedDate];
            //        break;
            //    case 'r_jobstatus':
            //        [propertyA, propertyB] = [a.IsActive, b.IsActive];
            //        break;
            //    case 'r_assignments':
            //        [propertyA, propertyB] = [a.UserCount, b.UserCount];
            //        break;
            //    case 'r_submissions':
            //        [propertyA, propertyB] = [a.Users, b.Users];
            //        break;
            //}

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
    disconnect() {
    }
}
