"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Utilities = /** @class */ (function () {
    function Utilities() {
        /* Config */
        this.googleCX = '012324760724505964806:t7lzifyrqx8';
        this.googleCSEApiKey = 'AIzaSyCHT7SEp5bPMxvafWIYs_QcYgIelGgFDWo';
        this.googleIndexApiKey = 'AIzaSyCtsUht54dWu3eVj433gOY4a9AQ0bquagM'; //Workflow-Dev
        /* Google Keys
         * private clientId:string = '401457242494-d525fh2g32nvq5i7fsm6lrmf0t6b52et.apps.googleusercontent.com';  // localhost
            private clientId = 401457242494-d525fh2g32nvq5i7fsm6lrmf0t6b52et // This is also valid key which is used in the server localhost.
         * private clientId:string = '86746030753-22n6td4v43tdu9ps466t93klsegmrng8.apps.googleusercontent.com'; // live & Dev server
         * let clientId = '753784829804-d881hvgn7je19fj8pp0goe09gja7o5cp.apps.googleusercontent.com';  ////index testing
        */
        /* Roles */
        this.rn_superuser = 'Super User';
        this.rn_recruiter = 'Recruiter';
        this.rn_teamlead = 'Team Lead';
        this.rn_deliverymanager = 'Delivery Manager';
        this.rn_reportuser = 'Report User';
        this.rn_accountsadmin = 'Accounts Admin';
        this.rn_accountsclerk = 'Accounts Clerk';
        /* Status */
        this.is_atimesheet = 'Awaiting Timesheet';
        this.is_rvtimesheet = 'Timesheet Received/Verified';
        this.is_icreated = 'Invoice Created';
        this.is_isent = 'Invoice Sent';
        /* Communication Type in Invoices */
        this.ict_portal = 'Portal';
        this.ict_email = 'Email';
        this.ict_none = 'No Invoice Required';
        /* Employment Type in Invoices */
        this.iet_c2c = 'C2C';
        this.iet_w2 = 'W2';
        this.iet_1099 = '1099';
        /* CustomerVendor Type in Invoices */
        this.icv_customer = 'Customer';
        this.icv_endclient = 'End Client';
        this.icv_vendor = 'Vendor';
        this.icv_consultant = 'Consultant';
        /* All pages */
        this.reportSearchMissingFields = 'Please provide at least one field value';
        this.emailRequired = 'Email is required';
        this.emailInvalid = 'Not a valid email';
        /* For User Absent Dialog */
        this.absentDialogHeight = '550px';
        this.absentDialogWidth = '400px';
        this.absentDialogTitle = 'Absent Users';
        /* For Job AssignTo Dialog */
        this.assignToDialogHeight = '550px';
        this.assignToDialogWidth = '400px';
        this.assignToDialogTitle = 'Absent Users';
        /* Height to be reduced for the page. */
        this.accordionPanelHeight = 280;
        this.accordionPanelHeight_Client = 310;
        this.accordionPanelHeight_VQuestion = 340;
        this.nonaccordionPanelHeight = 270;
        /* Client screen related */
        this.clientDeleteConfirmTitle = 'Delete Client';
        this.clientDeleteConfirmMessage = 'Deleting this client will remove the job-client mapping, if any.  \n Do you want to continue?';
        /* Customer/Vendor screen related */
        this.customerVendorDeleteConfirmTitle = 'Delete Customer/Vendor';
        this.customerVendorDeleteConfirmMessage = 'Are you sure to delete this Customer/Vendor?';
        /* My Jobs screen related. */
        this.maxJobMessage = 'Maximum of 2 jobs only can be started at a time.';
        this.jobStartMessage = 'Job ({0} - {1} ) has started.';
        this.jobStopMessage = 'Job ({0} - {1} ) has stopped.';
        /* Visa screen related */
        this.questionDeleteConfirmTitle = 'Delete Visa Question';
        this.questionDeleteConfirmMessage = 'Deleting this question will remove the response action question mapping, if any.  \n Do you want to continue?';
        this.screeningEndConfirmTitle = 'End Screening Process';
        this.screeningEndConfirmMessage = 'This will terminate and save the screening process.  \n Do you want to continue?';
        this.screeningEndRequiredMessage = 'Provide reason to end screening.';
        this.screeningCancelConfirmTitle = 'Cancel Screening Process';
        this.screeningCancelConfirmMessage = 'This will clear all your changes.  \n Do you want to continue?';
        this.questionTypeCheckbox = 'Checkbox';
        this.questionTypeDropdown = 'Dropdown';
        this.questionTypeText = 'Text';
        this.questionTypeTextArea = 'Long Text';
        this.tabQuestion = 'Questions';
        this.tabScreening = 'Screening';
        this.questionCheckedText = 'Checked';
        this.questionUnCheckedText = 'UnChecked';
        this.questionNAText = 'NA';
        /* Unauthorized dialog */
        this.unauthorizedConfirmTitle = 'Not Authorized';
        this.unauthorizedconfirmMessage = 'You are not authorized to view this page.  You will be redirected to home page.';
        this.unauthorizedConfirmActionButtonText = 'Goto Home Page';
    }
    Utilities.prototype.OrderDialogUsers = function (array, order, key) {
        var _this = this;
        var recruiter = [], leader = [], recruiterSel = [], leaderSel = [];
        array.filter(function (x) {
            if (x.roleName.toLowerCase() === _this.rn_recruiter.toLocaleLowerCase())
                recruiter.push(x);
        });
        array.filter(function (x) {
            if (x.roleName.toLowerCase() === _this.rn_teamlead.toLocaleLowerCase())
                leader.push(x);
        });
        order.forEach(function (item) {
            recruiter.filter(function (x) {
                if (x.id === item.id)
                    recruiterSel.push(x);
            });
        });
        order.forEach(function (item) {
            leader.filter(function (x) {
                if (x.id === item.id)
                    leaderSel.push(x);
            });
        });
        recruiterSel.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;
            if (x < y) {
                return 1;
            }
            if (x > y) {
                return -1;
            }
            return 0;
        });
        leaderSel.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;
            if (x < y) {
                return 1;
            }
            if (x > y) {
                return -1;
            }
            return 0;
        });
        recruiter.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        leader.sort(function (a, b) {
            var x = a.itemName;
            var y = b.itemName;
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        recruiterSel.forEach(function (sel) {
            var user = recruiter.filter(function (item) { return item.id == sel.id; });
            var index = recruiter.indexOf(user[0]);
            recruiter.splice(index, 1);
            recruiter.splice(0, 0, user[0]);
        });
        leaderSel.forEach(function (sel) {
            var user = leader.filter(function (item) { return item.id == sel.id; });
            var index = leader.indexOf(user[0]);
            leader.splice(index, 1);
            leader.splice(0, 0, user[0]);
        });
        var result = recruiter.concat(leader);
        return result;
    };
    Utilities.prototype.GetPageContentHeightWithAccordion = function () {
        return window.innerHeight - this.accordionPanelHeight;
    };
    Utilities.prototype.GetPageContentHeightWithAccordion_Client = function () {
        return window.innerHeight - this.accordionPanelHeight_Client;
    };
    Utilities.prototype.GetPageContentHeightWithAccordion_VQuestion = function () {
        return window.innerHeight - this.accordionPanelHeight_VQuestion;
    };
    Utilities.prototype.GetPageContentHeightNonAccordion = function () {
        return window.innerHeight - this.nonaccordionPanelHeight;
    };
    Utilities.prototype.ValidateEmail = function (email) {
        if (email.trim().length > 0) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        return false;
    };
    Utilities.prototype.GetCurrentDateTime = function () {
        var datetime, now = new Date();
        datetime = now.getFullYear() + '-';
        datetime += now.getMonth() + 1 + '-';
        datetime += now.getDate() + ' ';
        datetime += now.getHours() + ':';
        datetime += now.getMinutes() + ':';
        datetime += now.getSeconds() + '.';
        datetime += now.getMilliseconds();
        return datetime;
    };
    Utilities.prototype.IsNumber = function (e) {
        var charcode = (e.which) ? e.which : e.keycode;
        if (!(charcode >= 48 && charcode <= 57)) {
            return false;
        }
        return true;
    };
    Utilities = __decorate([
        core_1.Injectable()
    ], Utilities);
    return Utilities;
}());
exports.Utilities = Utilities;
