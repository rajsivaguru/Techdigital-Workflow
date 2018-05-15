"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var users_model_1 = require("./users.model");
var fuseUtils_1 = require("../../../core/fuseUtils");
var Subject_1 = require("rxjs/Subject");
var UsersService = /** @class */ (function () {
    function UsersService(http, configSer, loginService) {
        this.http = http;
        this.configSer = configSer;
        this.loginService = loginService;
        this.onContactsChanged = new BehaviorSubject_1.BehaviorSubject({});
        this.onSelectedContactsChanged = new BehaviorSubject_1.BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject_1.BehaviorSubject([]);
        this.onSearchTextChanged = new Subject_1.Subject();
        this.onFilterChanged = new Subject_1.Subject();
        this.selectedContacts = [];
        this.searchText = "";
        this.serviceURL = configSer.ServiceURL;
    }
    UsersService.prototype.ngOnInit = function () {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    };
    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    UsersService.prototype.resolve = function (route, state) {
        var _this = this;
        this.searchText = "";
        return new Promise(function (resolve, reject) {
            Promise.all([
                _this.getContacts(-1),
            ]).then(function (_a) {
                var files = _a[0];
                _this.onSearchTextChanged.subscribe(function (searchText) {
                    _this.searchText = searchText;
                    _this.getContacts(-1);
                });
                _this.onFilterChanged.subscribe(function (filter) {
                    _this.filterBy = filter;
                    _this.getContacts(-1);
                });
                resolve();
            }, reject);
        });
    };
    UsersService.prototype.getAssignedUser = function (status) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var userid = '0';
            if (_this.loginService.loggedUser != undefined)
                userid = _this.loginService.loggedUser.userid;
            _this.http.get(_this.serviceURL + 'User/GetUsersForAssignment?statusId=' + status + '&loginId=' + userid)
                .subscribe(function (response) {
                response = JSON.parse(response);
                resolve(response);
            }, reject);
        });
    };
    UsersService.prototype.getContacts = function (status) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var userid = '0';
            if (_this.loginService.loggedUser != undefined)
                userid = _this.loginService.loggedUser.userid;
            _this.http.get(_this.serviceURL + 'User/GetAllUsers?statusId=' + status + '&loginId=' + userid)
                .subscribe(function (response) {
                if (response != null && response != undefined) {
                    response = JSON.parse(response);
                    //console.log('fetchin user..');
                    _this.contacts = response;
                    if (_this.filterBy === 'starred') {
                        _this.contacts = _this.contacts.filter(function (_contact) {
                            return _this.user.starred.includes(_contact.userid);
                        });
                    }
                    if (_this.filterBy === 'frequent') {
                        _this.contacts = _this.contacts.filter(function (_contact) {
                            return _this.user.frequentContacts.includes(_contact.userid);
                        });
                    }
                    if (_this.searchText && _this.searchText !== '') {
                        _this.contacts = fuseUtils_1.FuseUtils.filterArrayByString(_this.contacts, _this.searchText);
                    }
                    if (_this.contacts.length > 0) {
                        _this.contacts = _this.contacts.map(function (contact) {
                            return new users_model_1.Contact(contact);
                        });
                    }
                    _this.onContactsChanged.next(_this.contacts);
                    resolve(_this.contacts);
                }
                else {
                    resolve([]);
                }
            }, reject);
            // this.contacts = this.contactsResult;
            // //console.log( this.contactsResult);
            // this.contacts = this.contacts.map(contact => {
            //     return new Contact(contact);
            // });
            // this.onContactsChanged.next(this.contacts);
            // resolve(this.contacts);
        });
    };
    UsersService.prototype.getRoleData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(_this.serviceURL + 'TDW/BindRoles?name_startsWith=' + _this.searchText)
                .subscribe(function (response) {
                response = JSON.parse(response);
                _this.roles = response;
                //console.log('get roles');
                //this.onUserDataChanged.next(this.user);
                resolve(_this.roles);
            }, reject);
        });
    };
    // getUserData(): Promise<any>
    // {
    //     return new Promise((resolve, reject) => {
    //             // this.http.get('api/contacts-user/5725a6802d10e277a0f35724')
    //             //     .subscribe((response: any) => {
    //             //         this.user = response;
    //             //         this.onUserDataChanged.next(this.user);
    //             //         resolve(this.user);
    //             //     }, reject);
    //             this.onUserDataChanged.next(this.user);
    //             resolve(this.user);
    //         }
    //     );
    // }
    /**
     * Toggle selected contact by id
     * @param id
     */
    // toggleSelectedContact(id)
    // {
    //     // First, check if we already have that todo as selected...
    //     if ( this.selectedContacts.length > 0 )
    //     {
    //         const index = this.selectedContacts.indexOf(id);
    //         if ( index !== -1 )
    //         {
    //             this.selectedContacts.splice(index, 1);
    //             // Trigger the next event
    //             this.onSelectedContactsChanged.next(this.selectedContacts);
    //             // Return
    //             return;
    //         }
    //     }
    //     // If we don't have it, push as selected
    //     this.selectedContacts.push(id);
    //     // Trigger the next event
    //     this.onSelectedContactsChanged.next(this.selectedContacts);
    // }
    /**
     * Toggle select all
     */
    // toggleSelectAll()
    // {
    //     if ( this.selectedContacts.length > 0 )
    //     {
    //         this.deselectContacts();
    //     }
    //     else
    //     {
    //         this.selectContacts();
    //     }
    // }
    UsersService.prototype.selectContacts = function (filterParameter, filterValue) {
        var _this = this;
        this.selectedContacts = [];
        // If there is no filter, select all todos
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedContacts = [];
            this.contacts.map(function (contact) {
                _this.selectedContacts.push(contact.userid);
            });
        }
        else {
            /* this.selectedContacts.push(...
                 this.contacts.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }
        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    };
    UsersService.prototype.updateContact = function (contact) {
        var _this = this;
        var userid = '0';
        if (this.loginService.loggedUser != undefined)
            userid = this.loginService.loggedUser.userid;
        return new Promise(function (resolve, reject) {
            //this.http.post('api/contacts-contacts/' + contact.userid, {...contact})
            _this.http.get(_this.serviceURL + 'TDW/SaveUser?sUserModel=' + JSON.stringify(contact) + '&loginid=' + userid)
                .subscribe(function (response) {
                response = JSON.parse(response);
                //this.getContacts();
                resolve(response);
            });
        });
    };
    UsersService = __decorate([
        core_1.Injectable()
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
