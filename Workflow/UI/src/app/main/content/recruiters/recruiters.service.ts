import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RecruitersJobs } from './recruiters.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { FuseConfigService } from '../../../core/services/config.service';
import { LoginService } from '../login/login.service';

@Injectable()
export class RecruitersService implements Resolve<any>
{
    onRecruiterJobChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();

    recruiterJobs : RecruitersJobs[];

    searchText: string = "";
    filterBy: string;
    serviceURL : String;

    constructor(private http: HttpClient, private configSer : FuseConfigService, public loginService : LoginService)
    {

        this.serviceURL = configSer.ServiceURL;
    }

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        
    }

    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.searchText = "";
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getRecruiterJobs()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getRecruiterJobs();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getRecruiterJobs();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    getRecruiterJobs(): Promise<any>
    {
        return new Promise((resolve, reject) => {

                let userid  = '0';
                if (this.loginService.loggedUser != undefined)
                    userid = this.loginService.loggedUser.userid;
                    
               this.http.get(this.serviceURL+'TDW/GetRecruiterJobList?loginid='+userid)
                    .subscribe((response: any) => {

                        if ( response != null && response != undefined)
                        {
                        response = JSON.parse(response);
                        

                        this.recruiterJobs = response;
                        //console.log(this.recruiterJobs);
                        
                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.recruiterJobs = FuseUtils.filterArrayByString(this.recruiterJobs, this.searchText);
                        }

                        if (this.recruiterJobs.length > 0)
                        {
                            this.recruiterJobs = this.recruiterJobs.map(contact => {
                                let rectJob = new RecruitersJobs(contact);
                                 rectJob.countdown = {
                                    days   : 0,
                                    hours  : 0,
                                    minutes: 0,
                                    seconds: 0
                                }
                                rectJob.diff = 1;
                                return rectJob;
                            });
                        }

                        this.onRecruiterJobChanged.next(this.recruiterJobs);
                        resolve(this.recruiterJobs);


                        }
                        else
                        {
                            resolve([]);
                        }
                    }, reject);
            }
        );
    }


    startRecruiterJob(jobassignmentid)
    {
        let userid  = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL+'TDW/StartRecruiterJobStatus?jobassignmentid=' + jobassignmentid + '&userid='+ userid)
                .subscribe( (response : any )=> {

                        if ( response != null && response != undefined && response != "")
                        {
                            response = JSON.parse(response);
                            this.getRecruiterJobs();
                            resolve(response);
                        }
                        else
                            resolve('');
                });
        });
    }

    stopRecruiterJob(jaid, jobassignmentstatusid, submission, comment)
    {
        let userid  = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL+'TDW/StopRecruiterJobStatus?jobassignmentid=' + jaid +'&jobassignmentstatusid='+ jobassignmentstatusid + '&submission='+ submission + '&comment='+ comment+ '&userid='+ userid)
                .subscribe( (response : any )=> {
                        if ( response != null && response != undefined && response != "")
                        {
                            response = JSON.parse(response);
                            this.getRecruiterJobs();
                            resolve(response);
                        }
                        else
                            resolve('');
                });
        });
    }

    
   

}
