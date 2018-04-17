import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JobReport, JobReportForm, UserReport, UserReportParam } from './reports.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { FuseConfigService } from '../../../core/services/config.service';
import { LoginService } from '../login/login.service';


@Injectable()
export class ReportsService {

  
    onContactsChanged: BehaviorSubject<any> = new BehaviorSubject({});

    onUserReportChanged: BehaviorSubject<any> = new BehaviorSubject({});

    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();

    jobReports : JobReport[];
    userReports : UserReport[];
    searchText: string;
    filterBy: string;

    serviceURL : String;

    headers: Headers;
    options: RequestOptions;


    constructor(private http: HttpClient, private httpObser: Http, private configSer : FuseConfigService, public loginService : LoginService)
    {
        this.serviceURL = configSer.ServiceURL;
        this.headers = new Headers({ 'Content-Type': 'application/json', 
                                     'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new RequestOptions({ headers: this.headers });

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
            // this.searchText = "";
            this.jobReports = [];
            this.userReports = [];
    }

    getJobs(rptForm : JobReportForm): Promise<any>
    {

        return new Promise((resolve, reject) => {

               let tempUrl = 'TDW/GetJobReport?jobcode='+ rptForm.jobcode +'&title='+ rptForm.title +'&location='+ rptForm.location +'&publisheddate='+ rptForm.publishedDate +'&isactive='+ rptForm.status +'&fromdate='+ rptForm.fromDate +'&todate='+ rptForm.toDate +'&lastdays='+ rptForm.lastDatys +'';
               this.http.get(this.serviceURL + tempUrl)
                    .subscribe((response: any) => {
                        
                        //console.log(response)
                        if ( response != null && response != undefined)
                        {
                        response = JSON.parse(response);
                        //console.log('fetching jobs...');
                        

                        this.jobReports = response;

                         if (this.jobReports.length > 0)
                        {
                            this.jobReports = this.jobReports.map(rpt => {
                                return new JobReport(rpt);
                            });

                        }

                        //console.log(this.jobReports)
                        this.onContactsChanged.next(this.jobReports);
                        resolve(this.jobReports);
                        

                        }
                        else
                        {
                            this.jobReports = [];
                            this.onContactsChanged.next(this.jobReports);
                            resolve(this.jobReports);
                        }

                    
                    }, reject);
            }
        );
    }


getUserReport(userRptParam : UserReportParam): Promise<any>
    {

        return new Promise((resolve, reject) => {

            let userid  = '0';
                if (this.loginService.loggedUser != undefined)
                    userid = this.loginService.loggedUser.userid;

        //?sUserModel=' + JSON.stringify(contact) + '&loginid='+userid)
                let params: URLSearchParams = new URLSearchParams();
                for (var key in userRptParam) {
                    if (userRptParam.hasOwnProperty(key)) {
                        let val = userRptParam[key];
                        params.set(key, val);
                    }
                }

                this.headers = new Headers({ 'Content-Type': 'application/json', 
                                     'Accept': 'q=0.8;application/json;q=0.9' });
                
                                    
                //console.log(params)
                this.options = new RequestOptions({ headers: this.headers, search: params });
                
               let tempUrl = 'Report/GetUserReport?userRptParam=' + JSON.stringify(userRptParam) + '&loginid='+userid
//               let tempUrl = 'Report/GetUserReport'
               this.http.get(this.serviceURL + tempUrl)
                    .subscribe((response: any) => {
                        

                        if ( response != null && response != undefined)
                        {
                        response = JSON.parse(response);
                        //console.log('fetching jobs...');
                        //console.log(response)                        

                        this.userReports = response;

                         if (this.userReports.length > 0)
                        {
                            this.userReports = this.userReports.map(rpt => {
                                return new UserReport(rpt);
                            });

                        }

                        //console.log(this.jobReports)
                        this.onUserReportChanged.next(this.userReports);
                        resolve(this.userReports);
                        

                        }
                        else
                        {
                            this.userReports = [];
                            this.onUserReportChanged.next(this.userReports);
                            resolve(this.userReports);
                        }

                    
                    }, reject);
            }
        );
    }

    getLastDays(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get(this.serviceURL+'Report/GetPeriods')
                    .subscribe((response: any) => {
                        response = JSON.parse(response);
                        resolve(response);
                    }, reject);
            }
        );
    }

   searchJob = (keyword: any): Observable<any[]> => {
        try
        {
            //console.log('calling..')
            return this.httpObser.get(this.serviceURL+'TDW/SearchJob?keyword=' + keyword)
                .map(res => {
                let json = res.json();
                //console.log(json)
                return JSON.parse(json);
            })
             
        }
        catch(ex)
        {
            return Observable.of([]);
        }
    
    }
    

    searchUser (keyword) : any
    {
            //console.log('call service'+keyword+this.serviceURL+'SearchUser?keyword=' + keyword);
            return this.httpObser.get(this.serviceURL+'TDW/SearchUser?keyword=' + keyword)
                .map(res => {
                let json = res.json();
                //console.log(json)
                return JSON.parse(json);
            })
    }



}
