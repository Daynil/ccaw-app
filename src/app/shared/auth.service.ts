import { Injectable, EventEmitter } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/toPromise";

import { Speaker, Credentials } from './speaker.model';
import { handleError, parseJson, packageForPost } from './http-helpers';

@Injectable()
export class AuthService {

  //user: {speaker: Speaker};
  user: BehaviorSubject<Speaker> = new BehaviorSubject(null);

  constructor(private http: Http,
              private router: Router) { }

	checkCreds() {
		return this.http
              .get('/checkCreds')
              .toPromise()
              .then(parseJson)
              .catch(handleError);
	}

  logout() {
    return this.http
              .get('/logout')
              .toPromise()
              .then(res => {
                this.user.next(null);
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
              .then(user => {
                this.user.next(user);
                return user;
              })
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