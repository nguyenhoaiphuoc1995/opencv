import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { LoginComponent } from "../login/login.component";

@Injectable()
export class AuthGuard {

  constructor(private router : Router ) {
  }

  canActivate( route : ActivatedRouteSnapshot, state : RouterStateSnapshot ) {
    // if (this.authService.isLoggedIn()) 
    //     return true;
    // else navigate to login
    console.log(sessionStorage.getItem('user'))
    console.log(2)
    return sessionStorage.getItem('user') ? true : false;
  }
}