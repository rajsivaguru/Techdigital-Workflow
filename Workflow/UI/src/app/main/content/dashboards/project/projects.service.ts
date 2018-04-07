import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProjectsDashboardService implements Resolve<any>
{
    // projects: any[];
    // widgets: any[];

    projects = [
        {
            'name': 'TechDigital Workflow'
        },
        {
            'name': 'Withinpixels'
        }
    ];

    widgets = {
        'widget1'      : {
            'ranges'      : {
                'DY' : 'Yesterday',
                'DT' : 'Today',
                'DTM': 'Tomorrow'
            },
            'currentRange': 'DT',
            'data'        : {
                'label': 'DUE TASKS',
                'count': {
                    'DY' : 21,
                    'DT' : 25,
                    'DTM': 19
                },
                'extra': {
                    'label': 'Completed',
                    'count': {
                        'DY' : 6,
                        'DT' : 7,
                        'DTM': '-'
                    }

                }
            },
            'detail'      : 'You can show some detailed information about this widget in here.'
        },
        'widget2'      : {
            'title' : 'Overdue',
            'data'  : {
                'label': 'TASKS',
                'count': 4,
                'extra': {
                    'label': 'Yesterday\'s overdue',
                    'count': 2
                }
            },
            'detail': 'You can show some detailed information about this widget in here.'
        },
        'widget3'      : {
            'title' : 'Issues',
            'data'  : {
                'label': 'OPEN',
                'count': 32,
                'extra': {
                    'label': 'Closed today',
                    'count': 0
                }
            },
            'detail': 'You can show some detailed information about this widget in here.'
        },
        'widget4'      : {
            'title' : 'Features',
            'data'  : {
                'label': 'PROPOSALS',
                'count': 42,
                'extra': {
                    'label': 'Implemented',
                    'count': 8
                }
            },
            'detail': 'You can show some detailed information about this widget in here.'
        },
        'widget11'     : {
            'title': 'Team Members',
            'table': {
                'columns': ['avatar', 'name', 'position', 'office', 'email', 'phone'],
                'rows'   : [
                    {
                        avatar  : 'assets/images/avatars/james.jpg',
                        name    : 'Jack Gilbert',
                        position: 'Design Manager',
                        office  : 'Johor Bahru',
                        email   : 'jgilbert48@mail.com',
                        phone   : '+16 298 032 7774'
                    },
                    {
                        avatar  : 'assets/images/avatars/katherine.jpg',
                        name    : 'Kathy Anderson',
                        position: 'Recruiting Manager',
                        office  : 'Solţānābād',
                        email   : 'kanderson49@mail.com.br',
                        phone   : '+23 572 311 1136'
                    },
                    {
                        avatar  : 'assets/images/avatars/andrew.jpg',
                        name    : 'Mark Turner',
                        position: 'Recruiting Manager',
                        office  : 'Neftegorsk',
                        email   : 'mturner4a@mail.com',
                        phone   : '+01 139 803 9263'
                    },
                    {
                        avatar  : 'assets/images/avatars/jane.jpg',
                        name    : 'Kathryn Martinez',
                        position: 'Director of Sales',
                        office  : 'Palekastro',
                        email   : 'kmartinez4b@mail.com',
                        phone   : '+25 467 022 5393'
                    },
                    {
                        avatar  : 'assets/images/avatars/alice.jpg',
                        name    : 'Annie Gonzales',
                        position: 'Actuary',
                        office  : 'Candon',
                        email   : 'agonzales4c@mail.edu',
                        phone   : '+99 891 619 7138'
                    },
                    {
                        avatar  : 'assets/images/avatars/vincent.jpg',
                        name    : 'Howard King',
                        position: 'Human Resources',
                        office  : 'Bergen op Zoom',
                        email   : 'hking4d@mail.gov',
                        phone   : '+46 984 348 1409'
                    },
                    {
                        avatar  : 'assets/images/avatars/joyce.jpg',
                        name    : 'Elizabeth Dixon',
                        position: 'Electrical Engineer',
                        office  : 'Písečná',
                        email   : 'edixon4e@mail.gov',
                        phone   : '+33 332 067 9063'
                    },
                    {
                        avatar  : 'assets/images/avatars/danielle.jpg',
                        name    : 'Dorothy Morris',
                        position: 'Office Assistant',
                        office  : 'Magsaysay',
                        email   : 'dmorris4f@mail.com',
                        phone   : '+05 490 958 6120'
                    },
                    {
                        avatar  : 'assets/images/avatars/carl.jpg',
                        name    : 'Mark Gonzales',
                        position: 'Quality Control',
                        office  : 'Matsue-shi',
                        email   : 'mgonzales4g@mail.com',
                        phone   : '+03 168 394 9935'
                    },
                    {
                        avatar  : 'assets/images/avatars/profile.jpg',
                        name    : 'Catherine Rogers',
                        position: 'Programmer Analyst',
                        office  : 'Kangar',
                        email   : 'crogers4h@mail.com',
                        phone   : '+86 235 407 5373'
                    },
                    {
                        avatar  : 'assets/images/avatars/garry.jpg',
                        name    : 'Ruth Grant',
                        position: 'Community Outreach',
                        office  : 'Beaune',
                        email   : 'rgrant4i@mail.pl',
                        phone   : '+36 288 083 8460'
                    },
                    {
                        avatar  : 'assets/images/avatars/james.jpg',
                        name    : 'Phyllis Gutierrez',
                        position: 'Administrative Assistant',
                        office  : 'Shlissel’burg',
                        email   : 'pgutierrez4j@mail.net',
                        phone   : '+52 749 861 9304'
                    }, {
                        avatar  : 'assets/images/avatars/alice.jpg',
                        name    : 'Lillian Morris',
                        position: 'Media Planner',
                        office  : 'Berlin',
                        email   : 'lmorris4k@mail.de',
                        phone   : '+59 695 110 3856'
                    }, {
                        avatar  : 'assets/images/avatars/vincent.jpg',
                        name    : 'Jeremy Anderson',
                        position: 'Systems Engineer',
                        office  : 'Lũng Hồ',
                        email   : 'janderson4l@mail.uk',
                        phone   : '+40 384 115 1448'
                    },
                    {
                        avatar  : 'assets/images/avatars/carl.jpg',
                        name    : 'Arthur Lawrence',
                        position: 'Nurse Practicioner',
                        office  : 'Sarkanjut',
                        email   : 'alawrence4m@mail.com',
                        phone   : '+36 631 599 7867'
                    }, {
                        avatar  : 'assets/images/avatars/andrew.jpg',
                        name    : 'David Simmons',
                        position: 'Social Worker',
                        office  : 'Ushumun',
                        email   : 'dsimmons4n@mail.com',
                        phone   : '+01 189 681 4417'
                    }, {
                        avatar  : 'assets/images/avatars/danielle.jpg',
                        name    : 'Daniel Johnston',
                        position: 'Help Desk',
                        office  : 'São Carlos',
                        email   : 'djohnston4o@mail.gov',
                        phone   : '+60 028 943 7919'
                    },

                    {
                        avatar  : 'assets/images/avatars/joyce.jpg',
                        name    : 'Ann King',
                        position: 'Internal Auditor',
                        office  : 'Liren',
                        email   : 'aking4p@mail.com',
                        phone   : '+91 103 932 6545'
                    },
                    {
                        avatar  : 'assets/images/avatars/james.jpg',
                        name    : 'Phillip Franklin',
                        position: 'VP Accounting',
                        office  : 'Soba',
                        email   : 'pfranklin4q@mail.com',
                        phone   : '+25 820 986 7626'
                    },
                    {
                        avatar  : 'assets/images/avatars/garry.jpg',
                        name    : 'Gary Gonzalez',
                        position: 'Speech Pathologist',
                        office  : 'Gangkou',
                        email   : 'ggonzalez4r@mail.cc',
                        phone   : '+10 862 046 7916'
                    }
                ]
            }
        },
        'weatherWidget': {
            'locations'      : {
                'NewYork': {
                    'name'           : 'New York',
                    'icon'           : 'icon-rainy2',
                    'temp'           : {
                        'C': '22',
                        'F': '72'
                    },
                    'windSpeed'      : {
                        'KMH': 12,
                        'MPH': 7.5
                    },
                    'windDirection'  : 'NW',
                    'rainProbability': '98%',
                    'next3Days'      : [
                        {
                            'name': 'Sunday',
                            'icon': 'icon-rainy',
                            'temp': {
                                'C': '21',
                                'F': '70'
                            }
                        },
                        {
                            'name': 'Sunday',
                            'icon': 'icon-cloudy',
                            'temp': {
                                'C': '19',
                                'F': '66'
                            }
                        },
                        {
                            'name': 'Tuesday',
                            'icon': 'icon-windy3',
                            'temp': {
                                'C': '24',
                                'F': '75'
                            }
                        }
                    ]
                }
            },
            'currentLocation': 'NewYork',
            'tempUnit'       : 'C',
            'speedUnit'      : 'KMH'
        }
    };
    constructor(
        private http: HttpClient
    )
    {

        
    }

    /**
     * Resolve
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProjects(),
                this.getWidgets()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getProjects(): Promise<any>
    {
        // return new Promise((resolve, reject) => {
        //     this.http.get('api/projects-dashboard-projects')
        //         .subscribe((response: any) => {
        //             this.projects = response;
        //             resolve(response);
        //         }, reject);
        // });

        return new Promise((resolve, reject) => {
            resolve(this.projects);
        });

          
    }

    getWidgets(): Promise<any>
    {
        // return new Promise((resolve, reject) => {
        //     this.http.get('api/projects-dashboard-widgets')
        //         .subscribe((response: any) => {
        //             this.widgets = response;
        //             resolve(response);
        //         }, reject);
        // });

         return new Promise((resolve, reject) => {
            resolve(this.widgets);
        });

    }
}
