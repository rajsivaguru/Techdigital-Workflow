import { FuseUtils } from '../../../core/fuseUtils';
import { DatePipe } from '@angular/common';

export class JobStatusHistory
{
    statusid : number;
    name : string;
    comment : string;
    createdby : string;
    createdon : string;
}

export class JobStatus
{
    statusid : number;
    name : string;
}

export class Priority
{
    priorityid : number;
    name : string;
}

export class JobsList
{
    jobid : string;
    title : string;
    location: string;
    formattedtitle: string;
    formattedtitle2: string;
    duration : string;
    description: string;
    clientname : string;
    oldclientname : string;
    publisheddate : string;
    referenceid : string;    
    isactive : string;
    userlist : number;
    priorityLevel : string;
    oldPriorityLevel : string;
    selectedUser : any;
    oldSelectedUser : any;
    isSaveEnable : boolean;
    isSaveEnableSelectedUser : boolean;
    isDirty: boolean;
    isValid: boolean;
    createdby: string;
    createdon : string;
    modifiedby : string;
    modifiedon : string;

    constructor(job)
    {
        var datePipe = new DatePipe("en-US");

        this.jobid = job.jobid || 0;
        this.title = job.title || '';
        this.location = job.location || '';
        this.formattedtitle = job.formattedtitle || '';
        this.formattedtitle2 = job.formattedtitle2 || '';
        this.duration = job.duration || '';
        this.description = job.description || '';
        
        //this.publisheddate = job.publisheddate || '';
        this.publisheddate = datePipe.transform(job.publisheddate, 'MM/dd/yyyy hh:mm aa')  || '';
        this.referenceid = job.referenceid || '';

        this.clientname = job.clientname || '';
        this.oldclientname = job.clientname || '';

        this.userlist = job.userlist || 0;
        this.priorityLevel = job.priorityLevel;
        this.oldPriorityLevel = job.priorityLevel;

        this.selectedUser =  JSON.parse(job.selectedUser) || [];
        this.oldSelectedUser =  JSON.parse(job.selectedUser) || [];
        this.isactive = job.isactive || "Active";

        this.isSaveEnable = false;
        this.isSaveEnableSelectedUser = false;
        this.isDirty = false;
        this.isValid = false;

        this.createdby = job.createdby || '';
        this.createdon = datePipe.transform(job.createdon, 'MM/dd/yyyy hh:mm aa')  || '';
        this.modifiedby = job.modifiedby || '';
        this.modifiedon = datePipe.transform(job.modifiedon, 'MM/dd/yyyy hh:mm aa')  || '';
    }
}

export class Jobs
{
    jobassignmentid: string;
    jobid : string;
    referenceid : string;
    title : string;
    location : string;
    publisheddate : string;
    userid : string;
    userlist : number;
    name : string;
    priorityid : string;
    priority : string;
    status : string;
    description : string;
    expirydate : string;
    isactive : string;
    createdby : string;
    createdon : string;
    modifiedby : string;
    modifiedon : string;

    constructor(job)
    {
        var datePipe = new DatePipe("en-US");

        this.jobassignmentid = job.jobassignmentid || 0;
        this.jobid = job.jobid || 0;
        this.referenceid = job.referenceid || '';
        this.title = job.title || '';
        this.location = job.location || '';
        this.publisheddate = datePipe.transform(job.publisheddate, 'MM/dd/yyyy hh:mm aa')  || '';
            
        this.userid = job.userid || 0
        this.userlist = job.userlist || 0
        this.name = job.name || '';
        this.priorityid = job.priorityid || 0;
        this.priority = job.priority || '';
        this.status = job.status || '';
        this.description = job.description || '';
        this.expirydate = datePipe.transform(job.expirydate, 'MM/dd/yyyy hh:mm aa')  || '';
        this.isactive = job.isactive || "Active";

        this.createdby = job.createdby || '';
        this.createdon = datePipe.transform(job.createdon, 'MM/dd/yyyy hh:mm aa')  || '';
        this.modifiedby = job.modifiedby || '';
        this.modifiedon = datePipe.transform(job.modifiedon, 'MM/dd/yyyy hh:mm aa')  || '';
    }
}

export class JobAssignment
{
    jobid           : string;
    clientname      : string;
    priorityid      : string;
    userids         : number[];
    loginid         : string;

    constructor(jobs?)
    {
        this.jobid = jobs.jobid || 0;
        this.clientname = jobs.clientname || '';
        this.priorityid = jobs.priorityid || 0;
        this.userids = jobs.userids || [];
        this.loginid = jobs.loginid || 0;
    }
}

export class Client
{
    id : string;
    clientname : string;
    shortname : string;

    constructor(client)
    {
        this.id = client.id || 0;
        this.clientname = client.clientname || '';
        this.shortname = client.shortname || '';
    }
}

export class PriorityJob {
    jobid: number;
    title: string;
    location: string;
    clientname: string;
    publisheddate: string;
    prioritizeddate: string;
    referenceid: string;
    assigneduser: any;
    isprioritized: boolean;
    isinterested: boolean;
    isselected: boolean;
    isremoved: boolean;

    constructor(job) {
        var datePipe = new DatePipe("en-US");

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
}