import { FuseUtils } from '../../../core/fuseUtils';

export class Contact
{
    userid: string;
    fname: string;
    lname: string;
    minitial: string;
    name : string;
    email: string;
    roleid : string;
    oldRoleId : string;
    rolename: string;
    rolenames: string[];
    workphone: string;
    mobile: string;
    homephone: string;
    location: string;
    imgurl : string;
    status : number;
    oldStatus : number;
    createdby : string;
    createdon : string;
    modifiedby : string;
    modifiedon: string;
    token: string;
 
    constructor(contact)
    {
        this.userid = contact.userid || 0;
        this.fname = contact.fname || '';
        this.lname = contact.lname || '';
        this.minitial = contact.minitial || '';
        this.name = contact.name || '';
        this.email = contact.email || '';
        this.roleid = contact.roleid || '';
        this.oldRoleId = contact.roleid || '';
        this.rolename = contact.rolename || '';
        this.rolenames = contact.rolenames || [];
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
        this.token = contact.token || '';
    }
}

export class Role{

    RoleId      : string;
   	Name    	: string;
    Description : string;
    SortOrder   : string;
    IsActive    : string;
    CreatedBy   : string;
    CreatedOn   : string;
    ModifiedBy  : string;
    ModifiedOn  : string;

    constructor(role)
    {
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
}
