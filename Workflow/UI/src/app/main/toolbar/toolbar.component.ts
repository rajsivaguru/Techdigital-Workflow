import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseConfigService } from '../../core/services/config.service';
import { LoginService } from '../content/login/login.service';
import { CommonService } from '../content/common/common.service';
import { ProgressBarConfig } from '../../app.model';
import { Contact } from '../content/users/users.model';
import { LocalStorageService } from 'angular-2-local-storage'
import { SnackBarService } from '../content/dialog/snackbar.service'

import { Notification } from './toolbar.model';

@Component({
    selector   : 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls  : ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class FuseToolbarComponent implements OnInit
{
    userStatusOptions: any[];
    languages: any;
    selectedLanguage: any;
    //showLoadingBar: boolean;
    horizontalNav: boolean;
    loginUser: Contact;
    isValidUser: boolean;
    notificationCount: string;
    isnotificationCountVisible: boolean;

    progressbar: ProgressBarConfig;
    notifications: Notification[];
    notificationsSmall: Notification[];

    constructor(
        private router: Router,
        private fuseConfig: FuseConfigService,
        private localStorageService: LocalStorageService,
        private rouer : Router,
        private loginService: LoginService,
        private commonService: CommonService,
        private snackComp: SnackBarService,
    )
    {   
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                'id'   : 'en',
                'title': 'English',
                'flag' : 'us'
            },
            {
                'id'   : 'tr',
                'title': 'Turkish',
                'flag' : 'tr'
            }
        ];

        this.selectedLanguage = this.languages[0];

        // router.events.subscribe(
        //     (event) => {
        //         if ( event instanceof NavigationStart )
        //         {
        //             this.showLoadingBar = true;
        //         }
        //         if ( event instanceof NavigationEnd )
        //         {
        //             this.showLoadingBar = false;
        //         }
        //     });

        this.fuseConfig.onSettingsChanged.subscribe((settings) => {
            this.horizontalNav = settings.layout.navigation === 'top';
        });
    }

    ngOnInit()
    {
        this.notifications = [];
        this.progressbar = new ProgressBarConfig({});
        if( this.loginService.loggedUser == undefined)
            this.loginUser = new Contact({});
        else
            this.loginUser = this.loginService.loggedUser;

        if (this.loginUser.userid != undefined && this.loginUser.userid != '0')
        {
            this.isValidUser = true;
            this.getMyNotifications();
        }
    }

    search(value)
    {
        // Do your search here...
        //console.log(value);
    }

    setLanguage(lang)
    {
        // Set the selected language for toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        //this.translate.use(lang.id);
    }

    submitLogout()
    {
        if( this.localStorageService.get("login_id") != null && this.localStorageService.get("login_id") != undefined )
            this.localStorageService.remove("login_id")

        if(this.loginService.googleUser != null && this.loginService.googleUser.isSignedIn())
            this.loginService.googleUser.disconnect();

        localStorage.setItem('notificationCount', '');
        localStorage.setItem('notification', '');
    }

    helpdesk()
    {
        if (this.fuseConfig.helpDeskURL != undefined || this.fuseConfig.helpDeskURL != "")
            window.open(this.fuseConfig.helpDeskURL, 'blank');
    }

    staffDirectory()
    {
        if (this.fuseConfig.staffDirectoryURL != undefined || this.fuseConfig.staffDirectoryURL != "")
            window.open(this.fuseConfig.staffDirectoryURL);
    }

    private getMyNotifications()
    {
        this.notifications = [];
        localStorage.setItem('notificationCount', '');
        localStorage.setItem('notification', '');
        this.progressbar.showProgress();

        this.commonService.getMyNotifications().then(response => {
            this.progressbar.hideProgress();
            if (response) {
                if (response['ResultStatus'] == 1)
                {
                    response.Output.map(notification => {
                        this.notifications.push(notification);
                    });

                    if (this.notifications.length > 4)
                        this.notifications = this.notifications.slice(0, 4);

                    if (this.notifications.length == 0)
                        this.isnotificationCountVisible = false;
                    else
                        this.isnotificationCountVisible = true;
                    
                    var unreadNotification = this.notifications.filter(x => x.isread == false).length;

                    if (unreadNotification > 0)
                        this.notificationCount = unreadNotification.toString();
                    else
                        this.notificationCount = '';

                    localStorage.setItem('notificationCount', this.notificationCount);
                }                
                
                this.notify();
            }
        });
    }

    private notify()
    {
        setInterval(() => {
            this.notificationCount = localStorage.getItem('notificationCount');
            this.isnotificationCountVisible = true;

            if (this.notificationCount == null || this.notificationCount == undefined || this.notificationCount == '') {
                this.notificationCount = '';
                this.isnotificationCountVisible = false;
            }

            var notification = localStorage.getItem('notification');
            
            if (notification != null && notification != undefined && notification.length > 0)
            {
                var notifications = notification.split('~');

                notifications.map(notification => {
                    var item = JSON.parse(notification);
                    this.snackComp.showSimpleNotificationSnackBar(item.messagetext);
                    this.notifications.unshift(item);
                });
                
                localStorage.setItem('notification', '');                

                if (this.notifications.length > 4)
                    this.notifications = this.notifications.slice(0, 4);

                ////this.notifications = this.notifications.map(notification => {
                ////    return new Notification(notification);
                ////});
            }
        }, 10000);
    }
}
