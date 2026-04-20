import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { AdminPannelComponent } from './pages/admin-pannel/admin-pannel.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';

export const routes: Routes = [
  {
    path: '',
    // component: AppComponent,
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin-pannel',
    component: AdminPannelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'crud',
    // canActivateChild: [AuthGuard],
    children: [
      { path: 'list-user', component: ListUsersComponent },
      { path: 'create-user', component: CreateUserComponent },
      { path: 'update-user/:id', component: UpdateUserComponent },
    ]
  }
  // {
  //   path: 'admin-pannel/update-user/:id',
  //   component: UpdateUserComponent
  // },
  // {
  //   path: 'admin-pannel/delete-user/:id',
  //   component: DeleteUserComponent
  // },

];
