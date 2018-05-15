"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Contact = /** @class */ (function () {
    function Contact(contact) {
        this.userid = contact.userid || 0;
        this.fname = contact.fname || '';
        this.lname = contact.lname || '';
        this.minitial = contact.minitial || '';
        this.name = contact.name || '';
        this.email = contact.email || '';
        this.roleid = contact.roleid || '';
        this.oldRoleId = contact.roleid || '';
        this.rolename = contact.rolename || '';
        this.workphone = contact.workphone || '';
        this.mobile = contact.mobile || '';
        this.homephone = contact.homephone || '';
        this.location = contact.location || '';
        this.imgurl = contact.imgurl || 'assets/images/avatars/profile.jpg';
        this.status = contact.status || 0;
        this.oldStatus = contact.status || 0;
        this.createdby = contact.createdby || '';
        this.createdon = contact.createdon || '';
        this.modifiedby = contact.modifiedby || '';
        this.modifiedon = contact.modifiedon || '';
    }
    return Contact;
}());
exports.Contact = Contact;
var Role = /** @class */ (function () {
    function Role(role) {
        {
            this.RoleId = role.RoleId || 0;
            this.Name = role.Name || '';
            this.Description = role.Description || '';
            this.SortOrder = role.SortOrder || '';
            this.IsActive = role.IsActive || '';
            this.CreatedBy = role.CreatedBy || '';
            this.CreatedOn = role.CreatedOn || '';
            this.ModifiedBy = role.ModifiedBy || '';
            this.ModifiedOn = role.ModifiedOn || '';
        }
    }
    return Role;
}());
exports.Role = Role;
