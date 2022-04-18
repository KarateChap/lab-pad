import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sale } from 'src/app/models/sale.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent2 implements OnInit {
  sale: Sale;
  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sale = this.passedData.sale;
  }

  onCopyText() {
    this.snackBar.open('Text Copied to Clipboard', 'close', {
      duration: 3000,
      panelClass: ['green-snackbar'],
    });
  }
}
