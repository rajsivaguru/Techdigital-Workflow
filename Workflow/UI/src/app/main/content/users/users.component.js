"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("../../../core/animations");
var forms_1 = require("@angular/forms");
var UsersComponent = /** @class */ (function () {
    function UsersComponent(contactsService, dialog, router, loginService) {
        this.contactsService = contactsService;
        this.dialog = dialog;
        this.router = router;
        this.loginService = loginService;
        this.searchInput = new forms_1.FormControl('');
    }
    UsersComponent.prototype.ngOnInit = function () {
        // if( this.loginService.loggedUser == undefined)
        // {
        //     this.router.navigateByUrl('/login');
        //     return;
        // }
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
    UsersComponent.prototype.newContact = function () {
        this.contactsService.action = 'new';
        this.router.navigateByUrl('/usersform');
        // this.dialogRef = this.dialog.open(UsersFormComponent, {
        //     panelClass: 'contact-form-dialog',
        //     data      : {
        //         action: 'new'
        //     }
        // });
        // this.dialogRef.afterClosed()
        //     .subscribe((response: FormGroup) => {
        //         if ( !response )
        //         {
        //             return;
        //         }
        //         this.contactsService.updateContact(response.getRawValue());
        //     });
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
