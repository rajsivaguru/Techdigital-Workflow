import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NavigationStart, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';

@Injectable()
export class FuseConfigService
{
    settings: any;
    defaultSettings: any;
    onSettingsChanged: BehaviorSubject<any>;

    public isLoginAuthenticated = false;

    public ServiceURL = "";
    public GoogleClientID = ""; 
    public JobTimerDuration : number
    public AlertTimerDuration: number
    public helpDeskURL: string;
    public staffDirectoryURL: string;
    
    /**
     * @param router
     * @param platform
     */
    constructor(
        private router: Router,
        public platform: Platform
    )
    {
        //////if (location.port == "" && location.origin.indexOf('Workflow-Dev') >= 0 )
        //////{
        //////    //this.ServiceURL = location.origin + '/StaffingService/api/'  // local
        //////    this.ServiceURL = location.origin + '/WorkflowApi/api/'  // live
        //////}
        //////else
        //////{
        //////    this.ServiceURL = "https://www.apps.techdigitalcorp.com/WorkflowApi-Dev/api/"
        //////    //this.ServiceURL = 'http://demo.csfinance.in/StaffingService/api/';
        //////    //this.ServiceURL = location.origin + '0/api/'  // local
        //////}
        
        if (location.port.trim().length > 0 || (location.port == '' && location.pathname.toLowerCase().indexOf('workflow-dev') >= 0)) {
            ////this.ServiceURL = 'https://www.apps.techdigitalcorp.com/WorkflowApi-Dev/api/'; /* for Dev URL */
            ////this.ServiceURL = location.origin + '0/api/'; /* for localhost */

            if (location.port.trim().length > 0)
                this.ServiceURL = location.origin + '0/api/'; /* for localhost */
            else
            {
                if (location.href.toLowerCase().indexOf('www') >= 0)
                    this.ServiceURL = 'https://www.apps.techdigitalcorp.com/WorkflowApi-Dev/api/'; /* for Dev URL */
                else
                    this.ServiceURL = 'https://apps.techdigitalcorp.com/WorkflowApi-Dev/api/'; /* for Dev URL */
            }
        }
        else {
            if (location.href.toLowerCase().indexOf('www') >= 0)
                this.ServiceURL = 'https://www.apps.techdigitalcorp.com/WorkflowApi/api/'; /* for Dev URL */
            else
                this.ServiceURL = 'https://apps.techdigitalcorp.com/WorkflowApi/api/';
        }
        
        this.isLoginAuthenticated = false;
        this.defaultSettings = {
            showProgress : false,
            layout          : {
                navigation      : 'left', // 'right', 'left', 'top', 'none'
                navigationFolded: false, // true, false
                toolbar         : 'above', // 'above', 'below', 'none'
                footer          : 'none', // 'above', 'below', 'none'
                mode            : 'boxed' // 'boxed', 'fullwidth'
            },
            colorClasses    : {
                toolbar: 'mat-white-500-bg',
                navbar : 'mat-light-blue-900-bg',
                footer : 'mat-light-blue-900-bg'
            },
            customScrollbars: true,
            routerAnimation : 'fadeIn' // fadeIn, slideUp, slideDown, slideRight, slideLeft
        };

        /**
         * Disable Custom Scrollbars if Browser is Mobile
         */
        if ( this.platform.ANDROID || this.platform.IOS )
        {
            this.defaultSettings.customScrollbars = false;
        }

        // Set the settings from the default settings
        this.settings = Object.assign({}, this.defaultSettings);

        // Reload the default settings on every navigation start
        router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart )
                {
                    this.setSettings({layout: this.defaultSettings.layout});
                }
            }
        );

        // Create the behavior subject
        this.onSettingsChanged = new BehaviorSubject(this.settings);
    }

    /**
     * Sets settings
     * @param settings
     */
    setSettings(settings)
    {
        // Set the settings from the given object
        this.settings = Object.assign({}, this.settings, settings);

        // Trigger the event
        this.onSettingsChanged.next(this.settings);
    }
}
