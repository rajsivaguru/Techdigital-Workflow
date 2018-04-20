import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FuseConfigService } from '../../core/services/config.service';
import { LoginService } from '../content/login/login.service';
import { Contact } from '../content/users/users.model';
import { LocalStorageService } from 'angular-2-local-storage'

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
    public loginUser : Contact;

    constructor(
        private router: Router,
        private fuseConfig: FuseConfigService,
        private localStorageService: LocalStorageService,
        private rouer : Router,
        private loginService : LoginService
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
        if( this.loginService.loggedUser == undefined)
            this.loginUser = new Contact({});
        else
            this.loginUser = this.loginService.loggedUser;

            //console.log(this.loginService.loggedUser)
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
        //console.log('logout');

        if( this.localStorageService.get("login_id") != null && this.localStorageService.get("login_id") != undefined )
            this.localStorageService.remove("login_id")

        if(this.loginService.googleUser != null && this.loginService.googleUser.isSignedIn())
            this.loginService.googleUser.disconnect();
            
        //this.rouer.navigateByUrl('/login');
    }
}
