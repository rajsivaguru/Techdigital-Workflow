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
import { InOutTime } from './punchtime.model';

@Injectable()
export class PunchTimeService implements Resolve<any>
{
    serviceURL: String;
    headerOptions: any;
    
    searchText: string;

    onMyPunchDetailsChanged: BehaviorSubject<any> = new BehaviorSubject({});

    myPunchDetails: InOutTime[];

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
        this.headerOptions = this.loginService.getHeaders();
    }

    getMyPunchDetails(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Attendance/GetMyPunchDetails', this.headerOptions)
                .subscribe((response: any) => {
                    if (response != null && response != undefined) {
                        if (response["ResultStatus"] == "1") {
                            this.myPunchDetails = response["Output"];
                        }
                        else
                            resolve([]);
                    }
                    else {
                        this.myPunchDetails = [];
                    }

                    this.onMyPunchDetailsChanged.next(this.myPunchDetails);
                    resolve(this.myPunchDetails);
                }, (exception: any) => {
                    resolve(exception.error);
                },
                    reject);
        });
    }
}
