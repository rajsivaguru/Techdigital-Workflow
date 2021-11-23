"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var animations_1 = require("../../../core/animations");
var dialog_component_1 = require("../dialog/dialog.component");
var UsersComponent = /** @class */ (function () {
    function UsersComponent(contactsService, dialog, router, loginService, snackComp, utilities) {
        this.contactsService = contactsService;
        this.dialog = dialog;
        this.router = router;
        this.loginService = loginService;
        this.snackComp = snackComp;
        this.utilities = utilities;
        this.usersList = [];
        this.absentUsersList = [];
        this.searchInput = new forms_1.FormControl('');
    }
    UsersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.contactsService.onSelectedContactsChanged
            .subscribe(function (selectedContacts) {
            _this.hasSelectedContacts = selectedContacts.length > 0;
        });
        this.searchInput.valueChanges
            .debounceTime(300)
            .subscribe(function (searchText) {
            _this.contactsService.onSearchTextChanged.next(searchText);
        });
    };
    UsersComponent.prototype.getUserList = function () {
        this.contactsService.getContacts(-1);
    };
    UsersComponent.prototype.assignUser = function () {
        this.contactsService.action = 'new';
        this.router.navigateByUrl('/user');
    };
    UsersComponent.prototype.manageAbsentees = function () {
        var _this = this;
        this.contactsService.getAbsentUser()
            .then(function (response) {
            if (response) {
                _this.usersList = [];
                _this.absentUsersList = [];
                response.map(function (user) {
                    _this.usersList.push({ "roleName": user["rolename"], "id": user["userid"], "itemName": user["name"] });
                    if (user["isabsent"]) {
                        _this.absentUsersList.push({ "id": user["userid"], "itemName": user["name"] });
                    }
                });
                _this.usersList = _this.utilities.OrderDialogUsers(_this.usersList, _this.absentUsersList, "id");
                var dialogUserList = _this.dialog.open(dialog_component_1.DialogDataComponent, {
                    height: _this.utilities.absentDialogHeight,
                    width: _this.utilities.absentDialogWidth,
                    data: {
                        title: _this.utilities.absentDialogTitle,
                        userList: _this.usersList,
                        selectedUsers: _this.absentUsersList
                    }
                });
                dialogUserList.afterClosed().subscribe(function (result) {
                    if (result != undefined) {
                        var userids = [];
                        result.map(function (user) { userids.push(user["id"]); });
                        _this.contactsService.saveAbsentUser(userids.join(',')).then(function (response) {
                            if (response) {
                                _this.snackComp.showUnfinishedSnackBar(response);
                            }
                        });
                    }
                });
            }
        });
    };
    UsersComponent = __decorate([
        core_1.Component({
            selector: 'fuse-contacts',
            templateUrl: './users.component.html',
            styleUrls: ['./users.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: animations_1.fuseAnimations
        })
    ], UsersComponent);
    return UsersComponent;
}());
exports.UsersComponent = UsersComponent;
