import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { FuseUtils } from '../../../core/fuseUtils';
import { FuseConfigService } from '../../../core/services/config.service';
import { Contact, Role } from './users.model';
import { LoginService } from '../login/login.service';

////const httpOptions = {
////    headers: new HttpHeaders({
////        //'Content-Type': 'application/x-www-form-urlencoded'//'application/json'
////        'Content-Type': 'application/json'
////    })
////};
let headers = new HttpHeaders();
headers.set("Content-Type", "application/json");

@Injectable()
export class UsersService implements Resolve<any>
{
    onContactsChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();

    action : any;
    editContacts: Contact;
    roles : Role[];
    contacts: Contact[];
    user: any;
    selectedContacts: string[] = [];
    searchText: string = "";
    filterBy: string;
    serviceURL : String;
    
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
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getContacts(-1)
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getContacts(-1);
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getContacts(-1);
                    });

                    resolve();

                },
                reject
            );
        });
    }

    getAssignedUser(status): Promise<any>
    {
        return new Promise((resolve, reject) => {
                let userid  = '0';
                if (this.loginService.loggedUser != undefined)
                    userid = this.loginService.loggedUser.userid;
                
                this.http.get(this.serviceURL+'User/GetUsersForAssignment?statusId=' + status + '&loginId='+userid)
                    .subscribe((response: any) => {
                        ////response = JSON.parse(response);
                        resolve(response.Output);
                    }, reject);
            }
        );
    }

    getAbsentUser(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                let userid  = '0';
                if (this.loginService.loggedUser != undefined)
                    userid = this.loginService.loggedUser.userid;
                ////this.serviceURL = "https://www.apps.techdigitalcorp.com/WorkflowApi-Dev/api/"
                this.http.get(this.serviceURL+'User/GetAbsentUsers?loginId='+userid)
                    .subscribe((response: any) => {
                        response = JSON.parse(response);
                        resolve(response);
                    }, reject);
            }
        );
    }

    saveAbsentUser(userIds): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let userid  = '0';

            if (this.loginService.loggedUser != undefined)
                userid = this.loginService.loggedUser.userid;

            this.http.get(this.serviceURL + 'User/SaveAbsentUsers?userIds=' + userIds + '&loginId=' + userid)
                .subscribe((response: any) => {
                    response = JSON.parse(response);
                    resolve(response);
                }, reject);
        });
    }

    /* With post - working */
    ////saveAbsentUser(userIds): Promise<any> {
    ////    return new Promise((resolve, reject) => {
    ////        let userid = '0';
    ////        var data = { name: 'name', name2: 'name2' };

    ////        if (this.loginService.loggedUser != undefined)
    ////            userid = this.loginService.loggedUser.userid;

    ////        /* Making api call twice. */
    ////        this.http.post(this.serviceURL + 'User/SaveAbsentUsersO', data, { headers: headers })
    ////            .subscribe((response: any) => {
    ////                response = JSON.parse(response);
    ////                resolve(response);
    ////            }, reject);
    ////    });
    ////}

    getContacts(status): Promise<any>
    {
        return new Promise((resolve, reject) => {

                 let userid  = '0';
                if (this.loginService.loggedUser != undefined)
                    userid = this.loginService.loggedUser.userid;
                
                this.http.get(this.serviceURL+'User/GetAllUsers?statusId=' + status + '&loginId='+userid)
                    .subscribe((response: any) => {

                         if ( response != null && response != undefined)
                        {
                        response = JSON.parse(response);
                        //console.log('fetchin user..');

                        this.contacts = response;

                        if ( this.filterBy === 'starred' )
                        {
                            this.contacts = this.contacts.filter(_contact => {
                                return this.user.starred.includes(_contact.userid);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.contacts = this.contacts.filter(_contact => {
                                return this.user.frequentContacts.includes(_contact.userid);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
                        }

                        if(this.contacts.length > 0)
                        {
                            this.contacts = this.contacts.map(contact => {
                                return new Contact(contact);
                            });

                        }
                        this.onContactsChanged.next(this.contacts);
                        resolve(this.contacts);


                        }
                        else
                        {
                            resolve([]);
                        }
                    }, reject);
              
              

                        // this.contacts = this.contactsResult;
                        // //console.log( this.contactsResult);
                        
                        // this.contacts = this.contacts.map(contact => {
                        //     return new Contact(contact);
                        // });

                        // this.onContactsChanged.next(this.contacts);
                        // resolve(this.contacts);
            }
        );
    }
    
    getRoleData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get(this.serviceURL+'TDW/BindRoles?name_startsWith='+this.searchText)
                    .subscribe((response: any) => {
                        response = JSON.parse(response);
                        this.roles = response;
                        //console.log('get roles');
                        //this.onUserDataChanged.next(this.user);
                        resolve(this.roles);
                    }, reject);
            }
        );
    }
    
    selectContacts(filterParameter?, filterValue?)
    {
        this.selectedContacts = [];

        // If there is no filter, select all todos
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedContacts = [];
            this.contacts.map(contact => {
                this.selectedContacts.push(contact.userid);
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

    updateContact(contact)
    {
        let userid  = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;


        return new Promise((resolve, reject) => {

            //this.http.post('api/contacts-contacts/' + contact.userid, {...contact})
            this.http.get(this.serviceURL+'TDW/SaveUser?sUserModel=' + JSON.stringify(contact) + '&loginid='+userid)
                .subscribe( (response : any )=> {
                    response = JSON.parse(response);
                    //this.getContacts();
                    resolve(response);
                });
        });
    }    
}
