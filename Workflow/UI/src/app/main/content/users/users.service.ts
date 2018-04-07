import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Contact, Role } from './users.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { FuseConfigService } from '../../../core/services/config.service';
import { Login2Service } from '../login/login-2.service';

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
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getContacts(-1),
                this.getUserData(),
                this.getRoleData()
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

    getContacts(status): Promise<any>
    {
        return new Promise((resolve, reject) => {

                 let userid  = '0';
                if (this.loginService.loggedUser != undefined)
                    userid = this.loginService.loggedUser.userid;
                
                this.http.get(this.serviceURL+'BindUsers?status=' + status + '&loginid='+userid)
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

    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                // this.http.get('api/contacts-user/5725a6802d10e277a0f35724')
                //     .subscribe((response: any) => {
                //         this.user = response;
                //         this.onUserDataChanged.next(this.user);
                //         resolve(this.user);
                //     }, reject);
                this.onUserDataChanged.next(this.user);
                resolve(this.user);
            }
        );
    }

    getRoleData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get(this.serviceURL+'BindRoles?name_startsWith='+this.searchText)
                    .subscribe((response: any) => {
                        response = JSON.parse(response);
                        this.roles = response;
                        //console.log(this.roles);
                        //this.onUserDataChanged.next(this.user);
                        resolve(this.roles);
                    }, reject);
            }
        );
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
            this.http.get(this.serviceURL+'SaveUser?sUserModel=' + JSON.stringify(contact) + '&loginid='+userid)
                .subscribe( (response : any )=> {
                    response = JSON.parse(response);
                    //this.getContacts();
                    resolve(response);
                });
        });
    }

    updateUserData(userData)
    {
        return new Promise((resolve, reject) => {
            //this.http.post('api/contacts-user/' + this.user.userid, {...userData})
            this.http.get(this.serviceURL+'SaveUser?sUserModel=' + JSON.stringify(userData))
                .subscribe(response => {
                    this.getUserData();
                    this.getContacts(-1);
                    resolve(response);
                });
        });
    }

    deselectContacts()
    {
        this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    deleteContact(contact)
    {
        const contactIndex = this.contacts.indexOf(contact);
        this.contacts.splice(contactIndex, 1);
        this.onContactsChanged.next(this.contacts);
    }

    deleteSelectedContacts()
    {
        for ( const contactId of this.selectedContacts )
        {
            const contact = this.contacts.find(_contact => {
                return _contact.userid === contactId;
            });
            const contactIndex = this.contacts.indexOf(contact);
            this.contacts.splice(contactIndex, 1);
        }
        this.onContactsChanged.next(this.contacts);
        this.deselectContacts();
    }

}