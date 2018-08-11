import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginGuard } from '@app/core/guards';
import { SharedModule } from '@app/shared/shared.module';

import {
  UserFormComponent
} from './components';
import { UsersPageComponent } from './pages/users-page.component';

export const ROUTES: Routes = [
  { path: '', component: UsersPageComponent, canActivate: [LoginGuard] }
];

@NgModule({
  entryComponents: [
    UserFormComponent
  ],
  declarations: [
    UserFormComponent,

    UsersPageComponent
  ],
  imports: [
    SharedModule,

    RouterModule.forChild(ROUTES)
  ]
})
export class UserModule { }
