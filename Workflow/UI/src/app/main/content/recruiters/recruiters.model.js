"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var Subscription_1 = require("rxjs/Subscription");
var common_1 = require("@angular/common");
var RecruitersJobs = /** @class */ (function () {
    function RecruitersJobs(job) {
        var datePipe = new common_1.DatePipe("en-US");
        this.jobassignmentid = job.jobassignmentid || 0;
        this.jobid = job.jobid || 0;
        this.title = job.title || '';
        this.location = job.location || '';
        this.duration = job.duration || '';
        this.description = job.description || '';
        this.publisheddate = datePipe.transform(job.publisheddate, 'MM/dd/yyyy hh:mm aa') || '';
        this.expirydate = datePipe.transform(job.expirydate, 'MM/dd/yyyy hh:mm aa') || '';
        this.referenceid = job.referenceid || '';
        this.priorityid = job.priorityid || 0;
        this.priorityLevel = job.priorityLevel || '2';
        this.jobassignmentstatusid = job.jobassignmentstatusid || 0;
        this.isactive = job.isactive || 0;
        this.starttime = job.starttime || '';
        this.endtime = job.endtime || '';
        this.submission = job.submission || 0;
        this.notesadded = job.notesadded || 0;
        this.qualificationadded = job.qualificationadded || 0;
        this.comment = job.comment || '';
        if (this.jobassignmentstatusid == 0 || this.isactive == 0) {
            this.expansionPanelId = false;
        }
        else if (this.jobassignmentstatusid != 0 && this.isactive == 1) {
            this.expansionPanelId = true;
        }
        else {
            this.expansionPanelId = false;
        }
        this.createdby = job.createdby || '';
        this.createdon = job.createdon || '';
        this.countdown = {
            days: '',
            hours: '',
            minutes: '',
            seconds: ''
        };
        this.diff = 0;
        this.dialogDiff = 0;
        this.status = '0';
        this.countDown = new Observable_1.Observable();
        this.dialogCountDown = new Observable_1.Observable();
        this.jobTimer = new Subscription_1.Subscription();
        this.dialogTimer = new Subscription_1.Subscription();
    }
    return RecruitersJobs;
}());
exports.RecruitersJobs = RecruitersJobs;
