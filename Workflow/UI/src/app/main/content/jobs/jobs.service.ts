import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Jobs,JobStatus, JobStatusHistory, JobsList } from './jobs.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { FuseConfigService } from '../../../core/services/config.service';
import { Login2Service } from '../login/login-2.service';

@Injectable()
export class JobsService implements Resolve<any>
{
    onContactsChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    newJobsChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSelectedNewJobsChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    onSearchTextChanged: Subject<any> = new Subject();
    onSearchNewJobsTextChanged: Subject<any> = new Subject();

    onFilterChanged: Subject<any> = new Subject();

    emptyJobList : JobsList[];
    newJobs : JobsList[];
    jobs : Jobs[];
    user: any;
    jobStatus : JobStatus[];
    jobHistory : JobStatusHistory[];
    selectedContacts: string[] = [];

    selectedNewJobs: string[] = [];



    editJobs : Jobs;
    action : any;

    searchText: string;
    filterBy: string;

    serviceURL : String;


    constructor(private http: HttpClient, private configSer : FuseConfigService, public loginService : Login2Service)
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
        
            if(state.url == "/jobs")
            {
                return new Promise((resolve, reject) => {
                    //console.log(state)
                    Promise.all([
                        this.getJobs()
                        //this.getPriority()
                    ]).then(
                        ([files]) => {

                            this.onSearchTextChanged.subscribe(searchText => {
                                this.searchText = searchText;
                                this.getJobs();
                            });

                            this.onFilterChanged.subscribe(filter => {
                                this.filterBy = filter;
                                this.getJobs();
                            });

                            resolve();

                        },
                        reject
                    );
                });
            }
            else  if(state.url == "/jobsload")
            {
                return new Promise((resolve, reject) => {
                    //console.log(state)
                    Promise.all([
                        this.getNewJobs()
                    ]).then(
                        ([files]) => {

                            this.onSearchNewJobsTextChanged.subscribe(searchText => {
                                this.searchText = searchText;
                                this.getNewJobs();
                            });

                            this.onFilterChanged.subscribe(filter => {
                                this.filterBy = filter;
                                this.getNewJobs();
                            });

                            resolve();

                        },
                        reject
                    );
                });
            }
    }

