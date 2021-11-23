import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { FuseUtils } from '../../../core/fuseUtils';
import { FuseConfigService } from '../../../core/services/config.service';
import { LoginService } from '../login/login.service';
import { Jobs, JobStatus, JobStatusHistory, JobsList, JobAssignment, Client, PriorityJob } from './jobs.model';

let headers = new HttpHeaders();
headers.set("Content-Type", "application/json");

@Injectable()
export class JobsService implements Resolve<any>
{
    headerOptions: any;

    onContactsChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    newJobsChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSelectedNewJobsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    
    onClientChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSelectedClientChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    onSearchTextChanged: Subject<any> = new Subject();
    onSearchNewJobsTextChanged: Subject<any> = new Subject();
    onSearchClientTextChanged: Subject<any> = new Subject();

    onFilterChanged: Subject<any> = new Subject();

    emptyJobList : JobsList[];
    newJobs: JobsList[];
    /* this will be used for filtering the jobs. */
    storageJobs: JobsList[];
    jobs : Jobs[];
    clients: Client[];
    prioritizedJobs: PriorityJob[];
    user: any;
    jobStatus : JobStatus[];
    jobHistory : JobStatusHistory[];
    selectedContacts: string[] = [];
    selectedNewJobs: string[] = [];
    
    editJobs : Jobs;
    action : any;
    searchText: string;
    filterBy: string;
    serviceURL: String;
    loggedUserId: string;

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
        this.loggedUserId = this.loginService.getLoginId();
        this.headerOptions = this.loginService.getHeaders();
        
