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
import { ProfileSearchCriteria, ProfileSearchResult, Profile } from './search.model';

let headers = new HttpHeaders();
headers.set("Content-Type", "application/json");

@Injectable()
export class SearchService implements Resolve<any>
{
    onSearchProfileChanged: BehaviorSubject<any> = new BehaviorSubject({});
    
    profileResult: ProfileSearchResult;
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
        this.profileResult = new ProfileSearchResult({});
    }

    getLoginId() {
        return this.loggedUserId;
    }

    searchProfile(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(query)
                .subscribe((response: any) => {
                    if (response != null && response != undefined) {
                        //if (response.context != null && response.context != undefined)
                        //    applicationname = response.context.title;

                        if (response.searchInformation != null && response.searchInformation != undefined)
                            this.profileResult.resultCount = parseInt(response.searchInformation.totalResults);
                        
                        if (response.items != null && response.items != undefined)
                            this.profileResult.profiles = response.items;
                        else
                            this.profileResult.profiles = [];

                        if (this.profileResult.profiles.length > 0) {
                            this.profileResult.profiles = this.profileResult.profiles.map(profile => {
                                return new Profile(profile);
                            });
                        }

                        this.onSearchProfileChanged.next(this.profileResult);
                        resolve(this.profileResult);
                    }
                    else {
                        resolve([]);
                    }
                }, reject);
        });
    }

    /* Save profile search. */
    saveProfileSearch(search: ProfileSearchCriteria) {
        search.userid = this.loggedUserId;

        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'ProfileSearch/SaveProfileSearch', search, { headers: headers })
                .subscribe((response: any) => {
                    response = JSON.parse(response);
                    resolve(response);
                });
        });
    }


    indexing(token: string): Promise<any> {
        debugger;
        ////let headers = new HttpHeaders();
        ////headers.set("Content-Type", "application/json");
        ////headers.set("Access-Control-Allow-Origin", "*");
        ////headers.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD,OPTIONS");
        ////headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-Csrf-Token,Authorization");
        ////headers.set('Authorization', 'BEARER ' + token);

        let headers = new HttpHeaders();
        headers = headers.set("Content-Type", "application/json; charset=utf-8");
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD,OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-Csrf-Token,Authorization");
        headers.append('Authorization', 'BEARER ' + token);

        return new Promise((resolve, reject) => {
            this.http.post('https://content-indexing.googleapis.com/v3/urlNotifications:publish?key=AIzaSyCHT7SEp5bPMxvafWIYs_QcYgIelGgFDWo&alt=json',
                //////this.http.post('https://content-indexing.googleapis.com/v3/urlNotifications:publish?key=AIzaSyCXd3M-Cb0KvyBMKTNS23nfaoiez6l51Go&alt=json',
                {
                    "url": "https://www.apps.techdigitalcorp.com/Workflow-Dev/gjobs/qa.html",
                    "type": "URL_UPDATED"//,
                    //"scope": "https://www.googleapis.com/auth/indexing"
                }, { headers: headers }
            )
                .subscribe((response: any) => {
                    debugger;

                }, reject);
        });
    }
}
