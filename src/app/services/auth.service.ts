import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AuthData } from "../models/auth-data.model";

@Injectable({ providedIn: 'root' })

export class AuthService {
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
  ) {}

  initAuthListener() {
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.router.navigate(['/sidenav']);
      } else {
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  };

  registerUser(authData: AuthData) {
    this.afauth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result: any) => {
      })
      .catch((error: any) => {
      });
  }

  login(authData: AuthData) {
    this.afauth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result: any) => {
      })
      .catch((error: any) => {
      });
  }

  logout() {
    this.afauth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
