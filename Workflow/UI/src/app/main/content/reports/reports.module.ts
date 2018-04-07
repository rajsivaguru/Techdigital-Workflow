import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';

import { Report1Component } from './report1/report1.component';
import { Report2Component } from './report2/report2.component';
import { Report3Component } from './report3/report3.component';

import { TextMaskModule } from 'angular2-text-mask';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

import { HttpModule } from '@angular/http';
import { ReportsService} from './reports.service';

const routes = [
    {
        path     : 'report1',
        component: Report1Component
    },
    {
        path        : 'report2',
        component   : Report2Component
    },
    {
        path        : 'report3',
        component   : Report3Component
    }
];
 
@NgModule({
    declarations: [
        Report1Component,
        Report2Component,
        Report3Component
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
        Report1Component,
        Report2Component,
        Report3Component
        
    ],
    entryComponents: [],
    providers   :   [ReportsService]
})

export class ReportsModule
{
}
