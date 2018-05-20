import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    private http: HttpClient, private router: Router
  ) { }
  signupData = { username: '', password: '' };
  message = '';
  showWebcam = false;
  ngOnInit() {
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
      console.log("cond");
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });
  }

  signup() {
    this.http.post('/api/signup', this.signupData).subscribe(resp => {
      this.router.navigate(['login']);
    }, err => {
      this.message = err.error.msg;
    });
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
      isRegconitionImg: true,
      username: this.signupData.username,
      isUserLogin: false
    };
    this.http.post('/api/img/store', dataObj)
      .subscribe((res) => {
        console.log(res);
      });
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

}
