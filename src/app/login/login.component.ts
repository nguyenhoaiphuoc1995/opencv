import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/publishReplay'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private http: HttpClient, private router: Router,
  ) { }
  loginData = { username: '', password: '' };
  message = '';
  data;
  showWebcam;
  ngOnInit() {

  }

  public webcamImage: WebcamImage = null;

  private trigger: Subject<void> = new Subject<void>();


  public triggerSnapshot(): void {
    this.trigger.next();
  }

  toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  handleImage(webcamImage: WebcamImage, isLogin): void {
    this.webcamImage = webcamImage;

    let dataObj = {
      img: this.webcamImage,
      isRegconitionImg: false,
      username: this.loginData.username,
      isUserLogin: isLogin
    };
    this.http.post('/api/img/store', dataObj);

  }

  // takePicture(itemData) {
  //   var observable = this.http.post('/api/img/store', itemData)
  //       .map(response => response) // in case you care about returned json       
  //       .publishReplay(); // would be .publish().replay() in RxJS < v5 I guess
  //   observable.connect();
  //   return observable;

  // }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  login() {
    this.loginData['img'] = this.webcamImage;
    this.loginData['isRegconitionImg'] = false;
    this.loginData['isUserLogin'] = true;
    let observable = this.http.post('/api/signin', this.loginData).subscribe(resp => {
      window.addEventListener("beforeunload", function (e) {
        var confirmationMessage = "\o/";
        console.log("cond");
        e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
        return confirmationMessage;              // Gecko, WebKit, Chrome <34
      });

      observable.unsubscribe();

      this.data = resp;
      localStorage.setItem('jwtToken', this.data.token);
      console.log(resp)
      if (resp['success']) {
        this.message = "Successful login";
        this.router.navigate(['dashboard']);
      } else {
        this.message = "Error";
        this.router.navigate(['login']);
      }

    }, err => {
      this.message = err.error.msg;
    });
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
