import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { User } from '../interfaces/user.model';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

export interface AuthStoredData {
  userId: string;
  token: string;
  tokenExpirationDate: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;
  private signupUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  private signinUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

  constructor(private http: HttpClient) { }
  get userIsAuthenticated() {
    return this._user.asObservable()
      .pipe(
        map(user => {
          if (user) {
            return !!user.token; // convert to boolean
          } else {
            return false;
          }
        }));
  }
  get userId() {
    return this._user.asObservable()
      .pipe(
        map(user => {
          if (user) {
            return user.userId;
          } else {
            return null;
          }
        }));
  }

  get token() {
    return this._user.asObservable()
      .pipe(
        map(user => {
          if (user) {
            return user.token;
          } else {
            return null;
          }
        }));
  }

  get user() {
    return this._user.asObservable()
      .pipe(
        map(user => {
          if (user) {
            return user;
          } else {
            return null;
          }
        }));
  }


  autoLogin() {
    return from(Plugins.Storage
      .get({ key: 'authData' }))
      .pipe(map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const parsedData = JSON.parse(storedData.value) as {
          userId: string;
          token: string;
          tokenExpirationDate: string;
          email: string;
        };

        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
        tap(user => {
          if (user) {
            this._user.next(user);
            console.log(user);
          }
        }),
        map(user => {
          this.autoLogout(user.tokenDuration);
          return !!user;  // return boolean
        })
      );
  }




  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(`${ this.signupUrl }${ environment.firebaseAPIKey }`,
        {
          email,
          password,
          returnSecureToken: true
        })
      .pipe(
        tap(
          this.setUserData.bind(this)
        )
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(`${ this.signinUrl }${ environment.firebaseAPIKey }`,
        {
          email,
          password,
          returnSecureToken: true
        })
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this.clearTimeout();
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }


  private autoLogout(duration: number) {
    this.clearTimeout();
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private clearTimeout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
  private setUserData(userData: AuthResponseData) {
    const expirationTime =
      new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    const data: AuthStoredData = {
      userId: userData.localId,
      token: userData.idToken,
      tokenExpirationDate: expirationTime.toISOString(),
      email: userData.email
    };
    this.storeAuthData(data);
  }

  private storeAuthData(storedData: AuthStoredData) {
    const data = JSON.stringify(storedData);
    Plugins.Storage.set({
      key: 'authData',
      value: data
    });
  }
}
