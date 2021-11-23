import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JobReport, JobReportParam, UserReport, UserReportParam, ClientReportParam, ClientReport, ProfileSearchReportParam, ProfileSearchReport } from './reports.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { FuseConfigService } from '../../../core/services/config.service';
import { LoginService } from '../login/login.service';

let headers = new HttpHeaders();
headers.set("Content-Type", "application/json");

@Injectable()
export class ReportsService {  
    onJobReportChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onUserReportChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onClientReportChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onProfileSearchReportChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();
    jobReports : JobReport[];
    userReports: UserReport[];
    clientReports: ClientReport[];
    profileSearchReports: ProfileSearchReport[];
    searchText: string;
    filterBy: string;
    serviceURL: String;
    loggedUserId: string;
    
    constructor(private http: HttpClient, private httpObser: Http, private configSer : FuseConfigService, public loginService : LoginService)
    {
        this.serviceURL = configSer.ServiceURL;
    }

    ngOnInit() {
    }

    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.loggedUserId = this.loginService.getLoginId();
        this.jobReports = [];
        this.userReports = [];
        this.clientReports = [];
        this.profileSearchReports = [];

        ////let item = new ProfileSearchReport({ username: 'Test', title: 'Job Title', location: "Job Location", searchengine: "Google", searcheddate: "03:28:2019 10:28 " });
        ////this.profileSearchReports.push(item);
    }

    getLoginId() {
        return this.loggedUserId;
    }

    getJobReport(jobRptParam: JobReportParam): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Report/GetJobReport?source=' + JSON.stringify(jobRptParam)).subscribe((response: any) => {
                if ( response != null && response != undefined)
                    this.jobReports = response.Output;
                else
                    this.jobReports = [];

                this.onJobReportChanged.next(this.jobReports);
                resolve(this.jobReports);
            }, reject);
        });
    }

    getJobReportExport(parameters: JobReportParam): Promise<any> {
        return new Promise((resolve, reject) => {
            window.open(this.serviceURL + 'Report/GetJobReportFile?sourceParam=' + JSON.stringify(parameters), "_blank");
        });
    }

    getUserReport(userRptParam : UserReportParam): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            let userid  = '0';
            
            if (this.loginService.loggedUser != undefined)
                userid = this.loginService.loggedUser.userid;
    
            let tempUrl = 'Report/GetUserReport?source=' + JSON.stringify(userRptParam) + '&loginid=' + userid
            
            this.http.get(this.serviceURL + tempUrl)
                .subscribe((response: any) => {
                    if ( response != null && response != undefined)
                        this.userReports = response.Output;
                    else
                        this.userReports = [];

                    this.onUserReportChanged.next(this.userReports);
                    resolve(this.userReports);
                }, reject);
            }
        );
    }
    
    getUserReportExport(userRptParam: UserReportParam): Promise<any> {
        return new Promise((resolve, reject) => {            
            window.open(this.serviceURL + 'Report/GetUserReportFile?sourceParam=' + JSON.stringify(userRptParam), "_blank");            
        });
    }
    
    getClientReport(parameters: ClientReportParam): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Report/GetClientReport?source=' + JSON.stringify(parameters))
                .subscribe((response: any) => {
                if (response != null && response != undefined) 
                    this.clientReports = response.Output;
                else
                    this.clientReports = [];

                this.onClientReportChanged.next(this.clientReports);
                resolve(response);
            }, reject);
        });
    }

    getClientReportExport(parameters: ClientReportParam): Promise<any> {
        return new Promise((resolve, reject) => {
            window.open(this.serviceURL + 'Report/GetClientReportFile?sourceParam=' + JSON.stringify(parameters), "_blank");
        });
    }

    getProfileSearchReport(parameters: ProfileSearchReportParam): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Report/GetProfileSearchReport?source=' + JSON.stringify(parameters))
                .subscribe((response: any) => {
                    if (response != null && response != undefined)
                        this.profileSearchReports = response.Output;
                    else
                        this.profileSearchReports = [];

                    this.onProfileSearchReportChanged.next(this.profileSearchReports);
                    resolve(response);
                }, reject);
        });
    }

    getProfileSearchReportExport(parameters: ProfileSearchReportParam): Promise<any> {
        return new Promise((resolve, reject) => {
            window.open(this.serviceURL + 'Report/GetProfileSearchReportFile?sourceParam=' + JSON.stringify(parameters), "_blank");
        });
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

    getUserForReport(status, isAllUser: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            let userid = this.loggedUserId;

            this.http.get(this.serviceURL + 'Report/GetUsersForReport?statusId=' + status + '&isAllUser=' + isAllUser + '&loginId=' + userid)
                .subscribe((response: any) => {
                    response = JSON.parse(response);
                    resolve(response);
                }, reject);
        });
    }
}
