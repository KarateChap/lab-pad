import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewSale } from '../models/new-sale.model';

@Injectable({ providedIn: 'root' })
export class BackendService {
  constructor(private af: AngularFirestore, private snackBar: MatSnackBar) {}


  addTokenSale(sale: NewSale) {
    this.af.collection('sale').add(sale);
    this.snackBar.open("Token Sale Information Submitted!", "close", {
      duration: 2000,
      panelClass: ['green-snackbar']
    });
  }
}
