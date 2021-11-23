import { Injectable } from '@angular/core';

@Injectable()
export class Utilities
{
    /* Config */
    googleCX: string = '012324760724505964806:t7lzifyrqx8';
    googleCSEApiKey: string = 'AIzaSyCHT7SEp5bPMxvafWIYs_QcYgIelGgFDWo';
    googleIndexApiKey: string = 'AIzaSyCtsUht54dWu3eVj433gOY4a9AQ0bquagM'; //Workflow-Dev

    /* Google Keys
     * private clientId:string = '401457242494-d525fh2g32nvq5i7fsm6lrmf0t6b52et.apps.googleusercontent.com';  // localhost
        private clientId = 401457242494-d525fh2g32nvq5i7fsm6lrmf0t6b52et // This is also valid key which is used in the server localhost.
     * private clientId:string = '86746030753-22n6td4v43tdu9ps466t93klsegmrng8.apps.googleusercontent.com'; // live & Dev server
     * let clientId = '753784829804-d881hvgn7je19fj8pp0goe09gja7o5cp.apps.googleusercontent.com';  ////index testing
    */

    /* Roles */
    rn_superuser = 'Super User';
    rn_recruiter = 'Recruiter';
    rn_teamlead = 'Team Lead';
    rn_deliverymanager = 'Delivery Manager';
    rn_reportuser = 'Report User';
    rn_accountsadmin = 'Accounts Admin';
    rn_accountsclerk = 'Accounts Clerk';

    /* Status */
    is_atimesheet = 'Awaiting Timesheet';
    is_rvtimesheet = 'Timesheet Received/Verified';
    is_icreated = 'Invoice Created';
    is_isent = 'Invoice Sent';

    /* Communication Type in Invoices */
    ict_portal = 'Portal';
    ict_email = 'Email';
    ict_none = 'No Invoice Required';
    
    /* Employment Type in Invoices */
    iet_c2c = 'C2C';
    iet_w2 = 'W2';
    iet_1099 = '1099';

    /* CustomerVendor Type in Invoices */
    icv_customer = 'Customer';
    icv_endclient = 'End Client';
    icv_vendor = 'Vendor';
    icv_consultant = 'Consultant';

    /* All pages */
    reportSearchMissingFields: string = 'Please provide at least one field value';
    emailRequired: string = 'Email is required';
    emailInvalid: string = 'Not a valid email';
    
    /* For User Absent Dialog */
    absentDialogHeight: string = '550px';
    absentDialogWidth: string = '400px';
    absentDialogTitle: string = 'Absent Users';

    /* For Job AssignTo Dialog */
    assignToDialogHeight: string = '550px';
    assignToDialogWidth: string = '400px';
    assignToDialogTitle: string = 'Absent Users';

    /* Height to be reduced for the page. */
    accordionPanelHeight: number = 280;
    accordionPanelHeight_Client: number = 310;
    accordionPanelHeight_VQuestion: number = 340;
    nonaccordionPanelHeight: number = 270;

    /* Client screen related */
    clientDeleteConfirmTitle: string = 'Delete Client';
    clientDeleteConfirmMessage: string = 'Deleting this client will remove the job-client mapping, if any.  \n Do you want to continue?';

    /* Customer/Vendor screen related */
    customerVendorDeleteConfirmTitle: string = 'Delete Customer/Vendor';
    customerVendorDeleteConfirmMessage: string = 'Are you sure to delete this Customer/Vendor?';

    /* My Jobs screen related. */
    maxJobMessage: string = 'Maximum of 2 jobs only can be started at a time.';
    jobStartMessage: string = 'Job ({0} - {1} ) has started.';
    jobStopMessage: string = 'Job ({0} - {1} ) has stopped.';

    /* Visa screen related */
    questionDeleteConfirmTitle: string = 'Delete Visa Question';
    questionDeleteConfirmMessage: string = 'Deleting this question will remove the response action question mapping, if any.  \n Do you want to continue?';
    screeningEndConfirmTitle: string = 'End Screening Process';
    screeningEndConfirmMessage: string = 'This will terminate and save the screening process.  \n Do you want to continue?';
    screeningEndRequiredMessage: string = 'Provide reason to end screening.';
    screeningCancelConfirmTitle: string = 'Cancel Screening Process';
    screeningCancelConfirmMessage: string = 'This will clear all your changes.  \n Do you want to continue?';
    questionTypeCheckbox: string = 'Checkbox';
    questionTypeDropdown: string = 'Dropdown';
    questionTypeText: string = 'Text';
    questionTypeTextArea: string = 'Long Text';
    tabQuestion: string = 'Questions';
    tabScreening: string = 'Screening';
    questionCheckedText: string = 'Checked';
    questionUnCheckedText: string = 'UnChecked';
    questionNAText: string = 'NA';

