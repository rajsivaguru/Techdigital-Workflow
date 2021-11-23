import { Component, Inject, OnDestroy, OnInit, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort, MatSnackBar, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '../../../../core/fuseUtils';
import { FusePerfectScrollbarDirective } from '../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { fuseAnimations } from '../../../../core/animations';
 
import { LoginService } from '../../login/login.service';
import { PunchTimeService } from '../../punchtime/punchtime.service';
import { SnackBarService } from '../../dialog/snackbar.service'
import { ProgressBarConfig } from '../../../../app.model';
import { InOutTime } from '../punchtime.model';
import { Utilities } from '../../common/commonUtil';

@Component({
    selector: 'punching',
    templateUrl: './inouttime.component.html',
    styleUrls: ['../punchtime.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class InOutTimeComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    
    searchInput: FormControl;
    
    dialogRef: any;
    progressbar: ProgressBarConfig;
    isFormExpanded: boolean = true;
    isSavable: boolean = false;
    
    myPunchDetails: InOutTime[];
    myPunchDetail: InOutTime;
    todayPunchDetail: InOutTime;
    dataSource: MatTableDataSource<InOutTime> | null;
    //displayedColumns = ['pt_date', 'pt_intime', 'pt_outtime', 'pt_buttons'];
    displayedColumns = ['pt_date', 'pt_intime', 'pt_outtime'];

    datePipe = new DatePipe("en-US");
    maxDate: Date;
    currentDate: string;
    hoursWorked: Number = 0;
    inHour: string;
    inMinute: string;
    outHour: string;
    outMinute: string;

    hours: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    minutes: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'
        , '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55'
        , '56', '57', '58', '59'];

    isGridView: boolean = true;
    matTableInner: number;

    constructor(
        private punchTimeService: PunchTimeService,
        public dialog: MatDialog,
        public router: Router,
        private loginService: LoginService,
        private snackComp: SnackBarService,
        private utilities: Utilities
    )
    {
        this.searchInput = new FormControl(''); 
    }

    ngOnInit() {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
        this.progressbar = new ProgressBarConfig({});

        this.dataSource = new MatTableDataSource(this.myPunchDetails);
        this.myPunchDetail = new InOutTime({});
        this.todayPunchDetail = new InOutTime({});

        this.initializeData();
    }

    ngOnDestroy() {

    }
    
    ngAfterViewInit() {
        //this.dataSource.sort = this.sort;
    }

    onResize(event) {
        this.matTableInner = this.utilities.GetPageContentHeightNonAccordion();
    }

    initializeData()
    {
        if (this.punchTimeService.myPunchDetails == undefined || this.punchTimeService.myPunchDetails.length == 0)
            this.refresh();
        else {
            this.myPunchDetails = this.punchTimeService.myPunchDetails;
            this._initializeDataAfterServiceCall();
        }
    }

    refresh() {
        this._getMyPunchDetails();
    }

    clearForm()
    {
        //var currentDateTime = new Date();

        //if (this.myPunchDetail.punchid == null || this.myPunchDetail.punchid == undefined)
        //{
        //    this.inHour = currentDateTime.getHours().toString();
        //    this.inMinute = currentDateTime.getMinutes().toString();
        //}

        this._calculateTime();
    }

    selectedItem(myPunchDetail: InOutTime) {
        this.isFormExpanded = true;
        this.myPunchDetail = myPunchDetail;

        this._calculateTime();
    }

    private _initializeDataAfterServiceCall()
    {
        var todayData = this.myPunchDetails.filter((x) => {
            if (x.istoday)
                return x;
        })

        if (todayData != null && todayData != undefined && todayData.length > 0) {
            this.myPunchDetail = todayData[0];
            this.todayPunchDetail = todayData[0];
            ////this.maxDate = this.myPunchDetail.punchday;
        }
        else
            this.myPunchDetail = new InOutTime({});

        this.myPunchDetails.map((x) => {
            x.punchday = this.datePipe.transform(x.punchday, 'MM-dd-yyyy');
        });
        this.dataSource = new MatTableDataSource(this.myPunchDetails);

        this._calculateTime();
    }

    private _calculateTime()
    {
        var currentDateTime = new Date();
        this.currentDate = this.datePipe.transform(currentDateTime, 'MM-dd-yyyy hh:mm aa');

        this.myPunchDetail.punchday = this.datePipe.transform(this.myPunchDetail.punchday, 'MM-dd-yyyy');

        if (this.myPunchDetail.punchid == null || this.myPunchDetail.punchid == undefined || this.myPunchDetail.punchid == 0)
        {
            this.inHour = currentDateTime.getHours().toString();
            this.inMinute = currentDateTime.getMinutes().toString();
            this.outHour = '';
            this.outMinute = '';
        }
        else
        {
            this.outHour = currentDateTime.getHours().toString();
            this.outMinute = currentDateTime.getMinutes().toString();
        }   
        
        if (this.myPunchDetail.intime != null && this.myPunchDetail.intime != undefined) {
            this.inHour = this.datePipe.transform(this.myPunchDetail.intime, 'hh');
            this.inMinute = this.datePipe.transform(this.myPunchDetail.intime, 'mm');
        }

        if (this.myPunchDetail.outtime != null || this.myPunchDetail.outtime != undefined) {
            this.outHour = this.datePipe.transform(this.myPunchDetail.outtime, 'hh');
            this.outMinute = this.datePipe.transform(this.myPunchDetail.outtime, 'mm');
        }

        this._validateForm();
    }

    private _validateForm()
    {
        if (new Date(this.myPunchDetail.punchday) <= new Date(this.todayPunchDetail.punchday))
            this.isSavable = true;
        else
            this.isSavable = false;
    }

    private _getMyPunchDetails() {
        this.progressbar.showProgress();
        this.punchTimeService.getMyPunchDetails().then(response => {
            this.progressbar.hideProgress();
            if (response) {
                this.myPunchDetails = this.punchTimeService.myPunchDetails;
                //this.dataSource = new MatTableDataSource(this.myPunchDetails);

                this._initializeDataAfterServiceCall();
                this.snackComp.showSnackBarGet(response, '');
            }
        });
    }
}
