import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { SharedModule } from '../../../core/modules/shared.module';

import { SearchService } from './search.service';
import { ProfileSearchComponent } from './profilesearch/profilesearch.component';
import { DialogComponent } from '../dialog/dialog.component'
import { SnackBarService } from '../dialog/snackbar.service'
import { AuthGuard } from '../login/login.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

const routes: Routes = [
    {
        path: 'profilesearch',
        component: ProfileSearchComponent,
        canActivate: [AuthGuard],
        resolve: {
            newJobs: SearchService
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        NguiAutoCompleteModule,
        NguiDatetimePickerModule,
        AngularMultiSelectModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ProfileSearchComponent
    ],
    providers: [
        SearchService, SnackBarService
    ],
    entryComponents: [DialogComponent]
})
export class SearchModule {
}