getNewJobs(): Promise<any>
    {
        //if(this.action != 'edit')
        {
             let userid  = '0';
                if (this.loginService.loggedUser != undefined)
                    userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
               this.http.get(this.serviceURL+'GetJobList?loginid='+userid)
                    .subscribe((response: any) => {

                        if ( response != null && response != undefined)
                        {
                        response = JSON.parse(response);
                        //console.log('joblist fetching..');
                        //console.log(response)
                        

                        this.newJobs = response;
                        
                        //console.log(this.newJobs)

                        // if ( this.filterBy === 'starred' )
                        // {
                        //     this.newJobs = this.newJobs.filter(_contact => {
                        //         return this.user.starred.includes(_contact.jobid);
                        //     });
                        // }

                        // if ( this.filterBy === 'frequent' )
                        // {
                        //     this.newJobs = this.newJobs.filter(_contact => {
                        //         return this.user.frequentjobs.includes(_contact.jobid);
                        //     });
                        // }
                        //console.log(this.searchText)
                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.newJobs = FuseUtils.filterArrayByString(this.newJobs, this.searchText);
                            //console.log(this.newJobs)
                        }

                        if (this.newJobs.length > 0)
                        {
                            this.newJobs = this.newJobs.map(contact => {
                                return new JobsList(contact);
                            });
                        }
                        this.newJobsChanged.next(this.newJobs);
                        resolve(this.newJobs);
                       


                        }
                        else
                        {
                            resolve([]);
                        }
                    
                    }, reject);
            }
        );
        }
    }
    getJobs(): Promise<any>
    {
        let userid  = '0';
                if (this.loginService.loggedUser != undefined)
                    userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
               this.http.get(this.serviceURL+'BindJobs?loginid='+userid)
                    .subscribe((response: any) => {
                        if ( response != null && response != undefined)
                        {
                        response = JSON.parse(response);
                        //console.log('fetching jobs...');
                        //console.log(response)

                        this.jobs = response;

                        if ( this.filterBy === 'starred' )
                        {
                            this.jobs = this.jobs.filter(_contact => {
                                return this.user.starred.includes(_contact.jobassignmentid);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.jobs = this.jobs.filter(_contact => {
                                return this.user.frequentjobs.includes(_contact.jobassignmentid);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.jobs = FuseUtils.filterArrayByString(this.jobs, this.searchText);
                        }

                         if (this.jobs.length > 0)
                        {
                            this.jobs = this.jobs.map(contact => {
                                return new Jobs(contact);
                            });

                        }
                        this.onContactsChanged.next(this.jobs);
                        resolve(this.jobs);
                        

                        }
                        else
                        {
                            resolve([]);
                        }

                    
                    }, reject);
            }
        );
    }

    getPriority(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get(this.serviceURL+'BindPriority')
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
        catch(ex)
        {
            //console.log(ex)
            return Observable.of([]);
        }

        
    }
    searchUser (keyword) : any
    {
        //console.log('call service'+keyword+this.serviceURL+'SearchUser?keyword=' + keyword);
            this.http.get(this.serviceURL+'SearchUser?keyword=' + keyword)
                .subscribe((response : any ) => {
                    //response = JSON.parse(response);
                    //console.log('service');
                    
                 
                    //console.log(JSON.parse(response));
                    return (JSON.parse(response));
                });
    }

toggleSelectedNewJob(id)
    {
        // First, check if we already have that todo as selected...
        if ( this.selectedNewJobs.length > 0 )
        {
            const index = this.selectedNewJobs.indexOf(id);

            if ( index !== -1 )
            {
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
    toggleSelectedContact(id)
    {
        // First, check if we already have that todo as selected...
        if ( this.selectedContacts.length > 0 )
        {
            const index = this.selectedContacts.indexOf(id);

            if ( index !== -1 )
            {
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

    toggleSelectAllNewJob()
    {
        if ( this.selectedNewJobs.length > 0 )
        {
            this.deselectNewJobs();
        }
        else
        {
            this.selectNewJobs();
        }
    }

    /**
     * Toggle select all
     */
    toggleSelectAll()
    {
        if ( this.selectedContacts.length > 0 )
        {
            this.deselectContacts();
        }
        else
        {
            this.selectContacts();
        }
    }

    selectNewJobs(filterParameter?, filterValue?)
    {
        this.selectedNewJobs = [];

        // If there is no filter, select all todos
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedNewJobs = [];
            this.newJobs.map(contact => {
                this.selectedNewJobs.push(contact.jobid);
            });
        }
        else
        {
            /* this.selectedContacts.push(...
                 this.contacts.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }

        // Trigger the next event
        this.onSelectedNewJobsChanged.next(this.selectedContacts);
    }
    selectContacts(filterParameter?, filterValue?)
    {
        this.selectedContacts = [];

        // If there is no filter, select all todos
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedContacts = [];
            this.jobs.map(contact => {
                this.selectedContacts.push(contact.jobassignmentid);
            });
        }
        else
        {
            /* this.selectedContacts.push(...
                 this.contacts.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    updateJob(job)
    {
        let userid  = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL+'SaveJob?sJobModel=' + JSON.stringify(job)+'&loginid='+ userid)
                .subscribe( (response : any )=> {
                    response = JSON.parse(response);
                    this.getJobs();
                    resolve(response);
                });
        });
    }

    synchJobs()
    {
        let userid  = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL+'SynchJobs')
                .subscribe( (response : any )=> {
                    response = JSON.parse(response);
                    //this.getJobs();
                    resolve(response);
                });
        });
    }

    saveJobUser(users, jobid, priorityid)
    {
        let userid  = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL+'SaveJobUser?userid=' + users +'&jobid='+ jobid +'&priorityid='+ priorityid  + '&loginid='+ userid)
                .subscribe( (response : any )=> {
                    response = JSON.parse(response);
                    this.getNewJobs();
                    resolve(response);
                });
        });
    }

    getJobStatus(jobassignmentid): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get(this.serviceURL+'BindJobStatus?jobassignmentid=' +jobassignmentid)
                    .subscribe((response: any) => {
                        response = JSON.parse(response);
                       // console.log(response);
                        this.jobStatus = response;
                        resolve(this.jobStatus);
                    }, reject);
            }
        );
    }

    getJobStatusHistory(jobassignmentid): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get(this.serviceURL+'BindJobStatusHistory?jobassignmentid=' +jobassignmentid)
                    .subscribe((response: any) => {
                        response = JSON.parse(response);
                        this.jobHistory = response;
                        //console.log(this.jobHistory);
                        resolve(this.jobHistory);
                    }, reject);
            }
        );
    }
    updateJobStatus(jaid, statusid, comment)
    {
        let userid  = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL+'UpdateJobStatus?jobassignmentid=' + jaid +'&statusid='+ statusid + '&comment='+ comment+ '&userid='+ userid)
                .subscribe( (response : any )=> {
                    response = JSON.parse(response);
                    //this.getJobs();
                    resolve(response);
                });
        });
    }

    updateUserData(userData)
    {
        return new Promise((resolve, reject) => {
            this.http.post('api/contacts-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    //this.getPriority();
                    this.getJobs();
                    resolve(response);
                });
        });
    }

    deselectNewJobs()
    {
        this.selectedNewJobs = [];

        // Trigger the next event
        this.onSelectedNewJobsChanged.next(this.selectedNewJobs);
    }

    deselectContacts()
    {
        this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    deleteContact(contact)
    {
        const contactIndex = this.jobs.indexOf(contact);
        this.jobs.splice(contactIndex, 1);
        this.onContactsChanged.next(this.jobs);
    }

    deleteSelectedNewJobs()
    {
        for ( const contactId of this.selectedNewJobs )
        {
            const contact = this.newJobs.find(_contact => {
                return _contact.jobid === contactId;
            });
            const contactIndex = this.newJobs.indexOf(contact);
            this.newJobs.splice(contactIndex, 1);
        }
        this.newJobsChanged.next(this.jobs);
        this.deselectNewJobs();
    }
    deleteSelectedContacts()
    {
        for ( const contactId of this.selectedContacts )
        {
            const contact = this.jobs.find(_contact => {
                return _contact.jobassignmentid === contactId;
            });
            const contactIndex = this.jobs.indexOf(contact);
            this.jobs.splice(contactIndex, 1);
        }
        this.onContactsChanged.next(this.jobs);
        this.deselectContacts();
    }

}
