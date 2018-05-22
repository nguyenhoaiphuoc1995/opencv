import { Component, OnInit, ViewChild } from '@angular/core';
import {WebcamImage} from 'ngx-webcam';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  constructor(
    private _router: Router,
    private http: HttpClient
  ) {};


  title = 'app';
  isOpen: boolean = false;
  stream;

  

  login() {
    this._router.navigate(['login']);
  }

  signup() {
    this._router.navigate(['signup']);
  }
}
