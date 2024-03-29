"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var JobReport = /** @class */ (function () {
    function JobReport(reports) {
        var datePipe = new common_1.DatePipe("en-US");
        this.referenceid = reports.referenceid || '';
        this.title = reports.title || '';
        this.location = reports.location || '';
        this.clientname = reports.clientname || '';
        this.publisheddate = datePipe.transform(reports.publisheddate, 'MM-dd-yyyy hh:mm aa') || '';
        this.isactive = reports.isactive || '';
        this.usercount = reports.usercount || 0;
        this.users = reports.users || '';
        this.duration = reports.duration || 0;
        this.submission = reports.submission || 0;
    }
    return JobReport;
}());
exports.JobReport = JobReport;
var JobReportParam = /** @class */ (function () {
    function JobReportParam(reports) {
        this.jobcode = reports.jobcode || '';
        this.title = reports.title || '';
        this.location = reports.location || '';
        this.publishedDate = reports.publishedDate || '';
        this.status = reports.status || -2;
        this.fromDate = reports.fromDate || '';
        this.toDate = reports.toDate || '';
        this.lastDays = reports.lastDays || -1;
    }
    return JobReportParam;
}());
exports.JobReportParam = JobReportParam;
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
var ClientReportParam = /** @class */ (function () {
    function ClientReportParam(report) {
        this.clientIds = report.clientIds || [];
        this.jobcode = report.jobcode || '';
        this.title = report.title || '';
        this.publishedDate = report.publishedDate || '';
        this.lastDays = report.lastDays || -1;
        this.reporttype = report.reporttype || '';
        this.loginid = report.loginid || -1;
    }
    return ClientReportParam;
}());
exports.ClientReportParam = ClientReportParam;
var ClientReport = /** @class */ (function () {
    function ClientReport(reports) {
        var datePipe = new common_1.DatePipe("en-US");
        this.jobcode = reports.jobcode || '';
        this.title = reports.title || '';
        this.location = reports.location || '';
        this.clientname = reports.clientname || '';
        this.publisheddate = datePipe.transform(reports.publisheddate, 'MM-dd-yyyy hh:mm aa') || '';
        this.jobstatus = reports.jobstatus || false;
        this.assignmentcount = reports.assignmentcount || 0;
        this.submissions = reports.submissions || 0;
    }
    return ClientReport;
}());
exports.ClientReport = ClientReport;
var ProfileSearchReportParam = /** @class */ (function () {
    function ProfileSearchReportParam(report) {
        this.userIds = report.clientIds || [];
        this.title = report.title || '';
        this.location = report.location || '';
        this.searcheddate = report.searcheddate || '';
        this.lastDays = report.lastDays || -1;
        this.reporttype = report.reporttype || '';
        this.loginid = report.loginid || -1;
    }
    return ProfileSearchReportParam;
}());
exports.ProfileSearchReportParam = ProfileSearchReportParam;
var ProfileSearchReport = /** @class */ (function () {
    function ProfileSearchReport(report) {
        var datePipe = new common_1.DatePipe("en-US");
        this.recordid = report.recordid || 0;
        this.username = report.username || '';
        this.jobcode = report.jobcode || '';
        this.title = report.title || '';
        this.location = report.location || '';
        this.searcheddate = datePipe.transform(report.searcheddate, 'MM-dd-yyyy hh:mm aa') || '';
        this.searchengine = report.searchengine || '';
        this.skill1 = report.skill1 || '';
        this.skill2 = report.skill2 || '';
        this.skill3 = report.skill3 || '';
        this.headline = report.headline || '';
        this.searchurl = report.searchurl || '';
        this.isjobseeker = report.isjobseeker || false;
        this.isoverride = report.isoverride || false;
    }
    return ProfileSearchReport;
}());
exports.ProfileSearchReport = ProfileSearchReport;
var PunchReportParam = /** @class */ (function () {
    function PunchReportParam(report) {
        this.showOnlyMissingTime = report.showOnlyMissingTime || false;
        this.includeWeekends = report.includeWeekends || true;
        this.userRoleIds = report.userRoleIds || [];
        this.fromDate = report.fromDate || '';
        this.toDate = report.toDate || '';
        this.userids = report.userids || [];
        this.reporttype = report.reporttype || '';
        this.loginid = report.loginid || -1;
    }
    return PunchReportParam;
}());
exports.PunchReportParam = PunchReportParam;
var PunchReport = /** @class */ (function () {
    function PunchReport(report) {
        this.punchdate = report.punchdate || '';
        this.username = report.username || '';
        this.intime = report.intime || '';
        this.outtime = report.outtime || '';
        this.notes = report.notes || '';
        this.isabsent = report.isabsent || false;
        this.istimemissing = report.istimemissing || false;
        this.hourday = report.timetoday || '';
    }
    return PunchReport;
}());
exports.PunchReport = PunchReport;
