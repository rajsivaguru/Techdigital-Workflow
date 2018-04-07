import { DatePipe } from '@angular/common';
export class Order
{
            cllicode   : string;
            currentdate : string;
            deliverydate : string;
            deliveryenddate  : string;
            deliverytime  : string;
            deliveryendtime  : string;

            tanksize   : number;
            gallons  : number;
            product      : string;
            
            phone     : string;
            attuid: string;
            name   : string;
            email : string;
            
            sitecontactphone  : string;
            sitecontactname   : string;
            sitecontactemail  : string;

            noofgenerators : number;
            reposition : string;
            groundlevel : string;
            reason : string;
            chkspl : string;
            splInstruction : string;
            
            site      : string;
            gocode     : string;
            county: string;
            address: string;
            city: string;
            state:string;
            zip: number;

  
    constructor(order?)
    {
        var datePipe = new DatePipe("en-US");

        order = order || {};
        this.cllicode = order.cllicode || '';
        this.currentdate = order.currentdate ||  datePipe.transform(new Date(), 'MM-dd-yyyy hh:mm aa');
        this.deliverydate = order.deliverydate ||'';
        this.deliveryenddate = order.deliveryenddate || '';
        this.deliverytime = order.deliverytime || '';
        this.deliveryendtime = order.deliveryendtime || '';
        
        this.tanksize = order.tanksize || '';
        this.gallons = order.gallons || '';
        this.product = order.product || '';

        this.phone = order.phone || '';
        this.attuid = order.attuid || '';
        this.name = order.name || '';
        this.email = order.email || '';

        this.sitecontactphone = order.sitecontactphone || '';
        this.sitecontactname = order.sitecontactname || '';
        this.sitecontactemail = order.sitecontactemail || '';

        this.noofgenerators = order.noofgenerators || 0;
        this.reposition = order.reposition || 'No';
        this.groundlevel = order.groundlevel || 'AST';
        this.reason = order.reason || '';
        this.chkspl = order.chkspl || 'No';
        this.splInstruction = order.splInstruction || '';

        this.site = order.site || '';
        this.gocode = order.gocode || '';
        this.county = order.county || '';
        this.address = order.address || '';
        this.city = order.city || '';
        this.state = order.state || '';
        this.zip = order.zip || '';
    }
   
}

export class OrderExists
{
    CLLICODE            : string;
    DELIVERYENDDATE     : string; 
    DELIVERYSTARTDATE   : string;
    ORDERNO             : string;
    QTY                 : string;

     constructor()
     {}
}