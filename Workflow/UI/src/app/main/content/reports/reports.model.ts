import { DatePipe } from '@angular/common';

export class JobReport
{
    referenceid   : string;
    title : string;
    location : string;
    clientname: string;
    publisheddate  : string;
    isactive  : string;
    usercount  : number;
    users : string;
    duration   : number;
    submission  : number;
  
    constructor(reports?)
    {
        var datePipe = new DatePipe("en-US");

        this.referenceid = reports.referenceid || '';
        this.title = reports.title || '';
        this.location = reports.location || '';
        this.clientname = reports.clientname || '';
        this.publisheddate = datePipe.transform(reports.publisheddate, 'MM-dd-yyyy hh:mm aa') || '';
        this.isactive = reports.isactive || '';
        this.usercount = reports.usercount || 0;
        this.users  = reports.users || '';
        this.duration = reports.duration || 0;
        this.submission = reports.submission || 0;
    }
}

export class JobReportParam
{
    jobcode         : string;
    title           : string;
    location        : string;
    publishedDate   : string;
    status          : number
    fromDate        : string;
    toDate          : string;
    lastDays: number;
    reporttype: string;

    constructor(reports?)
    {
        this.jobcode = reports.jobcode || '';
        this.title = reports.title || '';
        this.location = reports.location || '';
        this.publishedDate = reports.publishedDate || '';        
        this.status = reports.status || -2;
        this.fromDate = reports.fromDate || '';
        this.toDate = reports.toDate || '';
        this.lastDays = reports.lastDays || -1;
    }
}

export class UserReport
{
    userid   : string;
    username : string;
    jobcode : string;
    title : string;
    clientname: string;
    location : string;
    publisheddate  : string;
    assigneddate  : string;
    duration   : string;
    submission  : number;
    jobstarted : boolean
    comment   : string;
  
    constructor(reports?)
    {
        var datePipe = new DatePipe("en-US");

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
        this.jobstarted  = reports.jobstarted || false;
        this.comment  = reports.comment || '';
    }   
}

export class UserReportParam
{
    userids         : number[];
    jobcode         : string;
    //clientname      : string;
    title           : string;
    location        : string;
    publisheddate   : string;
    assigneddate    : string;
    fromdate        : string;
    todate          : string;
    lastdays        : number;
    reporttype      : string;

    constructor(reports?)
    {
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
}

export class ClientReportParam {
    clientIds: number[];
    jobcode: string;
    title: string;
    publishedDate: string;
    lastDays: number;
    reporttype: string;
    loginid: number;

    constructor(report?) {
        this.clientIds = report.clientIds || [];
        this.jobcode = report.jobcode || '';
        this.title = report.title || '';
        this.publishedDate = report.publishedDate || '';
        this.lastDays = report.lastDays || -1;
        this.reporttype = report.reporttype || '';
        this.loginid = report.loginid || -1;
    }
}

export class ClientReport {
    jobcode: string;
    title: string;
    location: string;
    clientname: string;
    publisheddate: string;
    jobstatus: boolean;
    assignmentcount: number;
    submissions: number;

    constructor(reports?) {
        var datePipe = new DatePipe("en-US");

        this.jobcode = reports.jobcode || '';
        this.title = reports.title || '';
        this.location = reports.location || '';
        this.clientname = reports.clientname || '';
        this.publisheddate = datePipe.transform(reports.publisheddate, 'MM-dd-yyyy hh:mm aa') || '';
        this.jobstatus = reports.jobstatus || false;
        this.assignmentcount = reports.assignmentcount || 0;
        this.submissions = reports.submissions || 0;
    }
}

export class ProfileSearchReportParam {
    userIds: number[];
    title: string;
    location: string;
    searcheddate: string;
    lastDays: number;
    reporttype: string;
    loginid: string;

    constructor(report?) {
        this.userIds = report.clientIds || [];
        this.title = report.title || '';
        this.location = report.location || '';
        this.searcheddate = report.searcheddate || '';
        this.lastDays = report.lastDays || -1;
        this.reporttype = report.reporttype || '';
        this.loginid = report.loginid || -1;
    }
}

export class ProfileSearchReport {
    recordid: number;
    username: string;
    jobcode: string;
    title: string;
    location: string;
    searcheddate: string;
    searchengine: string;
    skill1: string;
    skill2: string;
    skill3: string;
    headline: string;
    searchurl: string;
    isjobseeker: boolean;
    isoverride: boolean;
    
    constructor(report?) {
        var datePipe = new DatePipe("en-US");

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
}


