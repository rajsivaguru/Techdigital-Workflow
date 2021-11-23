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
    isOutTimeDisabled: boolean = true;
    isToday_Present: boolean = false;
    
    myPunchDetails: InOutTime[];
    myPunchDetail: InOutTime;
    dataSource: MatTableDataSource<InOutTime> | null;
    displayedColumns = ['pt_date', 'pt_intime', 'pt_outtime', 'pt_hourday', 'pt_totalhourday', 'pt_isabsent'];

    datePipe = new DatePipe("en-US");
    hoursWorked: Number = 0;
    inTime: string;
    outTime: string;

    /* 12 hour format */
    times: string[] = ['12:00 AM', '12:15 AM', '12:30 AM', '12:45 AM', '01:00 AM', '01:15 AM', '01:30 AM', '01:45 AM', '02:00 AM', '02:15 AM', '02:30 AM', '02:45 AM'
        , '03:00 AM', '03:15 AM', '03:30 AM', '03:45 AM', '04:00 AM', '04:15 AM', '04:30 AM', '04:45 AM', '05:00 AM', '05:15 AM', '05:30 AM', '05:45 AM', '06:00 AM', '06:15 AM', '06:30 AM', '06:45 AM'
        , '07:00 AM', '07:15 AM', '07:30 AM', '07:45 AM', '08:00 AM', '08:15 AM', '08:30 AM', '08:45 AM', '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM'
        , '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM'
        , '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM', '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM'
        , '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM', '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM', '05:00 PM', '05:15 PM', '05:30 PM', '05:45 PM', '06:00 PM', '06:15 PM', '06:30 PM', '06:45 PM'
        , '07:00 PM', '07:15 PM', '07:30 PM', '07:45 PM', '08:00 PM', '08:15 PM', '08:30 PM', '08:45 PM', '09:00 PM', '09:15 PM', '09:30 PM', '09:45 PM', '10:00 PM', '10:15 PM', '10:30 PM', '10:45 PM'
        , '11:00 PM', '11:15 PM', '11:30 PM', '11:45 PM'];

    /* 24 hour format */
    ////times: string[] = ['00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45'
    ////    , '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45'
    ////    , '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45'
    ////    , '11:00', '11:15', '11:30', '11:45'
    ////    , '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45'
    ////    , '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45'
    ////    , '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45'
    ////    , '23:00', '23:15', '23:30', '23:45'];

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
            this.clearForm();
        }
    }

    refresh() {        
        this._getMyPunchDetails();
        this.clearForm();
    }

    clearForm()
    {
        this.myPunchDetail = new InOutTime({});
        this.inTime = null;
        this.outTime = null;
        this.hoursWorked = 0;

        this.myPunchDetail.intime = null;
        this.myPunchDetail.outtime = null;

        this._validateForm();
    }

    selectedItem(myPunchDetail: InOutTime) {
        this.isFormExpanded = true;
        this.myPunchDetail = myPunchDetail;

        this._bindData();
    }

    onInTimeChanged(time)
    {
        this.myPunchDetail.intime = this._setDateTimeAfterTimeSelected(time, this.myPunchDetail.isnextdayin, 'in');
        this._calculateHoursWorked();
        this._validateForm();
    }

    onOutTimeChanged(time)
    {
        this.myPunchDetail.outtime = this._setDateTimeAfterTimeSelected(time, this.myPunchDetail.isnextdayout, 'out');
        this._calculateHoursWorked();
        this._validateForm();
    }

    inNextDay()
    {
        if (this.myPunchDetail.intime != null && this.myPunchDetail.intime != undefined)
        {
            this.myPunchDetail.intime = this._setDateTimeAfterTimeSelected(this.inTime, this.myPunchDetail.isnextdayin, 'in');
        }

        this._calculateHoursWorked();
        this._validateForm();
    }

    outNextDay()
    {
        if (this.myPunchDetail.outtime != null && this.myPunchDetail.outtime != undefined) {
            this.myPunchDetail.outtime = this._setDateTimeAfterTimeSelected(this.outTime, this.myPunchDetail.isnextdayout, 'out');
        }

        this._calculateHoursWorked();
        this._validateForm();
    }

    saveTime()
    {
        this.progressbar.showProgress();

        var timeToSave = new InOutTime(this.myPunchDetail);
        var additionalTime = ':00.0000000 +00:00';

        timeToSave.intime = this.myPunchDetail.intime;
        timeToSave.outtime = this.myPunchDetail.outtime;

        if (timeToSave.intime != null && timeToSave.intime.length > 0) {
            var day = this.datePipe.transform(timeToSave.intime, 'yyyy-MM-dd ');
            var inTime = this.datePipe.transform(timeToSave.intime, 'HH:mm aa');
            var actualTime = this.datePipe.transform(timeToSave.intime, 'yyyy-MM-dd HH:mm:ss');
            var hour = parseInt(inTime.substr(0, 2));
            var min = parseInt(inTime.substr(3, 2));
            var ampm = inTime.substr(inTime.length - 2, 2);
            var hourString = '', minString = '';

            if ((hour == 12 || hour == 0) && ampm == 'AM') {
                hourString = '00';
            }
            else if (hour < 12 && ampm == 'PM')
            {
                hour += 12;
                hourString = hour.toString();
            }
            else
            {
                hourString = hour.toString();
            }

            if (hourString.length == 1)
            {
                hourString = '0' + hourString;
            }

            minString = min.toString();
            if (minString.length == 1) {
                minString = '0' + minString;
            }

            day += hourString + ':' + minString + additionalTime;
            timeToSave.intime = day;
        }

        if (timeToSave.outtime != null && timeToSave.outtime.length > 0) {
            var day = this.datePipe.transform(timeToSave.outtime, 'yyyy-MM-dd ');
            var outtime = this.datePipe.transform(timeToSave.outtime, 'HH:mm aa');
            var actualTime = this.datePipe.transform(timeToSave.intime, 'yyyy-MM-dd HH:mm:ss');
            var hour = parseInt(outtime.substr(0, 2));
            var min = parseInt(outtime.substr(3, 2));
            var ampm = outtime.substr(outtime.length - 2, 2);
            var hourString = '', minString = '';

            if ((hour == 12 || hour == 0) && ampm == 'AM') {
                hourString = '00';
            }
            else if (hour < 12 && ampm == 'PM') {
                hour += 12;
                hourString = hour.toString();
            }
            else {
                hourString = hour.toString();
            }

            if (hourString.length == 1) {
                hourString = '0' + hourString;
            }

            minString = min.toString();
            if (minString.length == 1) {
                minString = '0' + minString;
            }

            day += hourString + ':' + minString + additionalTime;
            timeToSave.outtime = day;
        }

        this.punchTimeService.saveMyPunchDetails(timeToSave).then(response => {
            if (response) {
                if (response["ResultStatus"] == "1")
                {
                    this.refresh();
                }

                this.progressbar.hideProgress();
                this.snackComp.showSnackBarPost(response, '');
            }
        });
    }

    private _setDateTimeAfterTimeSelected(time, isNextDayChecked, nextDayChecked)
    {   
        var dat = new Date(this.myPunchDetail.punchday);

        if (isNextDayChecked && nextDayChecked == 'in')
        {
            if (this.myPunchDetail.isnextdayin) {
                dat.setDate(dat.getDate() + 1);
            }
        }
        else if (isNextDayChecked && nextDayChecked == 'out') {
            if (this.myPunchDetail.isnextdayout) {
                dat.setDate(dat.getDate() + 1);
            }
        }

        var time2 = time.value == undefined ? time : time.value;
        var hour = parseInt(time2.substr(0, 2));
        var min = parseInt(time2.substr(3, 2));
        var ampm = time2.substr(6, 2)

        return this.datePipe.transform(dat.setHours(hour, min, 0), 'MM-dd-yyyy HH:mm') + ' ' + ampm;
    }

    private _get24HourFormat(time)
    {
        if (time.toString().indexOf("PM") >= 0)
        {
            return parseInt(time.substr(0, 2)) + 12;
        }
        
        return parseInt(time.substr(0, 2));
    }

    private _initializeDataAfterServiceCall()
    {
        this.myPunchDetail = new InOutTime({});

        this.myPunchDetails.map((x) => {
            x.punchday = this.datePipe.transform(x.punchday, 'MM-dd-yyyy');

            if (x.intime != null && x.intime != undefined) {
                var intimeampm = '';
                var hour = 0;

                if (x.intime.indexOf('T') > 0)
                    hour = parseInt(x.intime.substr(x.intime.indexOf('T') + 1, 2));
                else
                    hour = parseInt(x.intime.substr(x.intime.indexOf(' ') + 1, 2));

                if (x.intime.indexOf('PM') > 0)
                    intimeampm = 'PM';
                else if (x.intime.indexOf('AM') > 0)
                    intimeampm = 'AM';
                else if (hour >= 12)
                    intimeampm = 'PM';
                else
                    intimeampm = 'AM';

                if (x.intime.indexOf('T') > 0)
                {
                    var newDate = x.intime.substr(0, x.intime.indexOf('T'));
                    var newTime = x.intime.substr(x.intime.indexOf('T') + 1, 5);
                    var day = this.datePipe.transform(newDate, 'MM-dd-yyyy');
                    
                    x.intime = this.utilities.Get12HourFormat(day, newTime, intimeampm);
                }
            }

            if (x.outtime != null && x.outtime != undefined) {
                var outtimeampm = '';
                var hour = 0;

                if (x.outtime.indexOf('T') > 0)
                    hour = parseInt(x.outtime.substr(x.outtime.indexOf('T') + 1, 2));
                else
                    hour = parseInt(x.outtime.substr(x.outtime.indexOf(' ') + 1, 2));

                if (x.outtime.indexOf('PM') > 0)
                    intimeampm = 'PM';
                else if (x.outtime.indexOf('AM') > 0)
                    intimeampm = 'AM';
                else if (hour >= 12)
                    outtimeampm = 'PM';
                else
                    outtimeampm = 'AM';


                if (x.outtime.indexOf('T') > 0) {
                    var newDate = x.outtime.substr(0, x.outtime.indexOf('T'));
                    var newTime = x.outtime.substr(x.outtime.indexOf('T') + 1, 5);
                    var day = this.datePipe.transform(newDate, 'MM-dd-yyyy');

                    x.outtime = this.utilities.Get12HourFormat(day, newTime, outtimeampm);
                }                
            }
        });

        this.dataSource = new MatTableDataSource(this.myPunchDetails);

        this._bindData();
    }

    /* Select a record in the grid to populate in the form. */
    private _bindData()
    {
        this.myPunchDetail.punchday = this.datePipe.transform(this.myPunchDetail.punchday, 'MM-dd-yyyy');

        if (this.myPunchDetail.punchday == null)
            return;

        if (this.myPunchDetail.istoday && !this.myPunchDetail.isabsent)
            this.isToday_Present = true;
        else
            this.isToday_Present = false;


        if (this.myPunchDetail.intime != null && this.myPunchDetail.intime != undefined) {
            var diff = (new Date(this.myPunchDetail.intime).valueOf() - new Date(this.myPunchDetail.punchday).valueOf());

            if (diff / (1000 * 3600 * 24) >= 1)
            {
                this.myPunchDetail.isnextdayin = true;
            }
            else
            {
                this.myPunchDetail.isnextdayin = false;
            }

            this.inTime = this.datePipe.transform(this.myPunchDetail.intime, 'HH:mm aa');
            var hour = parseInt(this.inTime.substr(0, 2));
            var ampm = this.inTime.substr(this.inTime.length - 2, 2);

            if (hour > 12) {
                if ((hour - 12).toString().length == 1)
                    this.inTime = "0" + (hour - 12) + this.inTime.substr(2);
                else
                    this.inTime = hour - 12 + this.inTime.substr(2);
            }
            else if (hour == 0) {
                this.inTime = 12 + this.inTime.substr(2);
            }
        }
        else
        {
            this.inTime = null;
        }

        if (this.myPunchDetail.outtime != null || this.myPunchDetail.outtime != undefined) {
            var diff = (new Date(this.myPunchDetail.outtime).valueOf() - new Date(this.myPunchDetail.punchday).valueOf());

            if (diff / (1000 * 3600 * 24) >= 1) {
                this.myPunchDetail.isnextdayout = true;
            }
            else {
                this.myPunchDetail.isnextdayout = false;
            }

            this.outTime = this.datePipe.transform(this.myPunchDetail.outtime, 'HH:mm aa');
            var hour = parseInt(this.outTime.substr(0, 2));
            var ampm = this.inTime.substr(this.outTime.length - 2, 2);

            if (hour > 12) {
                if ((hour - 12).toString().length == 1)
                    this.outTime = "0" + (hour - 12) + this.outTime.substr(2);
                else
                    this.outTime = hour - 12 + this.outTime.substr(2);
            }
            else if (hour == 0) {
                this.outTime = 12 + this.outTime.substr(2);
            }
        }
        else
        {
            this.outTime = null;
        }

        this._calculateHoursWorked();
        this._validateForm();
    }

    private _calculateHoursWorked()
    {
        if ((this.myPunchDetail.intime != null && this.myPunchDetail.intime != undefined && this.myPunchDetail.intime.length > 0)
            && (this.myPunchDetail.outtime != null && this.myPunchDetail.outtime != undefined && this.myPunchDetail.outtime.length > 0)) {
            var out = new Date(this.myPunchDetail.outtime);
            var inT = new Date(this.myPunchDetail.intime);
            this.hoursWorked = (out.getTime() - inT.getTime()) / (3600 * 1000);
        }
        else
        {   
            this.hoursWorked = 0;
        }
    }

    private _validateForm()
    {
        if (this.myPunchDetail.punchday.length > 0 && !this.myPunchDetail.isapproved && this.myPunchDetail.intime != null && this.hoursWorked >= 0)
            this.isSavable = true;
        else
            this.isSavable = false;

        if (this.myPunchDetail.intime != null)
            this.isOutTimeDisabled = false;
        else
            this.isOutTimeDisabled = true;
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
