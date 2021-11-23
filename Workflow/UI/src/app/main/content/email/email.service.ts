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
import { ComposeEmail, EmailDetails, ToEmailDetails  } from './email.model';

let headers = new HttpHeaders();
headers.set("Content-Type", "application/json");

@Injectable()
export class EmailService implements Resolve<any>
{
    onEmailDetailsChanged: BehaviorSubject<any> = new BehaviorSubject({});
    
    ////profileResult: ProfileSearchResult;
    emailDetails: EmailDetails[];
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
        this.emailDetails = [];
    }

    getLoginId() {
        return this.loggedUserId;
    }
    
    getEmailDetails(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Email/GetEmailDetails').subscribe((response: any) => {
                if (response != null && response != undefined)
                    this.emailDetails = response.Output;
                else
                    this.emailDetails = [];

                this.onEmailDetailsChanged.next(this.emailDetails);
                resolve(this.emailDetails);
            }, reject);
        });
    }
    
    /* Compose Email. */
    sendEmail(email: ComposeEmail) {
        email.userid = this.loggedUserId;

        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'Email/SendEmail', email, { headers: headers })
                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }    
}
