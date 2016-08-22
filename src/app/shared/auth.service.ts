import { Injectable, EventEmitter } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/toPromise";

import { Speaker, Credentials } from './speaker.model';
import { handleError, parseJson, packageForPost } from './http-helpers';

@Injectable()
export class AuthService {

  // Assume admin until auth is implemented
  user = {admin: true};

  creds: Credentials = {loggedIn: false, user: null};
  logEvent = new EventEmitter<Credentials>();

  constructor(private http: Http,
              private router: Router) { }

	checkCreds() {
		return this.http
              .get('/auth/checkCreds')
              .toPromise()
              .then(parseJson)
              .then(res => {
                this.creds = res;
                this.logEvent.emit(this.creds);
                return this.creds;
              })
              .catch(handleError);
	}

  logout() {
    return this.http
              .get('/auth/logout')
              .toPromise()
              .then(parseJson)
              .then(res => {
                this.creds = {loggedIn: false, user: null};
                this.logEvent.emit(this.creds);
                return res;
              })
              .catch(handleError);
  }

  login(email: string, pass: string) {
    let data = {
      email: email,
      password: pass
    };
    let pkg = packageForPost(data);
    return this.http
              .post('/login', pkg.body, pkg.opts)
              .toPromise()
              .then(parseJson)
              .catch(handleError);
  }
  
  signup(formData) {
    let pkg = packageForPost(formData);
    return this.http
              .post('/signup', pkg.body, pkg.opts)
              .toPromise()
              .then(parseJson)
              .catch(handleError);
  }

}