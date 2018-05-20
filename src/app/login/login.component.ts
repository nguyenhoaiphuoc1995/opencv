import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
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

  handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    let dataObj = {
      img: this.webcamImage,
      isRegconitionImg: false,
      username: this.loginData.username
    };
    this.http.post('/api/img/store', dataObj)
      .subscribe((res) => {
        console.log(res);
      });
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  login() {
    this.http.post('/api/signin', this.loginData).subscribe(resp => {
      this.data = resp;
      localStorage.setItem('jwtToken', this.data.token);
      this.router.navigate(['dashboard']);
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
