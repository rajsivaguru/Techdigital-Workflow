import { DatePipe } from '@angular/common';

export class JobReport
{
    ReferenceId   : string;
    Title : string;
    Location : string;
    ClientName: string;
    PublishedDate  : string;
    IsActive  : string;
    UserCount  : number;
    Users : string;
    Duration   : number;
    Submission  : number;
  
    constructor(reports?)
    {
        var datePipe = new DatePipe("en-US");

        this.ReferenceId = reports.ReferenceId || '';
        this.Title = reports.Title || '';
        this.Location = reports.Location || '';
        this.ClientName = reports.ClientName || '';
        this.PublishedDate = datePipe.transform(reports.PublishedDate, 'MM-dd-yyyy hh:mm aa') || '';        
        this.IsActive = reports.IsActive || '';
        this.UserCount = reports.UserCount || 0;
        this.Users  = reports.Users || '';
        this.Duration = reports.Duration || 0;
        this.Submission = reports.Submission || 0;
    }
}

export class JobReportForm
{
    jobcode         : string;
    title           : string;
    location        : string;
    publishedDate   : string;
    status          : number
    fromDate        : string;
    toDate          : string;
    lastDatys       : number;

    constructor(reports?)
    {
        this.jobcode = reports.jobcode || '';
        this.title = reports.title || '';
        this.location = reports.location || '';
        this.publishedDate = reports.publishedDate || '';        
        this.status = reports.status || -2;
        this.fromDate = reports.fromDate || '';
        this.toDate = reports.toDate || '';
        this.lastDatys = reports.lastDatys || -1;
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
    assigneddate          : string;
    fromdate        : string;
    todate          : string;
    lastdays       : number;

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
    }
}

