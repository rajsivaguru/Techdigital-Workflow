"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var material_1 = require("@angular/material");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
require("rxjs/add/operator/startWith");
require("rxjs/add/observable/merge");
require("rxjs/add/operator/map");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/observable/fromEvent");
var collections_1 = require("@angular/cdk/collections");
var animations_1 = require("../../../../core/animations");
var fuseUtils_1 = require("../../../../core/fuseUtils");
var UserListComponent = /** @class */ (function () {
    function UserListComponent(contactsService, dialog, router, configSer, loginService) {
        var _this = this;
        this.contactsService = contactsService;
        this.dialog = dialog;
        this.router = router;
        this.configSer = configSer;
        this.loginService = loginService;
        this.displayedColumns = ['imgurl', 'name', 'email', 'rolename', 'workphone', 'mobile', 'homephone', 'location', 'status'];
        this.onContactsChangedSubscription =
            this.contactsService.onContactsChanged.subscribe(function (contacts) {
                if (_this.paginator != undefined)
                    _this.paginator.pageIndex = 0;
                _this.contacts = contacts;
                _this.checkboxes = {};
                // contacts.map(contact => {
                //     this.checkboxes[contact.userid] = false;
                // });
            });
        this.onSelectedContactsChangedSubscription =
            this.contactsService.onSelectedContactsChanged.subscribe(function (selectedContacts) {
                //console.log('selectec contact changed')
                for (var userid in _this.checkboxes) {
                    _this.checkboxes[userid] = selectedContacts.includes(userid);
                }
                _this.selectedContacts = selectedContacts;
            });
        this.onUserDataChangedSubscription =
            this.contactsService.onUserDataChanged.subscribe(function (user) {
                //console.log('user data changed')
                _this.user = user;
            });
    }
    UserListComponent.prototype.ngOnInit = function () {
        // if( this.loginService.loggedUser == undefined)
        // {
        //     this.router.navigateByUrl('/login');
        //     return;
        // }
        this.dataSource = new FilesDataSource(this.contactsService, this.paginator, this.sort);
        //  Observable.fromEvent(this.filter.nativeElement, 'keyup')
        //           .debounceTime(150)
        //           .distinctUntilChanged()
        //           .subscribe(() => {
        //               if ( !this.dataSource )
        //               {
        //                   return;
        //               }
        //               this.dataSource.filter = this.filter.nativeElement.value;
        //           });
    };
    UserListComponent.prototype.ngOnDestroy = function () {
        this.onContactsChangedSubscription.unsubscribe();
        this.onSelectedContactsChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    };
    UserListComponent.prototype.editContact = function (contact) {
        this.contactsService.action = 'edit';
        this.contactsService.editContacts = contact;
        this.router.navigateByUrl('/usersform');
    };
    __decorate([
        core_1.ViewChild('dialogContent')
    ], UserListComponent.prototype, "dialogContent", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], UserListComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild('filter')
    ], UserListComponent.prototype, "filter", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], UserListComponent.prototype, "sort", void 0);
    UserListComponent = __decorate([
        core_1.Component({
            selector: 'users-list',
            templateUrl: './users-list.component.html',
            styleUrls: ['./users-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], UserListComponent);
    return UserListComponent;
}());
exports.UserListComponent = UserListComponent;
var FilesDataSource = /** @class */ (function (_super) {
    __extends(FilesDataSource, _super);
    function FilesDataSource(contactsService, _paginator, _sort) {
        var _this = _super.call(this) || this;
        _this.contactsService = contactsService;
        _this._paginator = _paginator;
        _this._sort = _sort;
        _this._filterChange = new BehaviorSubject_1.BehaviorSubject('');
        _this._filteredDataChange = new BehaviorSubject_1.BehaviorSubject('');
        _this.filteredData = _this.contactsService.contacts;
        return _this;
    }
    Object.defineProperty(FilesDataSource.prototype, "filteredData", {
        get: function () {
            return this._filteredDataChange.value;
        },
        set: function (value) {
            this._filteredDataChange.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilesDataSource.prototype, "filter", {
        get: function () {
            return this._filterChange.value;
        },
        set: function (filter) {
            this._filterChange.next(filter);
        },
        enumerable: true,
        configurable: true
    });
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    FilesDataSource.prototype.connect = function () {
        var _this = this;
        var displayDataChanges = [
            this.contactsService.onContactsChanged,
            this._paginator.page,
            this._filterChange,
            this._sort.sortChange
        ];
        return Observable_1.Observable.merge.apply(Observable_1.Observable, displayDataChanges).map(function () {
            var data = _this.contactsService.contacts.slice();
            data = _this.filterData(data);
            _this.filteredData = data.slice();
            data = _this.sortData(data);
            // Grab the page's slice of data.
            var startIndex = _this._paginator.pageIndex * _this._paginator.pageSize;
            return data.splice(startIndex, _this._paginator.pageSize);
        });
    };
    FilesDataSource.prototype.filterData = function (data) {
        if (!this.filter) {
            return data;
        }
        return fuseUtils_1.FuseUtils.filterArrayByString(data, this.filter);
    };
    FilesDataSource.prototype.sortData = function (data) {
        var _this = this;
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }
        //displayedColumns = ['imgurl', 'name', 'email', 'rolename', 'workphone','mobile','homephone', 'location', 'status'];
        return data.sort(function (a, b) {
            var propertyA = '';
            var propertyB = '';
            switch (_this._sort.active) {
                case 'name':
                    _a = [a.name, b.name], propertyA = _a[0], propertyB = _a[1];
                    break;
                case 'email':
                    _b = [a.email, b.email], propertyA = _b[0], propertyB = _b[1];
                    break;
                case 'rolename':
                    _c = [a.rolename, b.rolename], propertyA = _c[0], propertyB = _c[1];
                    break;
                case 'workphone':
                    _d = [a.workphone, b.workphone], propertyA = _d[0], propertyB = _d[1];
                    break;
                case 'mobile':
                    _e = [a.mobile, b.mobile], propertyA = _e[0], propertyB = _e[1];
                    break;
                case 'homephone':
                    _f = [a.homephone, b.homephone], propertyA = _f[0], propertyB = _f[1];
                    break;
                case 'location':
                    _g = [a.location, b.location], propertyA = _g[0], propertyB = _g[1];
                    break;
                case 'status':
                    _h = [a.status, b.status], propertyA = _h[0], propertyB = _h[1];
                    break;
            }
            var valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            var valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (_this._sort.direction === 'asc' ? 1 : -1);
            var _a, _b, _c, _d, _e, _f, _g, _h;
        });
    };
    FilesDataSource.prototype.disconnect = function () {
    };
    return FilesDataSource;
}(collections_1.DataSource));
exports.FilesDataSource = FilesDataSource;
