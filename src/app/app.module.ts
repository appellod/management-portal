import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoreModule } from '@app/core/core.module';
import { LayoutComponent } from '@app/core/components';
import { SharedModule } from '@app/shared/shared.module';

import { AppComponent } from './app.component';

export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/users' },
  {
    path: 'login',
    loadChildren: './modules/login/login.module#LoginModule'
  },
  {
    path: 'users',
    component: LayoutComponent,
    loadChildren: './modules/users/users.module#UserModule'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [
    AppComponent
  ],
  imports: [
    CoreModule,
    SharedModule,

    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue : '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
