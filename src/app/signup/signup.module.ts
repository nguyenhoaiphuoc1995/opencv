import { NgModule } from '@angular/core';
import { SignupComponent } from './signup.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  declarations: [
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    RouterModule,
    WebcamModule
  ],
  providers: [],
  bootstrap: [SignupComponent]
})
export class SignupModule { }