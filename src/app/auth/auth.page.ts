import { Component, OnInit } from '@angular/core';
import { AuthResponseData, AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: [ './auth.page.scss' ],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  // Require that at least one digit appear anywhere in the string
  // Require that at least one lowercase letter appear anywhere in the string
  // Require that at least one uppercase letter appear anywhere in the string

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.router.navigateByUrl('/lessons/tabs/amherst-toc/new');
    this.isLoading = true;
    // this.authService.login();
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Authenticating, please wait...'
      })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(res => {
          console.log(res);
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/lessons/tabs/amherst-done');
        }, errorRes => {
          loadingEl.dismiss();
          const code = errorRes.error.error.message;
          console.log(code);
          let message = 'Could not sign you in, please try again';
          if (code === 'EMAIL_EXISTS') {
            message = 'This email address exists already!';
          } else if (code === 'EMAIL_NOT_FOUND') {
            message = 'This email was not found!';

          } else if (code === 'INVALID_PASSWORD') {
            message = 'This email or password do not match!';
          }
          this.showAlert(message);
        });
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const pwd = form.value.password;
    this.authenticate(email, pwd);
    form.reset();
  }

  onSwitchAuthMode() {
    this.isLogin = !(this.isLogin);
  }

  private showAlert(message: string) {
    console.log(message);
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message,
        buttons: [ 'Okay' ]
      })
      .then(alertEl => alertEl.present());
  }
}
