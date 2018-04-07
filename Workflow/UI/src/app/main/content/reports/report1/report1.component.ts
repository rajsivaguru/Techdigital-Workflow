import { Component, OnInit,AfterViewInit, Input, Output, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import { AbstractControl} from '@angular/forms';
import { Location } from '@angular/common';

import { Order} from '../reports.model';
import { ReportsService} from '../reports.service';


@Component({
    selector   : 'fuse-orderentry',
    templateUrl: './report1.component.html',
    styleUrls  : ['./report1.component.scss']
})
export class Report1Component implements OnInit, AfterViewInit
{

    form: FormGroup;
    formErrors: any;
    maskPhone : any[];
    tankNumbers : any[];

    orderEntryModel : any;

    order = new Order();

    datePipe = new DatePipe("en-US");

    todayDate = new Date();
    minDeliveryDate = null;
    minDeliveryEndDate = null;
    maxDeliveryDate  = null; 
    maxDeliveryEndDate = null;
    //serviceUrl = 'http://www.psenergy.com/Orders/OrderEntryService/';
    serviceUrl = 'http://localhost:43000/';

    constructor(private formBuilder: FormBuilder, 
                private _sanitizer: DomSanitizer, 
                private dialog : MatDialog,
                public http: Http, 
                private location: Location, 
                private router : Router,
                private orderService : ReportsService )
    {
        
        this.formErrors = {
            cllicode   : { required : true},
            deliverydate : {required : true},
            deliveryenddate  : {required : true},
            deliverytime  : {required : true},
            deliveryendtime  : {required : true},

            tanksize   : { required : true},
            gallons  : { required : true},
            product      : { required : true},
            phone     : { required : true},
            attuid: { required : true},

            name   : { required : true},
            email : { required : true},
            sitecontactphone  : { required : true},
            sitecontactname   : { required : true},
            sitecontactemail  : { required : true}, 
            site      : { required : true},
            gocode     : { required : true},
            county: { required : true},
            address: { required : true},
            city: { required : true},
            state: { required : true},
            zip: { required : true}
        };


        //this.tankNumbers = Array(100).fill().map((x,i)=>i+1);
        this.tankNumbers = Array.from(new Array(100),(val,index)=>index+1);
        this.minDeliveryDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate()+1);
        this.minDeliveryEndDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate()+1);
    }

    ngOnInit()
    {
        //console.log('order - init')
        this.orderService.orderValidated = false;
        this.order = new Order(this.orderService.savedOrderData);
        this.form = this.createForm();

        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });
    }
    ngAfterViewInit() {
        // never raised an issue until now
    }

    createForm(){

        this.maskPhone  = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

        const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


        return this.formBuilder.group({
            cllicode        : [this.order.cllicode],
            currentdate     : [
                                {
                                    value       : this.order.currentdate,
                                    disabled    : false
                                }
                
                                ],
            deliverydate    : [this.order.deliverydate],
            deliveryenddate : [this.order.deliveryenddate],
            deliverytime    : [
                                {
                                    value       : this.order.deliverytime,
                                    disabled    : false
                                },
                                Validators.required
                                ],
            deliveryendtime : [
                                    {
                                        value       : this.order.deliveryendtime,
                                        disabled    : false
                                    },
                                    Validators.required
                                ],
            
            tanksize        :   [this.order.tanksize, 
                                    [
                                        Validators.required,
                                        Validators.min(1),
                                        Validators.max(99999999)
                                    ]
                                ],
            gallons         : [this.order.gallons,
                                    [
                                        Validators.required,
                                        Validators.min(1),
                                        Validators.max(99999999)
                                    ]

                                ],
            product         : [this.order.product],
            phone           : [this.order.phone],
            attuid          : [this.order.attuid],
            name            : [this.order.name],
            email           : [this.order.email,
                                    [
                                        Validators.pattern(EMAIL_REGEX)
                                    ]
                                ],
            sitecontactphone: [this.order.sitecontactphone],
            sitecontactname : [this.order.sitecontactname],
            sitecontactemail: [this.order.sitecontactemail,
                                    [
                                        Validators.pattern(EMAIL_REGEX)
                                    ]
                                ],
            noofgenerators  : [this.order.noofgenerators],
            reposition      : [this.order.reposition],
            groundlevel     : [this.order.groundlevel],
            reason          : [this.order.reason],
            chkspl          : [this.order.chkspl],
            splInstruction  : [this.order.splInstruction],

            site            : [
                                { 
                                    value : this.order.site,
                                    disabled : false
                                },                
                                Validators.required],
            gocode          : [this.order.gocode],
            county          : [this.order.county, Validators.required],
            address         : [this.order.address, Validators.required],
            city            : [this.order.city, Validators.required],
            state           : [this.order.state, Validators.required],
            zip             : [this.order.zip, Validators.required]
            
        });
    }

    observableSource = (keyword: any): Observable<any[]> => {
        //let url: string = 'https://maps.googleapis.com/maps/api/geocode/json?address='+keyword
        let url: string = this.serviceUrl + 'api/TFS/TankCLLICode?name_startsWith=' + keyword

        try
        {
            if (keyword) {
            return this.http.get(url)
                .map(res => {
                let json = res.json();
                return JSON.parse(json);
                })
            } else 
            {
                return Observable.of([]);
            }
        }
        catch(ex)
        {
            console.log(ex)
            return Observable.of([]);
        }
    
    }

    onFormValuesChanged()
    {
       
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {required : true};
            //console.log(this.formErrors[field])

            // Get the control
            const control = this.form.get(field);
            
            
            if ( control && control.dirty && !control.valid )
            {
                //console.log(control)
                //console.log(control.dirty);
                this.formErrors[field] = control.errors;
            }
        }
    }

    selectedDeliveryDate(type: string, event: MatDatepickerInputEvent<Date>) {
        this.minDeliveryEndDate = event.value; 
    }
    selectedDeliveryEndDate(type: string, event: MatDatepickerInputEvent<Date>) {

        this.maxDeliveryDate = event.value;
    }
    bindRequesterEmail(event)
    {
        
         this.form.patchValue(
            {

                email        : (this.form.get('attuid').value == '')? '' : this.form.get('attuid').value + '@att.com'
            }
         );
         //console.log(event)

    }
    openDialog(message) : void
    {
        

    }

    clearForm() : void
    {
        this.form.reset();
        this.form.patchValue(
            {
                currentdate     : this.datePipe.transform(new Date(), 'MM-dd-yyyy hh:mm aa'),
                reposition      : 'No',
                groundlevel     : 'AST',
                chkspl          : 'No'
            }
        );

       
    }

    saveOrder() 
    {
        //console.log('save')
        this.order = this.form.getRawValue();
        this.orderService.savedOrderData = this.order;
        this.orderService.orderValidated = true;
        //this.orderService.publishData(this.order);
        //this.location.go('orderconfirm')

        if (this.order.cllicode && this.order.cllicode["cllicode"]) 
            {
            
                let url: string = this.serviceUrl + 'api/TFS/CheckDuplicate?checkcllicode=' + this.order.cllicode["cllicode"] + '&clliaccountno=000950'

                this.http.get(url)
                    .subscribe(res => {

                    //console.log(res);
                    let json = res.json();

                    if (json == "")
                        this.router.navigateByUrl('/orderconfirm');
                    else
                    {
                        console.log(JSON.parse(json));
                        let sOrderDat = JSON.parse(json);
                        if (sOrderDat)
                        {
                            this.orderService.orderDuplicateData.CLLICODE           = sOrderDat[0]["CLLICODE"];
                            this.orderService.orderDuplicateData.DELIVERYENDDATE    = sOrderDat[0]["DELIVERYENDDATE"];
                            this.orderService.orderDuplicateData.DELIVERYSTARTDATE  = sOrderDat[0]["DELIVERYSTARTDATE"];
                            this.orderService.orderDuplicateData.ORDERNO            = sOrderDat[0]["ORDERNO"];
                            this.orderService.orderDuplicateData.QTY                = sOrderDat[0]["QTY"];
                            this.router.navigateByUrl('/orderexists');
                        }
                        
                    }
                })
            } 
    }

    submitOrder () 
    {
        console.log('submitted');
        
        this.order = this.orderService.savedOrderData;

        this.orderEntryModel =
        {
                DeliveryDate: '',
                DeliveryEndDate: '',
                DeliveryTime: '',
                DeliveryEndTime: '',
                RequiredGallons: 0,
                TankSize: 0,
                ProductType: '',
                SiteName: '',
                RequesterUID: '',
                RequesterName: '',
                RequestedDate: '',
                RequesterPhone: '',

                SiteContactName: '',
                SiteContactPhone: '',
                SiteContactEmail: '',

                Email: '',
                CLLI: '',
                GO: '',
                Address: '',
                City: '',
                State: '',
                Zip: '',
                County: '',
                NoOfGen: 0,
                NoOfSite: 0,
                Reposition: '',
                SplInstruction: '',
                GroundLevel:'',
                Refueling:'',
		        BrowserName : '',
                BrowserIP : ''
            };

        try
        {
            if (this.order.cllicode && this.order.cllicode["cllicode"])
            {

                this.orderEntryModel.DeliveryDate = this.order.deliverydate;
                this.orderEntryModel.DeliveryEndDate = this.order.deliveryenddate;

                this.orderEntryModel.DeliveryTime = this.order.deliverytime;
                this.orderEntryModel.DeliveryEndTime = this.order.deliveryendtime;

                this.orderEntryModel.RequiredGallons = this.order.gallons;
                this.orderEntryModel.TankSize = this.order.tanksize;
                this.orderEntryModel.ProductType = this.order.product;
                this.orderEntryModel.SiteName = this.order.site;

                this.orderEntryModel.RequesterPhone = this.order.phone;
                this.orderEntryModel.RequesterUID = this.order.attuid;
                this.orderEntryModel.RequesterName = this.order.name;
                this.orderEntryModel.RequestedDate = this.order.currentdate;

                
                this.orderEntryModel.Email = this.order.email;


                this.orderEntryModel.SiteContactName = this.order.sitecontactname;
                this.orderEntryModel.SiteContactPhone = this.order.sitecontactphone;
                this.orderEntryModel.SiteContactEmail = this.order.sitecontactemail;

                this.orderEntryModel.CLLI = this.order.cllicode["cllicode"];
                this.orderEntryModel.GO = this.order.gocode;

                this.orderEntryModel.Address = this.order.address;
                this.orderEntryModel.City = this.order.city;
                this.orderEntryModel.State = this.order.state;
                this.orderEntryModel.Zip = this.order.zip;
                this.orderEntryModel.County = this.order.county;
                
                this.orderEntryModel.NoOfGen = this.order.noofgenerators;
                this.orderEntryModel.NoOfSite = 0; 
                this.orderEntryModel.Reposition = this.order.reposition;
                this.orderEntryModel.SplInstruction = window.btoa(this.order.splInstruction);
                this.orderEntryModel.Refueling = this.order.reason;
                this.orderEntryModel.GroundLevel = this.order.groundlevel;
            
            
                let url: string = this.serviceUrl +'api/TFS/SaveOrderEntry?OrderEntryModel=' + JSON.stringify(this.orderEntryModel)

                this.http.get(url)
                    .subscribe(res => {

                    let json = res.json();

                    let sOrderDat = JSON.parse(json);
                    //console.log(sOrderDat);
                    if (sOrderDat)
                    {
                        if(sOrderDat["Result"]=="1")
                        {
                            this.orderService.savedOrderData = new Order();
                            this.order = new Order();
                            this.router.navigateByUrl('/orderentry');
                            this.openDialog(sOrderDat["Message"]);
                        }
                        else
                        {
                            this.router.navigateByUrl('/orderentry')
                            this.openDialog(sOrderDat["Message"]);
                        }
                    }
                })
            } 
            
        }
        catch(ex)
        {
            console.log(ex)
        }
    }

     autocompleListFormatter = (data: any) : SafeHtml => {
            let html = `<span class="font-weight-900 font-size-12">${data.cllicode} </span><span class="font-size-10">${data.shortname} | ${data.sitestreetaddress} | ${data.sitecity} | ${data.sitestate} | ${data.sitezipcode}</span>`;
            return this._sanitizer.bypassSecurityTrustHtml(html);
            
        }
    autocompleListSelected = (data : any) : void =>
    {
        //console.log('selected')
      
        this.form.patchValue(
            {
                site : '',
                gocode : '',
                county : '',
                address : '',
                city : '',
                state : '',
                zip : '',

                sitecontactphone : '',
                sitecontactname : '',
                sitecontactemail : '',
                attuid : '',

                email : ''
            });
        
        this.form.patchValue(
            {
                site : data["shortname"],
                gocode : data["gocode"],
                county : data["sitecounty"],
                address : data["sitestreetaddress"],
                city : data["sitecity"],
                state : data["sitestate"],
                zip : data["sitezipcode"],

                sitecontactphone : data["phonenumber"],
                sitecontactname : data["sitecontactname"],
                sitecontactemail : data["emailaddress"],
                attuid : data["attuid"],

                email : (data["attuid"] == '')? '' : data["attuid"] + '@att.com'
            }
        );
        return data["cllicode"];
        //console.log(data)
    }

    startTimeSelected (startTime) 
    {

        this.form.patchValue(
            {

                deliverytime        : this.datePipe.transform(startTime, 'hh:mm aa') //NguiDatetime.formatDate(new Date(), 'DD/MM hh:mm')

            }
         );

    }
    endTimeSelected (endTime) 
    {
        this.form.patchValue(
            {
                deliveryendtime        : this.datePipe.transform(endTime, 'hh:mm aa') //NguiDatetime.formatDate(new Date(), 'DD/MM hh:mm')
            }
         );
    }

}
