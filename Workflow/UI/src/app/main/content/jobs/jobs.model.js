"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var JobStatusHistory = /** @class */ (function () {
    function JobStatusHistory() {
    }
    return JobStatusHistory;
}());
exports.JobStatusHistory = JobStatusHistory;
var JobStatus = /** @class */ (function () {
    function JobStatus() {
    }
    return JobStatus;
}());
exports.JobStatus = JobStatus;
var Priority = /** @class */ (function () {
    function Priority() {
    }
    return Priority;
}());
exports.Priority = Priority;
var JobsList = /** @class */ (function () {
    function JobsList(job) {
        var datePipe = new common_1.DatePipe("en-US");
        this.jobid = job.jobid || 0;
        this.title = job.title || '';
        this.location = job.location || '';
        this.formattedtitle = job.formattedtitle || '';
        this.formattedtitle2 = job.formattedtitle2 || '';
        this.duration = job.duration || '';
        this.description = job.description || '';
        //this.publisheddate = job.publisheddate || '';
        this.publisheddate = datePipe.transform(job.publisheddate, 'MM/dd/yyyy hh:mm aa') || '';
        this.referenceid = job.referenceid || '';
        this.clientname = job.clientname || '';
        this.oldclientname = job.clientname || '';
        this.userlist = job.userlist || 0;
        this.priorityLevel = job.priorityLevel;
        this.oldPriorityLevel = job.priorityLevel;
        this.selectedUser = JSON.parse(job.selectedUser) || [];
        this.oldSelectedUser = JSON.parse(job.selectedUser) || [];
        this.isactive = job.isactive || "Active";
        this.isSaveEnable = false;
        this.isSaveEnableSelectedUser = false;
        this.isDirty = false;
        this.isValid = false;
        this.createdby = job.createdby || '';
        this.createdon = datePipe.transform(job.createdon, 'MM/dd/yyyy hh:mm aa') || '';
        this.modifiedby = job.modifiedby || '';
        this.modifiedon = datePipe.transform(job.modifiedon, 'MM/dd/yyyy hh:mm aa') || '';
    }
    return JobsList;
}());
exports.JobsList = JobsList;
var Jobs = /** @class */ (function () {
    function Jobs(job) {
        var datePipe = new common_1.DatePipe("en-US");
        this.jobassignmentid = job.jobassignmentid || 0;
        this.jobid = job.jobid || 0;
        this.referenceid = job.referenceid || '';
        this.title = job.title || '';
        this.location = job.location || '';
        this.publisheddate = datePipe.transform(job.publisheddate, 'MM/dd/yyyy hh:mm aa') || '';
        this.userid = job.userid || 0;
        this.userlist = job.userlist || 0;
        this.name = job.name || '';
        this.priorityid = job.priorityid || 0;
        this.priority = job.priority || '';
        this.status = job.status || '';
        this.description = job.description || '';
        this.expirydate = datePipe.transform(job.expirydate, 'MM/dd/yyyy hh:mm aa') || '';
        this.isactive = job.isactive || "Active";
        this.createdby = job.createdby || '';
        this.createdon = datePipe.transform(job.createdon, 'MM/dd/yyyy hh:mm aa') || '';
        this.modifiedby = job.modifiedby || '';
        this.modifiedon = datePipe.transform(job.modifiedon, 'MM/dd/yyyy hh:mm aa') || '';
    }
    return Jobs;
}());
exports.Jobs = Jobs;
var JobAssignment = /** @class */ (function () {
    function JobAssignment(jobs) {
        this.jobid = jobs.jobid || 0;
        this.clientname = jobs.clientname || '';
        this.priorityid = jobs.priorityid || 0;
        this.userids = jobs.userids || [];
        this.loginid = jobs.loginid || 0;
    }
    return JobAssignment;
}());
exports.JobAssignment = JobAssignment;
var Client = /** @class */ (function () {
    function Client(client) {
        this.id = client.id || 0;
        this.clientname = client.clientname || '';
        this.shortname = client.shortname || '';
    }
    return Client;
}());
exports.Client = Client;
var PriorityJob = /** @class */ (function () {
    function PriorityJob(job) {
        var datePipe = new common_1.DatePipe("en-US");
        this.jobid = job.jobid || 0;
        this.title = job.title || '';
        this.location = job.location || '';
        this.publisheddate = datePipe.transform(job.publisheddate, 'MM/dd/yyyy hh:mm aa') || '';
        this.prioritizeddate = datePipe.transform(job.prioritizeddate, 'MM/dd/yyyy hh:mm aa') || '';
        this.referenceid = job.referenceid || '';
        this.clientname = job.clientname || '';
        this.assigneduser = job.assigneduser != undefined ? JSON.parse(job.assigneduser) || [] : [];
        this.isprioritized = false;
        this.isinterested = job.isinterested || false;
        this.isselected = false;
        this.isremoved = false;
    }
    return PriorityJob;
}());
exports.PriorityJob = PriorityJob;
