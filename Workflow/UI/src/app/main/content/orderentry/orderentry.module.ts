import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';

import { FuseOrderEntryComponent, DialogComponent } from './order/order.component'
import { FuseOrderConfirmComponent } from './confirm/confirm.component';
import { FuseOrderExistsComponent } from './exists/exists.component';

import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { HttpModule } from '@angular/http';
import {OrderEntryService} from './orderentry.service';

const routes = [
    {
        path     : 'orderentry',
        component: FuseOrderEntryComponent
    },
    {
        path        : 'orderconfirm',
        component   : FuseOrderConfirmComponent
    },
    {
        path        : 'orderexists',
        component   : FuseOrderExistsComponent
    }
];
 
@NgModule({
    declarations: [
        FuseOrderEntryComponent,
        FuseOrderConfirmComponent,
        FuseOrderExistsComponent,
        DialogComponent
    ],
    imports     : [
        SharedModule,
        TextMaskModule,
        NguiAutoCompleteModule,
        NguiDatetimePickerModule,
        HttpModule,
        RouterModule.forChild(routes)
    ],
    exports     : [
        FuseOrderEntryComponent,
        FuseOrderConfirmComponent
        
    ],
    entryComponents: [DialogComponent],
    providers   :   [OrderEntryService, FuseOrderEntryComponent]
})

export class OrderEntryeModule
{
}
