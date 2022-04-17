import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { NewSale } from '../models/new-sale.model';
import { Sale } from '../models/sale.model';

@Injectable({ providedIn: 'root' })
export class BackendService {

  sale: Sale[] = [];
  saleChanged = new Subject<Sale[]>();
  constructor(private af: AngularFirestore, private snackBar: MatSnackBar) {}


  addTokenSale(sale: NewSale) {
    this.af.collection('sale').add(sale);
    this.snackBar.open("Token Sale Information Submitted!", "close", {
      duration: 2000,
      panelClass: ['green-snackbar']
    });
  }

  fetchSale(status: string) {
    this.af
      .collection('sale')
      .ref.where('status', '==', status)
      .onSnapshot((result) => {
        this.sale = [];
        result.forEach((doc) => {
          this.sale.push({ id: doc.id, ...(doc.data() as NewSale) });
        });
        this.saleChanged.next(this.sale);
      });
  }

  onAcceptSale(id: string) {
    this.af.doc('sale/' + id).update({ status: 'accepted' });
    this.openSnackBar('Sale Accepted Successfully', 'close')
  }

  onSetActiveSale(id: string) {
    this.af.doc('sale/' + id).update({ status: 'active' });
    this.openSnackBar('Sale Set to Active Successfully', 'close')
  }

  onSetCompletedSale(id: string){
    this.af.doc('sale/' + id).update({ status: 'completed' });
    this.openSnackBar('Sale Set to Completed Successfully', 'close')
  }
  onRejectSale(id: string){
    this.af.doc('sale/' + id).update({ status: 'rejected' });
    this.openSnackBar('Sale Rejected Successfully', 'close')
  }

  onSetPendingSale(id: string){
    this.af.doc('sale/' + id).update({ status: 'pending' });
    this.openSnackBar('Sale Set to Pending Successfully', 'close')
  }

  openSnackBar(message: string, action: string){
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['green-snackbar']
    });
  }

}
