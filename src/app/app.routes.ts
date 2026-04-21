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
import { SingleUserInfoComponent } from './pages/single-user-info/single-user-info.component';
import { BookReferencesComponent } from './pages/book-references/book-references.component';

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
    path: 'book-references',
    component: BookReferencesComponent
  },
  {
    path: 'admin-pannel',
    component: AdminPannelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'crud',
    canActivate: [AuthGuard],
    children: [
      { path: 'list-user', component: ListUsersComponent },
      { path: 'read-user/:id', component: SingleUserInfoComponent },
      { path: 'create-user', component: CreateUserComponent },
      { path: 'update-user/:id', component: UpdateUserComponent },
      { path: 'delete-user/:id', component: ListUsersComponent }
    ]
  },
  {
    path: '**',
    component: HomeComponent
  }
];
