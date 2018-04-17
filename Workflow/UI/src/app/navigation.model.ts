export class NavigationModel
{
    public model: any[];

    constructor()
    {
        this.model = [
             {
                        'id'   : 'newjobs',
                        'title': 'Jobs',
                        'type' : 'item',
                        'icon' : 'open_in_new',
                        'url'  : '/jobsload'
            },
            // {
            //             'id'   : 'jobs',
            //             'title': 'Jobs Assigned',
            //             'type' : 'item',
            //             'icon' : 'work',
            //             'url'  : '/jobs'
            // },
            {
                        'id'   : 'users',
                        'title': 'Users',
                        'type' : 'item',
                        'icon' : 'people',
                        'url'  : '/users'
            },
            // {
            //             'id'   : 'assignusers',
            //             'title': 'Assign User',
            //             'type' : 'item',
            //             'icon' : 'person',
            //             'url'  : '/usersform'
            // },
            {
                        'id'   : 'recruiters',
                        'title': 'My Jobs',
                        'type' : 'item',
                        'icon' : 'airline_seat_recline_normal',
                        'url'  : '/myjobs'
            },
            {
                        'id'      : 'reports',
                        'title'   : 'Reports',
                        'type'    : 'collapse',
                        'icon'    : 'receipt',
                        'children': [
                            {
                                'id'   : 'project',
                                'title': 'Jobs',
                                'type' : 'item',
                                'url'  : '/jobreport'
                            },
                            {
                                'id'   : 'project',
                                'title': 'Users',
                                'type' : 'item',
                                'url'  : '/userreport'
                            }
                        ]
            }
            
        ];
    }
}
