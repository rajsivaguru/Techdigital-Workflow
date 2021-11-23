"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavigationModel = /** @class */ (function () {
    function NavigationModel() {
        this.model = [
            { 'id': 'newjobs', 'title': 'Jobs', 'type': 'item', 'icon': 'work', 'url': '/jobs' },
            { 'id': 'users', 'title': 'Users', 'type': 'item', 'icon': 'people', 'url': '/users' },
            { 'id': 'jobsclient', 'title': 'Clients', 'type': 'item', 'icon': 'airline_seat_recline_normal', 'url': '/clients' },
            { 'id': 'recruiters', 'title': 'My Jobs', 'type': 'item', 'icon': 'work', 'url': '/myjobs' },
            { 'id': 'priorityjob', 'title': 'Priority Jobs', 'type': 'item', 'icon': 'format_list_numbered', 'url': '/priorityjobs' },
            { 'id': 'punching', 'title': 'Punch In/Out', 'type': 'item', 'icon': 'access_time', 'url': '/punchtime' },
            { 'id': 'customervendor', 'title': 'Customer/Vendors', 'type': 'item', 'icon': 'airline_seat_recline_normal', 'url': '/customervendors' },
            {
                'id': 'accounts', 'title': 'Accounts', 'type': 'collapse', 'icon': 'local_atm',
                'children': [
                    { 'id': 'consultants', 'title': 'Consultants', 'type': 'item', 'icon': 'people', 'url': '/consultants' },
                    { 'id': 'invoices', 'title': 'Timesheets/Invoices', 'type': 'item', 'icon': 'monetization_on', 'url': '/invoices' }
                ]
            },
            {
                'id': 'reports', 'title': 'Reports', 'type': 'collapse', 'icon': 'assessment',
                'children': [
                    { 'id': 'jobreport', 'title': 'Job Report', 'type': 'item', 'icon': 'work', 'url': '/jobreport' },
                    { 'id': 'userreport', 'title': 'User Report', 'type': 'item', 'icon': 'people', 'url': '/userreport' },
                    { 'id': 'clientreport', 'title': 'Client Report', 'type': 'item', 'icon': 'airline_seat_recline_normal', 'url': '/clientreport' },
                    { 'id': 'profilesearchreport', 'title': 'Profile Search Report', 'type': 'item', 'icon': 'search', 'url': '/profilesearchreport' },
                    { 'id': 'punchreport', 'title': 'Punch In/Out Report', 'type': 'item', 'icon': 'access_time', 'url': '/punchreport' }
                ]
            },
            ////{
            ////    'id': 'accountreports', 'title': 'Accounts Reports', 'type': 'collapse', 'icon': 'local_atm',
            ////    'children': [
            ////        { 'id': 'invoicereport', 'title': 'Invoice', 'type': 'item', 'icon': 'monetization_on', 'url': '/invoicereport' }
            ////    ]
            ////},
            {
                'id': 'tools', 'title': 'Tools', 'type': 'collapse', 'icon': 'settings',
                'children': [
                    { 'id': 'profilesearch', 'title': 'Profile Search', 'type': 'item', 'icon': 'search', 'url': '/profilesearch' },
                    { 'id': 'note', 'title': 'Notes', 'type': 'item', 'icon': 'assignment', 'url': '/notes' },
                    { 'id': 'composeemail', 'title': 'Compose Email', 'type': 'item', 'icon': 'mail', 'url': '/composeemail' }
                ]
            },
            {
                'id': 'admintools', 'title': 'Admin Tools', 'type': 'collapse', 'icon': 'settings',
                'children': [
                    { 'id': 'question', 'title': 'Screening', 'type': 'item', 'icon': 'assignment', 'url': '/visaquestion' }
                ]
            }
        ];
    }
    return NavigationModel;
}());
exports.NavigationModel = NavigationModel;