        if (state.url == "/jobs")
        {
            return new Promise((resolve, reject) => {
                Promise.all([
                    //this.getPriority(),
                    this.getNewJobs(false)
                ]).then(
                    ([files]) => {

                        this.onSearchNewJobsTextChanged.subscribe(searchText => {
                            this.searchText = searchText;
                            this.getNewJobs(false);
                        });

                        this.onFilterChanged.subscribe(filter => {
                            this.filterBy = filter;
                            this.getNewJobs(false);
                        });

                        resolve();
                    }, reject );
            });
        }
        else if(state.url == "/clients")
        {
            return new Promise((resolve, reject) => {
                Promise.all([
                    this.getClients()
                ]).then(
                    ([files]) => {
                        this.onSearchClientTextChanged.subscribe(searchText => {
                            this.searchText = searchText;
                            this.getClients();
                        });

                        this.onFilterChanged.subscribe(filter => {
                            this.filterBy = filter;
                            this.getClients();
                        });

                        resolve();
                    }, reject);
            });
        }
    }
    
    getLoginId() {
        return this.loggedUserId;
    }

    /* Jobs */

    getNewJobs(isRefresh): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if (this.storageJobs != undefined && this.storageJobs.length > 0 && !isRefresh)
            {
                if (this.searchText && this.searchText !== '') {
                    this.newJobs = FuseUtils.filterArrayByString(this.storageJobs, this.searchText);

                    if (this.newJobs.length > 0) {
                        this.newJobs = this.newJobs.map(contact => {
                            return new JobsList(contact);
                        });
                    }
                }
                else
                    this.newJobs = this.storageJobs.map(job => {
                        return new JobsList(job);
                    });
                
                this.newJobsChanged.next(this.newJobs);
                resolve(this.newJobs);
            } 
            else
            this.http.get(this.serviceURL + 'Job/GetJobList?loginid=' + this.loggedUserId)
                .subscribe((response: any) => {
                    if (response != null && response != undefined) {
                        if (response["ResultStatus"] == "1") {
                            this.newJobs = response["Output"];
                            this.storageJobs = response["Output"];

                            if (this.searchText && this.searchText !== '') {
                                this.newJobs = FuseUtils.filterArrayByString(this.newJobs, this.searchText);
                            }

                            if (this.newJobs.length > 0) {
                                this.newJobs = this.newJobs.map(contact => {
                                    return new JobsList(contact);
                                });
                            }

                            this.newJobsChanged.next(this.newJobs);
                            resolve(this.newJobs);
                        }
                        else 
                            resolve([]);
                    }
                    else {
                        resolve([]);
                    }

                }, reject);
        });
    }

    getJobListForDD(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Job/GetJobListForDD?loginid=' + this.loggedUserId)
                .subscribe((response: any) => {
                    if (response != null && response != undefined) {
                        if (response["ResultStatus"] == "1") {
                            resolve(response["Output"]);
                        }
                        else
                            resolve([]);
                    }
                    else {
                        resolve([]);
                    }
                }, reject);
        });
    }

    synchJobs() {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Job/SynchJobsXML')
                .subscribe((response: any) => {
                    response = JSON.parse(response);
                    resolve(response);
                });
        });
    }

    /* Save single job. */
    saveJobAssignment(jobAssignment: JobAssignment) {
        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'Job/SaveJobAssignment', jobAssignment, { headers: headers })
                .subscribe((response: any) => {
                    this.getNewJobs(true).then(result => {
                        resolve(response);
                    });
                });
        });
    }

    /* Save multiple jobs. */
    saveJobsAssignment(jobAssignments: JobAssignment[]) {
        return new Promise((resolve, reject) => {
            ////this.http.get(this.serviceURL + 'Job/SaveJobAssignments?source=' + JSON.stringify(jobAssignments) + '&loginId=' + this.loginService.loggedUser.userid)
            this.http.post(this.serviceURL + 'Job/SaveJobsAssignment', jobAssignments, { headers: headers })
                .subscribe((response: any) => {
                    this.getNewJobs(true).then(result => {
                        resolve(response);
                    });
                });
        });
    }

    /* Notify My Interest on Job */
    saveInterestedJob(job) {
        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'Job/SaveInterestedJob', job, this.headerOptions)
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }


    getClients(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Client/GetClients', this.headerOptions)
                .subscribe((response: any) => {
                    if (response != null && response != undefined) {
                        //response = JSON.parse(response);
                        this.clients = response.Output;

                        if (this.searchText && this.searchText !== '') {
                            this.clients = FuseUtils.filterArrayByString(this.clients, this.searchText);
                        }

                        this.onClientChanged.next(this.clients);
                        resolve(this.clients);
                    }
                    else {
                        resolve([]);
                    }
                }, (exception: any) => {
                    resolve(exception.error);
                },
                reject);
        });
    }

    saveClient(client : Client)
    {
        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'Client/SaveClient', client, this.headerOptions)
                .subscribe( (response : any )=> {
                    response = JSON.parse(response);
                    this.getClients();
                    resolve(response);
                });
        });
    }

    deleteJobClient(client : Client)
    {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Client/DeleteClient?clientId=' + client.id, this.headerOptions)
                .subscribe( (response : any )=> {
                    response = JSON.parse(response);
                    this.getClients();
                    resolve(response);
                });
        });
    }

    getPriority(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get(this.serviceURL+'TDW/BindPriority')
                    .subscribe((response: any) => {
                        response = JSON.parse(response);
                        resolve(response);
                    }, reject);
            }
        );
    }

    getPrioritizedJobList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Job/GetPriorityJobs', this.headerOptions)
                .subscribe((response: any) => {
                    if (response != null && response != undefined) {
                        if (response["ResultStatus"] == "1") {
                            this.prioritizedJobs = response["Output"];

                            if (this.prioritizedJobs.length > 0) {
                                this.prioritizedJobs = this.prioritizedJobs.map(job => {
                                    return new PriorityJob(job);
                                });
                            }
                            else
                                resolve([]);
                        }
                        else
                            resolve([]);
                        
                        resolve(this.prioritizedJobs);
                    }
                    else {
                        resolve([]);
                    }
                }, reject);
        });
    }

    savePriority(jobIds: string)
    {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Job/SavePriorityJob?jobIds=' + jobIds, this.headerOptions)
                .subscribe((response: any) => {                    
                    resolve(response);
                });
        });
    }

    /* Not Used;  Need to check with service. */

    /*
    getJobs(): Promise<any> {
        let userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'TDW/BindJobs?loginid=' + userid)
                .subscribe((response: any) => {
                    if (response != null && response != undefined) {
                        response = JSON.parse(response);

                        this.jobs = response;

                        if (this.filterBy === 'starred') {
                            this.jobs = this.jobs.filter(_contact => {
                                return this.user.starred.includes(_contact.jobassignmentid);
                            });
                        }

                        if (this.filterBy === 'frequent') {
                            this.jobs = this.jobs.filter(_contact => {
                                return this.user.frequentjobs.includes(_contact.jobassignmentid);
                            });
                        }

                        if (this.searchText && this.searchText !== '') {
                            this.jobs = FuseUtils.filterArrayByString(this.jobs, this.searchText);
                        }

                        if (this.jobs.length > 0) {
                            this.jobs = this.jobs.map(contact => {
                                return new Jobs(contact);
                            });
                        }

                        this.onContactsChanged.next(this.jobs);
                        resolve(this.jobs);
                    }
                    else {
                        resolve([]);
                    }
                }, reject);
        }
        );
    }

    updateJob(job) {
        let userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'TDW/SaveJob?sJobModel=' + JSON.stringify(job) + '&loginid=' + userid)
                .subscribe((response: any) => {
                    response = JSON.parse(response);
                    this.getJobs();
                    resolve(response);
                });
        });
    }
    
    updateUserData(userData) {
        return new Promise((resolve, reject) => {
            this.http.post('api/contacts-user/' + this.user.id, { ...userData })
                .subscribe(response => {
                    //this.getPriority();
                    this.getJobs();
                    resolve(response);
                });
        });
    }
    */
    updateJobStatus(jaid, statusid, comment) {
        let userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'TDW/UpdateJobStatus?jobassignmentid=' + jaid + '&statusid=' + statusid + '&comment=' + comment + '&userid=' + userid)
                .subscribe((response: any) => {
                    response = JSON.parse(response);
                    //this.getJobs();
                    resolve(response);
                });
        });
    }

    getJobStatus(jobassignmentid): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'TDW/BindJobStatus?jobassignmentid=' + jobassignmentid)
                .subscribe((response: any) => {
                    response = JSON.parse(response);
                    this.jobStatus = response;
                    resolve(this.jobStatus);
                }, reject);
        }
        );
    }

    getJobStatusHistory(jobassignmentid): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'TDW/BindJobStatusHistory?jobassignmentid=' + jobassignmentid)
                .subscribe((response: any) => {
                    response = JSON.parse(response);
                    this.jobHistory = response;
                    resolve(this.jobHistory);
                }, reject);
        }
        );
    }

    toggleSelectedNewJob(id) {
        // First, check if we already have that todo as selected...
        if (this.selectedNewJobs.length > 0) {
            const index = this.selectedNewJobs.indexOf(id);

            if (index !== -1) {
                this.selectedNewJobs.splice(index, 1);

                // Trigger the next event
                this.onSelectedNewJobsChanged.next(this.selectedNewJobs);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedNewJobs.push(id);

        // Trigger the next event
        this.onSelectedNewJobsChanged.next(this.selectedNewJobs);
    }

    /**
     * Toggle selected contact by id
     * @param id
     */
    toggleSelectedContact(id) {
        // First, check if we already have that todo as selected...
        if (this.selectedContacts.length > 0) {
            const index = this.selectedContacts.indexOf(id);

            if (index !== -1) {
                this.selectedContacts.splice(index, 1);

                // Trigger the next event
                this.onSelectedContactsChanged.next(this.selectedContacts);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedContacts.push(id);

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    toggleSelectAllNewJob() {
        if (this.selectedNewJobs.length > 0) {
            this.deselectNewJobs();
        }
        else {
            this.selectNewJobs();
        }
    }

    /**
     * Toggle select all
     */
    toggleSelectAll() {
        if (this.selectedContacts.length > 0) {
            this.deselectContacts();
        }
        else {
            this.selectContacts();
        }
    }

    selectNewJobs(filterParameter?, filterValue?) {
        this.selectedNewJobs = [];

        // If there is no filter, select all todos
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedNewJobs = [];
            this.newJobs.map(contact => {
                this.selectedNewJobs.push(contact.jobid);
            });
        }
        else {
            /* this.selectedContacts.push(...
                 this.contacts.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }

        // Trigger the next event
        this.onSelectedNewJobsChanged.next(this.selectedContacts);
    }

    selectContacts(filterParameter?, filterValue?) {
        this.selectedContacts = [];

        // If there is no filter, select all todos
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedContacts = [];
            this.jobs.map(contact => {
                this.selectedContacts.push(contact.jobassignmentid);
            });
        }
        else {
            /* this.selectedContacts.push(...
                 this.contacts.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    deselectNewJobs() {
        this.selectedNewJobs = [];

        // Trigger the next event
        this.onSelectedNewJobsChanged.next(this.selectedNewJobs);
    }

    deselectContacts() {
        this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    deleteContact(contact) {
        const contactIndex = this.jobs.indexOf(contact);
        this.jobs.splice(contactIndex, 1);
        this.onContactsChanged.next(this.jobs);
    }

    deleteSelectedNewJobs() {
        for (const contactId of this.selectedNewJobs) {
            const contact = this.newJobs.find(_contact => {
                return _contact.jobid === contactId;
            });
            const contactIndex = this.newJobs.indexOf(contact);
            this.newJobs.splice(contactIndex, 1);
        }
        this.newJobsChanged.next(this.jobs);
        this.deselectNewJobs();
    }

    deleteSelectedContacts() {
        for (const contactId of this.selectedContacts) {
            const contact = this.jobs.find(_contact => {
                return _contact.jobassignmentid === contactId;
            });
            const contactIndex = this.jobs.indexOf(contact);
            this.jobs.splice(contactIndex, 1);
        }
        this.onContactsChanged.next(this.jobs);
        this.deselectContacts();
    }

    saveJobUser(jobAssign: JobAssignment) {
        jobAssign.loginid = '0';
        if (this.loginService.loggedUser != undefined)
            jobAssign.loginid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            //this.http.get(this.serviceURL+'TDW/SaveJobUser?userid=' + users +'&jobid='+ jobid +'&priorityid='+ priorityid +'&clientname='+ clientname  + '&loginid='+ userid)
            //this.http.get(this.serviceURL+'TDW/SaveJobUser?objJobAssignParam=' + JSON.stringify(jobAssign))
            this.http.get(this.serviceURL + 'Job/AssignJobUser?source=' + JSON.stringify(jobAssign))
                .subscribe((response: any) => {
                    response = JSON.parse(response);
                    this.getNewJobs(true);
                    resolve(response);
                });
        });
    }

    searchJob = (keyword: any): Observable<any[]> => {
        try {
            // if (keyword) {
            // return this.http.get(this.serviceURL+'SearchJob?keyword=' + keyword)
            //     .map(res => {
            //     let json = res.json();
            //     return JSON.parse(json);
            //     })
            // } else 
            // {
            //     return Observable.of([]);
            // }
        }
        catch (ex) {
            //console.log(ex)
            return Observable.of([]);
        }
    }

    searchUser(keyword): any {
        //console.log('call service'+keyword+this.serviceURL+'SearchUser?keyword=' + keyword);
        this.http.get(this.serviceURL + 'TDW/SearchUser?keyword=' + keyword)
            .subscribe((response: any) => {
                //response = JSON.parse(response);
                //console.log('service');


                //console.log(JSON.parse(response));
                return (JSON.parse(response));
            });
    }

}
