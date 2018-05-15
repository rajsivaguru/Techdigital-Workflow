"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var JobReport = /** @class */ (function () {
    function JobReport(reports) {
        var datePipe = new common_1.DatePipe("en-US");
        this.ReferenceId = reports.ReferenceId || '';
        this.Title = reports.Title || '';
        this.Location = reports.Location || '';
        this.ClientName = reports.ClientName || '';
        this.PublishedDate = datePipe.transform(reports.PublishedDate, 'MM-dd-yyyy hh:mm aa') || '';
        this.IsActive = reports.IsActive || '';
        this.UserCount = reports.UserCount || 0;
        this.Users = reports.Users || '';
        this.Duration = reports.Duration || 0;
        this.Submission = reports.Submission || 0;
    }
    return JobReport;
}());
exports.JobReport = JobReport;
var JobReportForm = /** @class */ (function () {
    function JobReportForm(reports) {
        this.jobcode = reports.jobcode || '';
        this.title = reports.title || '';
        this.location = reports.location || '';
        this.publishedDate = reports.publishedDate || '';
        this.status = reports.status || -2;
        this.fromDate = reports.fromDate || '';
        this.toDate = reports.toDate || '';
        this.lastDatys = reports.lastDatys || -1;
    }
    return JobReportForm;
}());
exports.JobReportForm = JobReportForm;
var UserReport = /** @class */ (function () {
    function UserReport(reports) {
        var datePipe = new common_1.DatePipe("en-US");
        this.userid = reports.userid || '';
        this.username = reports.username || '';
        this.jobcode = reports.jobcode || '';
        this.title = reports.title || '';
        this.clientname = reports.clientname || '';
        this.location = reports.location || '';
        this.publisheddate = datePipe.transform(reports.publisheddate, 'MM-dd-yyyy hh:mm aa') || '';
        this.assigneddate = datePipe.transform(reports.assigneddate, 'MM-dd-yyyy hh:mm aa') || '';
        this.duration = reports.duration || '';
        this.submission = reports.submission || 0;
        this.jobstarted = reports.jobstarted || false;
        this.comment = reports.comment || '';
    }
    return UserReport;
}());
exports.UserReport = UserReport;
var UserReportParam = /** @class */ (function () {
    function UserReportParam(reports) {
        this.userids = reports.userids || [];
        this.jobcode = reports.jobcode || '';
        this.title = reports.title || '';
        this.location = reports.location || '';
        this.publisheddate = reports.publisheddate || '';
        this.assigneddate = reports.assigneddate || '';
        this.fromdate = reports.fromdate || '';
        this.todate = reports.todate || '';
        this.lastdays = reports.lastdays || -1;
        this.reporttype = reports.reporttype || '';
    }
    return UserReportParam;
}());
exports.UserReportParam = UserReportParam;
