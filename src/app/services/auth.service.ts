import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthData } from "../models/auth-data.model";

@Injectable({ providedIn: 'root' })

export class AuthService {
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private snackBar: MatSnackBar
  ) {}

  initAuthListener() {
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/launchpad']);
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
        this.isAuthenticated = true;
        this.router.navigate(['/admin']);
        this.openSnackBar('Login Successful!', 'close');
      })
      .catch((error: any) => {
        this.openSnackBar(error, 'close');
      });
  }

  openSnackBar(message: string, action: string){
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['green-snackbar']
    });
  }


  logout() {
    this.afauth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
