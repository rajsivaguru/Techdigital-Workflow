import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Notification } from './notification.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseUtils } from '../../../core/fuseUtils';


@Injectable()
export class NotificationService implements Resolve<any>
{
    mails: Notification[];
    selectedMails: Notification[];
    currentMail: Notification;
    searchText = '';

    folders: any[];
    filters: any[];
    labels: any[];
    routeParams: any;

    onMailsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedMailsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onCurrentMailChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    onFoldersChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onFiltersChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onLabelsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSearchTextChanged: BehaviorSubject<any> = new BehaviorSubject('');

    constructor(private http: HttpClient)
    {
        this.selectedMails = [];

            // 'mail-mails'                 : MailFakeDb.mails,
            // 'mail-folders'               : MailFakeDb.folders,
            // 'mail-filters'               : MailFakeDb.filters,
            // 'mail-labels'                : MailFakeDb.labels,

            
    }

    /**
     * Resolve
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {
            Promise.all([
                this.getFolders(),
                this.getFilters(),
                this.getLabels(),
                this.getMails()
            ]).then(
                () => {
                    if ( this.routeParams.mailId )
                    {
                        this.setCurrentMail(this.routeParams.mailId);
                    }
                    else
                    {
                        this.setCurrentMail(null);
                    }

                    this.onSearchTextChanged.subscribe(searchText => {
                        if ( searchText !== '' )
                        {
                            this.searchText = searchText;
                            this.getMails();
                        }
                        else
                        {
                            this.searchText = searchText;
                            this.getMails();
                        }
                    });

                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get all folders
     * @returns {Promise<any>}
     */
    getFolders(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            // this.http.get('api/mail-folders')
            //     .subscribe((response: any) => {
            //         this.folders = response;
            //         this.onFoldersChanged.next(this.folders);
            //         resolve(this.folders);
            //     }, reject);
            this.folders = MailFakeDb.folders;
            this.onFoldersChanged.next(this.folders);
            resolve(this.folders);
        });
    }

    /**
     * Get all filters
     * @returns {Promise<any>}
     */
    getFilters(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            // this.http.get('api/mail-filters')
            //     .subscribe((response: any) => {
            //         this.filters = response;
            //         this.onFiltersChanged.next(this.filters);
            //         resolve(this.filters);
            //     }, reject);

            this.filters = MailFakeDb.filters;
            this.onFiltersChanged.next(this.filters);
            resolve(this.filters);
        });
    }

    /**
     * Get all labels
     * @returns {Promise<any>}
     */
    getLabels(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            // this.http.get('api/mail-labels')
            //     .subscribe((response: any) => {
            //         this.labels = response;
            //         this.onLabelsChanged.next(this.labels);
            //         resolve(this.labels);
            //     }, reject);

              this.labels = MailFakeDb.labels;
              this.onLabelsChanged.next(this.labels);
              resolve(this.labels);

        });
    }

    /**
     * Get all mails
     * @returns {Promise<Mail[]>}
     */
    getMails(): Promise<Notification[]>
    {
        if ( this.routeParams.labelHandle )
        {
            return this.getMailsByLabel(this.routeParams.labelHandle);
        }

        if ( this.routeParams.filterHandle )
        {
            return this.getMailsByFilter(this.routeParams.filterHandle);
        }

        return this.getMailsByFolder(this.routeParams.folderHandle);
    }

    /**
     * Get mails by folder
     * @param handle
     * @returns {Promise<Mail[]>}
     */
    getMailsByFolder(handle): Promise<Notification[]>
    {
        return new Promise((resolve, reject) => {

            // this.http.get('api/mail-folders?handle=' + handle)
            //     .subscribe((folders: any) => {

            //         const folderId = folders[0].id;

            //         this.http.get('api/mail-mails?folder=' + folderId)
            //             .subscribe((mails: any) => {

            //                 this.mails = mails.map(mail => {
            //                     return new Notification(mail);
            //                 });

            //                 this.mails = FuseUtils.filterArrayByString(this.mails, this.searchText);

            //                 this.onMailsChanged.next(this.mails);

            //                 resolve(this.mails);

            //             }, reject);
            //     });

            this.mails = MailFakeDb.mails.map(mail => {
                return new Notification(mail);
            });

            this.mails = FuseUtils.filterArrayByString(this.mails, this.searchText);
            this.onMailsChanged.next(this.mails);
            resolve(this.mails);
        });
    }

    /**
     * Get mails by filter
     * @param handle
     * @returns {Promise<Mail[]>}
     */
    getMailsByFilter(handle): Promise<Notification[]>
    {
        return new Promise((resolve, reject) => {

            // this.http.get('api/mail-mails?' + handle + '=true')
            //     .subscribe((mails: any) => {

            //         this.mails = mails.map(mail => {
            //             return new Notification(mail);
            //         });

            //         this.mails = FuseUtils.filterArrayByString(this.mails, this.searchText);

            //         this.onMailsChanged.next(this.mails);

            //         resolve(this.mails);

            //     }, reject);

             this.mails = MailFakeDb.mails.map(mail => {
                return new Notification(mail);
            });

            this.mails = FuseUtils.filterArrayByString(this.mails, this.searchText);
            this.onMailsChanged.next(this.mails);
            resolve(this.mails);
        });
    }

    /**
     * Get mails by label
     * @param handle
     * @returns {Promise<Mail[]>}
     */
    getMailsByLabel(handle): Promise<Notification[]>
    {
        return new Promise((resolve, reject) => {
            // this.http.get('api/mail-labels?handle=' + handle)
            //     .subscribe((labels: any) => {

            //         const labelId = labels[0].id;

            //         this.http.get('api/mail-mails?labels=' + labelId)
            //             .subscribe((mails: any) => {

            //                 this.mails = mails.map(mail => {
            //                     return new Notification(mail);
            //                 });

            //                 this.mails = FuseUtils.filterArrayByString(this.mails, this.searchText);

            //                 this.onMailsChanged.next(this.mails);

            //                 resolve(this.mails);

            //             }, reject);
            //     });

            this.mails = MailFakeDb.mails.map(mail => {
                return new Notification(mail);
            });

            this.mails = FuseUtils.filterArrayByString(this.mails, this.searchText);
            this.onMailsChanged.next(this.mails);
            resolve(this.mails);
        });
    }

    /**
     * Toggle selected mail by id
     * @param id
     */
    toggleSelectedMail(id)
    {
        // First, check if we already have that mail as selected...
        if ( this.selectedMails.length > 0 )
        {
            for ( const mail of this.selectedMails )
            {
                // ...delete the selected mail
                if ( mail.id === id )
                {
                    const index = this.selectedMails.indexOf(mail);

                    if ( index !== -1 )
                    {
                        this.selectedMails.splice(index, 1);

                        // Trigger the next event
                        this.onSelectedMailsChanged.next(this.selectedMails);

                        // Return
                        return;
                    }
                }
            }
        }

        // If we don't have it, push as selected
        this.selectedMails.push(
            this.mails.find(mail => {
                return mail.id === id;
            })
        );

        // Trigger the next event
        this.onSelectedMailsChanged.next(this.selectedMails);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll()
    {
        if ( this.selectedMails.length > 0 )
        {
            this.deselectMails();
        }
        else
        {
            this.selectMails();
        }

    }

    selectMails(filterParameter?, filterValue?)
    {
        this.selectedMails = [];

        // If there is no filter, select all mails
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedMails = this.mails;
        }
        else
        {
            this.selectedMails.push(...
                this.mails.filter(mail => {
                    return mail[filterParameter] === filterValue;
                })
            );
        }

        // Trigger the next event
        this.onSelectedMailsChanged.next(this.selectedMails);
    }

    deselectMails()
    {
        this.selectedMails = [];

        // Trigger the next event
        this.onSelectedMailsChanged.next(this.selectedMails);
    }

    /**
     * Set current mail by id
     * @param id
     */
    setCurrentMail(id)
    {
        this.currentMail = this.mails.find(mail => {
            return mail.id === id;
        });

        this.onCurrentMailChanged.next(this.currentMail);
    }

    /**
     * Toggle label on selected mails
     * @param labelId
     */
    toggleLabelOnSelectedMails(labelId)
    {
        this.selectedMails.map(mail => {

            const index = mail.labels.indexOf(labelId);

            if ( index !== -1 )
            {
                mail.labels.splice(index, 1);
            }
            else
            {
                mail.labels.push(labelId);
            }

            this.updateMail(mail);
        });
    }

    /**
     * Set folder on selected mails
     * @param folderId
     */
    setFolderOnSelectedMails(folderId)
    {
        this.selectedMails.map(mail => {
            mail.folder = folderId;

            this.updateMail(mail);
        });

        this.deselectMails();
    }

    /**
     * Update the mail
     * @param mail
     * @returns {Promise<any>}
     */
    updateMail(mail)
    {
        return new Promise((resolve, reject) => {

            this.http.post('api/mail-mails/' + mail.id, {...mail})
                .subscribe(response => {

                    this.getMails().then(mails => {

                        if ( mails && this.currentMail )
                        {
                            this.setCurrentMail(this.currentMail.id);
                        }

                        resolve(mails);

                    }, reject);
                });
        });
    }

}
export class MailFakeDb
{
    public static mails = [
        {
            'id'            : '15459251a6d6b397565',
            'from'          : {
                'name'  : 'Alice Freeman',
                'avatar': 'assets/images/avatars/alice.jpg',
                'email' : 'alicefreeman@creapond.com'
            },
            'to'            : [
                {
                    'name' : 'me',
                    'email': 'johndoe@creapond.com'
                }
            ],
            'subject'       : 'Commits that need to be pushed lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'message'       : '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce </p>',
            'time'          : '28 Jun',
            'read'          : false,
            'starred'       : false,
            'important'     : true,
            'hasAttachments': true,
            'labels'        : [
                1
            ],
            'folder'        : 0
        },
        {
            'id'            : '1541dd1e05dfc439216',
            'from'          : {
                'name'  : 'David Butler',
                'avatar': '',
                'email' : 'davidbutler@creapond.com'
            },
            'to'            : [
                {
                    'name' : 'me',
                    'email': 'johndoe@creapond.com'
                }
            ],
            'subject'       : 'Commits that need to be pushed lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'message'       : '<p>Lorem ipsum dolor sit ametibero diam, finibus eget sapien et, tristique fermentum lorem. </p> ',
            'time'          : '7 May',
            'read'          : true,
            'starred'       : false,
            'important'     : false,
            'hasAttachments': false,
            'labels'        : [],
            'folder'        : 3
        }
    ];

    public static folders = [
        {
            'id'    : 0,
            'handle': 'inbox',
            'title' : 'Unread',
            'icon'  : 'inbox'
        },
        {
            'id'    : 1,
            'handle': 'sent',
            'title' : 'Read',
            'icon'  : 'send'
        }
    ];

    public static filters = [
        {
            'id'    : 0,
            'handle': 'starred',
            'title' : 'Starred',
            'icon'  : 'star'
        },
        {
            'id'    : 1,
            'handle': 'important',
            'title' : 'Important',
            'icon'  : 'label'
        }
    ];

    public static labels = [
        {
            'id'    : 0,
            'handle': 'note',
            'title' : 'Note',
            'color' : '#7cb342'
        },
        {
            'id'    : 1,
            'handle': 'paypal',
            'title' : 'Paypal',
            'color' : '#d84315'
        },
        {
            'id'    : 2,
            'handle': 'invoice',
            'title' : 'Invoice',
            'color' : '#607d8b'
        },
        {
            'id'    : 3,
            'handle': 'amazon',
            'title' : 'Amazon',
            'color' : '#03a9f4'
        }
    ];
}
