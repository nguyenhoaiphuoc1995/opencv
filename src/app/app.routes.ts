import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/authguard';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' }
    },
    {
        path: 'signup',
        component: SignupComponent,
        data: { title: 'Sign Up' }
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' },
    },
    { path: '', redirectTo: '', pathMatch: 'full' },
];
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(
          appRoutes,
          { enableTracing: true } // <-- debugging purposes only
        )
      ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
