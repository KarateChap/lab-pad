import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ErrorComponent } from './error/error.component';
import { AuthGuard } from './guards/auth.guard';
import { LaunchpadComponent } from './launchpad/launchpad.component';
import { LoginComponent } from './login/login.component';
import { TokensaleComponent } from './tokensale/tokensale.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'launchpad',
    pathMatch: 'full',
  },
  {path: 'launchpad', component: LaunchpadComponent},
  {path: 'launchpad/:id', component: TokensaleComponent},
  {path: 'login', component: LoginComponent},
  {path: 'admin', component: AdminComponent,
  canActivate: [AuthGuard]
},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
