"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var users_model_1 = require("../content/users/users.model");
var FuseToolbarComponent = /** @class */ (function () {
    function FuseToolbarComponent(router, fuseConfig, localStorageService, rouer, loginService) {
        var _this = this;
        this.router = router;
        this.fuseConfig = fuseConfig;
        this.localStorageService = localStorageService;
        this.rouer = rouer;
        this.loginService = loginService;
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];
        this.languages = [
            {
                'id': 'en',
                'title': 'English',
                'flag': 'us'
            },
            {
                'id': 'tr',
                'title': 'Turkish',
                'flag': 'tr'
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
        this.fuseConfig.onSettingsChanged.subscribe(function (settings) {
            _this.horizontalNav = settings.layout.navigation === 'top';
        });
    }
    FuseToolbarComponent.prototype.ngOnInit = function () {
        if (this.loginService.loggedUser == undefined)
            this.loginUser = new users_model_1.Contact({});
        else
            this.loginUser = this.loginService.loggedUser;
        //console.log(this.loginService.loggedUser)
    };
    FuseToolbarComponent.prototype.search = function (value) {
        // Do your search here...
        //console.log(value);
    };
    FuseToolbarComponent.prototype.setLanguage = function (lang) {
        // Set the selected language for toolbar
        this.selectedLanguage = lang;
        // Use the selected language for translations
        //this.translate.use(lang.id);
    };
    FuseToolbarComponent.prototype.submitLogout = function () {
        //console.log('logout');
        if (this.localStorageService.get("login_id") != null && this.localStorageService.get("login_id") != undefined)
            this.localStorageService.remove("login_id");
        if (this.loginService.googleUser != null && this.loginService.googleUser.isSignedIn())
            this.loginService.googleUser.disconnect();
        //this.rouer.navigateByUrl('/login');
    };
    FuseToolbarComponent = __decorate([
        core_1.Component({
            selector: 'fuse-toolbar',
            templateUrl: './toolbar.component.html',
            styleUrls: ['./toolbar.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], FuseToolbarComponent);
    return FuseToolbarComponent;
}());
exports.FuseToolbarComponent = FuseToolbarComponent;