    /* Unauthorized dialog */
    unauthorizedConfirmTitle: string = 'Not Authorized';
    unauthorizedconfirmMessage: string = 'You are not authorized to view this page.  You will be redirected to home page.';
    unauthorizedConfirmActionButtonText: string = 'Goto Home Page';
        
    OrderDialogUsers(array, order, key)
    {
        var recruiter = [], leader = [], recruiterSel = [], leaderSel = [];

        array.filter((x) => {
            if (x.roleName.toLowerCase() === this.rn_recruiter.toLocaleLowerCase())
                recruiter.push(x);
        });

        array.filter((x) => {
            if (x.roleName.toLowerCase() === this.rn_teamlead.toLocaleLowerCase())
                leader.push(x);
        });

        order.forEach(item => {
            recruiter.filter((x) => {
                if (x.id === item.id)
                    recruiterSel.push(x);
            });
        });

        order.forEach(item => {
            leader.filter((x) => {
                if (x.id === item.id)
                    leaderSel.push(x);
            });
        });

        recruiterSel.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;

            if (x < y) { return 1; }
            if (x > y) { return -1; }
            return 0;
        });

        leaderSel.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;

            if (x < y) { return 1; }
            if (x > y) { return -1; }
            return 0;
        });

        recruiter.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;

            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });

        leader.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;

            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });

        recruiterSel.forEach(sel => {
            var user = recruiter.filter(item => { return item.id == sel.id });
            var index = recruiter.indexOf(user[0]);

            recruiter.splice(index, 1);
            recruiter.splice(0, 0, user[0]);
        });

        leaderSel.forEach(sel => {
            var user = leader.filter(item => { return item.id == sel.id });
            var index = leader.indexOf(user[0]);

            leader.splice(index, 1);
            leader.splice(0, 0, user[0]);
        });

        var result = recruiter.concat(leader);
        return result;
    }

    GetPageContentHeightWithAccordion()
    {
        return window.innerHeight - this.accordionPanelHeight;
    }

    GetPageContentHeightWithAccordion_Client() {
        return window.innerHeight - this.accordionPanelHeight_Client;
    }

    GetPageContentHeightWithAccordion_VQuestion() {
        return window.innerHeight - this.accordionPanelHeight_VQuestion;
    }

    GetPageContentHeightNonAccordion() {
        return window.innerHeight - this.nonaccordionPanelHeight;
    }

    ValidateEmail(email)
    {
        if (email.trim().length > 0)
        {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        return false;
    }

    GetCurrentDateTime()
    {
        var datetime, now = new Date();
        datetime = now.getFullYear() + '-';
        datetime += now.getMonth() + 1 + '-';
        datetime += now.getDate() + ' ';
        datetime += now.getHours() + ':';
        datetime += now.getMinutes() + ':';
        datetime += now.getSeconds() + '.';
        datetime += now.getMilliseconds();
        return datetime;
    }

    GetCST(date: string) {
        if (date != null && date != undefined) {
            var fDate = new Date(date);

            if (date.indexOf('T') > 0)
                fDate.setHours(fDate.getHours() + 5);

            return fDate;
        }
        else
        {
            return "";
        }
    }

    GetCST12HourFormat(date: string) {

        if (date != null && date != undefined) {
            var fDate = new Date(date);

            if (date.indexOf('T') > 0)
                fDate.setHours(fDate.getHours() + 5);
            
            var hour = fDate.getHours();

            if (hour > 12) {
                fDate.setHours(hour - 12);
            }
            else if (hour == 0) {
                fDate.setHours(12);
            }

            return fDate;
        }
        else
        {
            return '';
        }
    }

    Get12HourFormat(date: string, time: string, intimeampm: string)
    {
        var hour = parseInt(time.substr(0, 2));
        var minwithcolon = time.substr(2, 3);
        var datetime = date + ' ' + time;

            if (hour > 12) {
                datetime = date + ' ' + (hour - 12) + minwithcolon;
            }
            else if (hour == 0) {
                datetime = date + ' 12' + minwithcolon;
        }
        return datetime + ' ' + intimeampm;
    }

    IsNumber(e) {
        var charcode = (e.which) ? e.which : e.keycode;
        if (!(charcode >= 48 && charcode <= 57)) {
            return false;
        }
        return true;
    }

}