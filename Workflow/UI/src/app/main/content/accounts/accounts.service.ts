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
import { Consultant, InvoiceSupportingDetail, Invoice } from './accounts.model';

//let headers = new HttpHeaders();
//headers.set("Content-Type", "application/json");

@Injectable()
export class AccountsService implements Resolve<any>
{
    serviceURL: String;
    headerOptions: any;

    searchText: string;
    filterBy: string;

    onSupportingDetailsChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onConsultantsChanged: BehaviorSubject<any> = new BehaviorSubject({});    
    onInvoicesChanged: BehaviorSubject<any> = new BehaviorSubject({});

    onSearchConsultantsTextChanged: Subject<any> = new Subject();
    onSearchInvoicesTextChanged: Subject<any> = new Subject();

    supportingDetail: InvoiceSupportingDetail;
    consultants: Consultant[]; 
    storageConsultants: Consultant[]; 
    invoices: Invoice[];
    storageInvoices: Invoice[];
    
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

        this.onSearchConsultantsTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getConsultantsSearch();
        });

        this.onSearchInvoicesTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getActiveInvoicesSearch();
        });
    }
    
    getInvoiceSupportingDetails(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Invoice/GetInvoiceSupportingDetails', this.headerOptions).subscribe((response: any) => {
                if (response != null && response != undefined && response.Output.length > 0)
                    this.supportingDetail = response.Output[0];
                else
                    this.supportingDetail = new InvoiceSupportingDetail({});

                this.onSupportingDetailsChanged.next(this.supportingDetail);
                resolve(response);
            }, (exception: any) => {
                resolve(exception.error);
            },reject);
        });
    }

    getConsultants(): Promise<any> {        
        return new Promise((resolve, reject) => {
            ////this.http.get(this.serviceURL + 'Invoice/GetConsultants', { headers: this.headers }).subscribe((response: any) => {
            this.http.get(this.serviceURL + 'Invoice/GetConsultants', this.headerOptions)
                .subscribe((response: any) => {
                    if (response != null && response != undefined)
                    {
                        this.storageConsultants = response.Output;
                        this.consultants = response.Output;
                    }
                    else
                    {
                        this.storageConsultants = [];
                        this.consultants = [];
                    }   

                    this.onConsultantsChanged.next(this.consultants);
                    resolve(response);
                }, (exception: any) => {
                        resolve(exception.error);
                    },
                reject);
        });
    }

    getConsultantsSearch(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.storageConsultants != undefined && this.storageConsultants.length > 0) {
                if (this.searchText && this.searchText !== '') {
                    this.consultants = FuseUtils.filterArrayByString(this.storageConsultants, this.searchText);

                    if (this.consultants.length > 0) {
                        this.consultants = this.consultants.map(item => {
                            return new Consultant(item);
                        });
                    }
                }
                else
                    this.consultants = this.storageConsultants.map(item => {
                        return new Consultant(item);
                    });

                this.onConsultantsChanged.next(this.consultants);
                resolve(this.consultants);
            }
        });
    }

    getActiveInvoices(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Invoice/GetActiveInvoices?generateInvoice=true', this.headerOptions)
                .subscribe((response: any) => {
                    if (response != null && response != undefined)
                    {
                        this.storageInvoices = response.Output;
                        this.invoices = response.Output;
                    }
                    else
                    {
                        this.storageInvoices = [];
                        this.invoices = [];
                    }   
                    
                    this.onInvoicesChanged.next(this.invoices);
                    resolve(response);
                }, (exception: any) => {
                    resolve(exception.error);
                    },
                    reject);
        });
    }

    getActiveInvoicesSearch(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.storageInvoices != undefined && this.storageInvoices.length > 0) {
                if (this.searchText && this.searchText !== '') {
                    this.invoices = FuseUtils.filterArrayByString(this.storageInvoices, this.searchText);

                    if (this.invoices.length > 0) {
                        this.invoices = this.invoices.map(item => {
                            return new Invoice(item);
                        });
                    }
                }
                else
                    this.invoices = this.storageInvoices.map(item => {
                        return new Invoice(item);
                    });

                this.onInvoicesChanged.next(this.invoices);
                resolve(this.invoices);
            }
        });
    }

    getInvoiceDetails(invoiceid): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(this.serviceURL + 'Invoice/GetInvoiceDetail?invoiceId=' + invoiceid, this.headerOptions)
                .subscribe((response: any) => {
                    if (response != null && response != undefined)
                        resolve(response.Output); 
                }, (exception: any) => {
                    resolve(exception.error);
                },
                    reject);
        });
    }

    saveConsultant(consultant: Consultant) {
        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'Invoice/SaveConsultant', consultant, this.headerOptions)
                .subscribe((response: any) => {
                    response = response;
                    resolve(response);
                }, (exception: any) => {
                    resolve(exception.error);
                });
        });
    }

    saveInvoice(invoice: Invoice) {
        return new Promise((resolve, reject) => {
            this.http.post(this.serviceURL + 'Invoice/SaveInvoice', invoice, this.headerOptions)
                .subscribe((response: any) => {
                    response = response;
                    resolve(response);
                }, (exception: any) => {
                    resolve(exception.error);
                });
        });
    }
}
