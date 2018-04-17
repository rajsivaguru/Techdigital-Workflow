import { FuseUtils } from '../../../core/fuseUtils';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MatDialogRef} from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
export class RecruitersJobs
{
    jobassignmentid : string;
    jobid : string;
    title : string;
    location : string;
    duration : string;
    description : string;
    publisheddate : string;
    expirydate : string;
    referenceid : string;
    priorityid :  number;
    priorityLevel : string;

    jobassignmentstatusid : number;
    submission : number;
    status : string;
    isactive : number;
    comment : string;
    starttime : string;
    endtime : string;

    createdby : string;
    createdon : string;
   
    expansionPanelId : boolean;
    
    countdown : any;
    diff : number;
    dialogDiff : number;

    countDown : any ;
    dialogCountDown : any ;

    jobTimer : any;
    dialogTimer : any;


    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    

    constructor(job)
    {
            var datePipe = new DatePipe("en-US");

            this.jobassignmentid = job.jobassignmentid || 0;
            this.jobid = job.jobid || 0;
            this.title = job.title || '';
            this.location = job.location || '';
            this.duration = job.duration || '';
            this.description = job.description || '';
            this.publisheddate = datePipe.transform(job.publisheddate, 'MM/dd/yyyy hh:mm aa')  || '';
            this.expirydate = datePipe.transform(job.expirydate, 'MM/dd/yyyy hh:mm aa')  || '';
            this.referenceid = job.referenceid || '';

            this.priorityid = job.priorityid || 0;
            this.priorityLevel = job.priorityLevel || '2';

            this.jobassignmentstatusid = job.jobassignmentstatusid || 0;
            this.isactive = job.isactive || 0;

            this.starttime = job.starttime || '';
            this.endtime = job.endtime || '';      

            this.submission = job.submission || 0;      
            this.comment = job.comment || '';      


            if ( this.jobassignmentstatusid == 0 || this.isactive == 0 )
            {
                this.expansionPanelId = false;
                //this.submission = 0;
                //this.comment =  '';
            }
            else  if ( this.jobassignmentstatusid != 0 && this.isactive == 1 )
            {
                this.expansionPanelId = true;
                //this.submission = job.submission || 0;
                //this.comment = job.comment || '';
            }
            else
            {
                this.expansionPanelId = false;
                //this.submission = 0;
                //this.comment =  '';
            }

            //this.expansionPanelId = true;
            this.createdby = job.createdby || '';
            this.createdon = job.createdon || '';


            

            this.countdown = {
                days   : '',
                hours  : '',
                minutes: '',
                seconds: ''
            }
            
            this.diff = 0;
            this.dialogDiff = 0;

            this.status = '0';

            this.countDown = new Observable();
            this.dialogCountDown = new Observable();

            this.jobTimer = new Subscription();
            this.dialogTimer = new Subscription();

            
    }
}
