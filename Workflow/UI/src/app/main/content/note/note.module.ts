import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { SharedModule } from '../../../core/modules/shared.module';

import { NoteService } from './note.service';
import { NoteFormComponent } from './note.component';
import { DialogComponent } from '../dialog/dialog.component'
import { SnackBarService } from '../dialog/snackbar.service'
import { AuthGuard } from '../login/login.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

const routes: Routes = [
    {
        path: 'notes',
        component: NoteFormComponent,
        canActivate: [AuthGuard],
        resolve: {
            noteForm: NoteService
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
        NoteFormComponent
    ],
    providers: [
        NoteService, SnackBarService
    ],
    entryComponents: [DialogComponent]
})

export class NoteModule {
}
