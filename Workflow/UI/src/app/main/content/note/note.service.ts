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

@Injectable()
export class NoteService implements Resolve<any>
{
    onFilterChanged: Subject<any> = new Subject();    
    action: any;
    searchText: string;
    filterBy: string;
    serviceURL: String;
    loggedUserId: string;

    constructor(private http: HttpClient, private configSer: FuseConfigService, public loginService: LoginService) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.searchText = "";
        this.loggedUserId = this.loginService.getLoginId();
        ////this.profileResult = new ProfileSearchResult({});
    }

    getLoginId() {
        return this.loggedUserId;
    }

    getQuestionList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Visa/GetNoteQuestions?loginid=' + this.loggedUserId)
                .subscribe((response: any) => {
                    if (response != null && response != undefined) {
                        if (response["ResultStatus"] == "1") {
                            ////this.newJobs = response["Output"];
                            
                            ////if (this.newJobs.length > 0) {
                            ////    this.newJobs = this.newJobs.map(contact => {
                            ////        return new JobsList(contact);
                            ////    });
                            ////}

                            ////this.newJobsChanged.next(this.newJobs);
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
    
}
