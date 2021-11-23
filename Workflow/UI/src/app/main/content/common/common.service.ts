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
import { Status, CustomerVendor } from './common.model';
import { Notification } from '../../toolbar/toolbar.model';

@Injectable()
export class CommonService implements Resolve<any>
{
    serviceURL: String;
    headerOptions: any;

    searchText: string;

    onStatusesChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onCustomerTypesChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onCustomerVendorChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onNotificationChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSearchCustomerVendorTextChanged: Subject<any> = new Subject();
    statuses: Status[];
    customerTypes: any[];
    customersvendors: CustomerVendor[]; 
    storageCustomersVendors: CustomerVendor[];
    myNotifications: Notification[];
    
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
        
        if (this.customersvendors == null || this.customersvendors == undefined)
            this.customersvendors = new Array<CustomerVendor>();
        if (this.customerTypes == null || this.customerTypes == undefined)
            this.customerTypes = new Array<any>();

        this.onSearchCustomerVendorTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getCustomersVendorsSearch();
        });
    }
    
    getStatuses(statustype: string): Promise<any> {
        this.headerOptions = this.loginService.getHeaders();
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Common/GetStatuses?type=' + statustype, this.headerOptions)
                .subscribe((response: any) => {
                    if (response != null && response != undefined && response.Output.length > 0)
                        this.statuses = response.Output;
                    else
                        this.statuses = [];

                    this.onStatusesChanged.next(this.statuses);
                    resolve(response);
                }, (exception: any) => {
                    resolve(exception.error);
                },
                    reject);
        });
    }

    getCustomerTypes(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Common/GetCustomerTypes', this.headerOptions)
                .subscribe((response: any) => {
                    if (response != null && response != undefined) {
                        this.customerTypes = response.Output;
                    }
                    else {
                        this.customerTypes = [];
                    }

                    this.onCustomerTypesChanged.next(this.customerTypes);
                    resolve(response);
                }, (exception: any) => {
                    resolve(exception.error);
                },
                reject);
        });
    }

    getCustomersVendors(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Common/GetCustomersVendors', this.headerOptions)
                .subscribe((response: any) => {
                    if (response != null && response != undefined) {
                        this.storageCustomersVendors = response.Output;
                        this.customersvendors = response.Output;
                    }
                    else {
                        this.storageCustomersVendors = [];
                        this.customersvendors = [];
                    }

                    this.onCustomerVendorChanged.next(this.customersvendors);
                    resolve(response);
                }, (exception: any) => {
                    resolve(exception.error);
                },
                reject);
        });
    }

    getCustomersVendorsSearch(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.storageCustomersVendors != undefined && this.storageCustomersVendors.length > 0) {
                if (this.searchText && this.searchText !== '') {
                    this.customersvendors = FuseUtils.filterArrayByString(this.storageCustomersVendors, this.searchText);

                    if (this.customersvendors.length > 0) {
                        this.customersvendors = this.customersvendors.map(item => {
                            return new CustomerVendor(item);
                        });
                    }
                }
                else
                    this.customersvendors = this.storageCustomersVendors.map(item => {
                        return new CustomerVendor(item);
                    });

                this.onCustomerVendorChanged.next(this.customersvendors);
                resolve(this.customersvendors);
            }
        });
    }

    saveCustomer(customer: CustomerVendor) {
        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'Common/SaveCustomerVendor', customer, this.headerOptions)
                .subscribe((response: any) => {
                    response = response;
                    resolve(response);
                }, (exception: any) => {
                    resolve(exception.error);
                });
        });
    }

    deleteCustomer(id) {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Common/DeleteCustomerVendor?id='+id, this.headerOptions)
                .subscribe((response: any) => {
                    response = response;
                    resolve(response);
                }, (exception: any) => {
                    resolve(exception.error);
                });
        });
    }


    getMyNotifications(): Promise<any>
    {
        if (this.headerOptions == undefined && this.loginService.loggedUser != undefined)
            this.headerOptions = this.loginService.getHeaders();

        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Common/GetMyNotifications', this.headerOptions)
                .subscribe((response: any) => {
                    if (response != null && response != undefined && response.Output.length > 0)
                    {
                        this.myNotifications = response;
                    }
                    else {
                        this.myNotifications = [];
                    }

                    this.onNotificationChanged.next(this.myNotifications);
                    resolve(this.myNotifications);
                }, (exception: any) => {
                    resolve(exception.error);
                }, reject);
        });
    }

}