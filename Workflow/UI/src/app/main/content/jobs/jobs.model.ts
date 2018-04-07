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
    location : string;
    duration : string;
    description : string;
    publisheddate : string;
    referenceid : string;
    
    isactive : string;

    userlist : number;
    priorityLevel : string;
    selectedUser : any;

    isSaveEnable : boolean;

    createdby : string;
    createdon : string;
    modifiedby : string;
    modifiedon : string;

    constructor(job)
    {
            var datePipe = new DatePipe("en-US");

            this.jobid = job.jobid || 0;
            this.title = job.title || '';
            this.location = job.location || '';
            this.duration = job.duration || '';
            this.description = job.description || '';
            //this.publisheddate = job.publisheddate || '';
            this.publisheddate = datePipe.transform(job.publisheddate, 'MM/dd/yyyy hh:mm aa')  || '';
            this.referenceid = job.referenceid || '';

            this.userlist = job.userlist || 0;
            this.priorityLevel = job.priorityLevel || '2';
            //console.log(JSON.parse(job.selectedUser));
            
            this.selectedUser =  JSON.parse(job.selectedUser) || [];

            this.isactive = job.isactive || "Active";

            this.isSaveEnable = false;

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
            //this.publisheddate = job.publisheddate || '';
            this.publisheddate = datePipe.transform(job.publisheddate, 'MM/dd/yyyy hh:mm aa')  || '';
            
            this.userid = job.userid || 0
            this.userlist = job.userlist || 0
            this.name = job.name || '';
            this.priorityid = job.priorityid || 0;
            this.priority = job.priority || '';
            this.status = job.status || '';
            this.description = job.description || '';
            //this.expirydate = job.expirydate || '';
            this.expirydate = datePipe.transform(job.expirydate, 'MM/dd/yyyy hh:mm aa')  || '';
            this.isactive = job.isactive || "Active";

            this.createdby = job.createdby || '';
            this.createdon = datePipe.transform(job.createdon, 'MM/dd/yyyy hh:mm aa')  || '';
            this.modifiedby = job.modifiedby || '';
            this.modifiedon = datePipe.transform(job.modifiedon, 'MM/dd/yyyy hh:mm aa')  || '';
    }
}
