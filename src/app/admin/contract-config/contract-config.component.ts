import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sale } from 'src/app/models/sale.model';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-contract-config',
  templateUrl: './contract-config.component.html',
  styleUrls: ['./contract-config.component.css'],
})
export class ContractConfigComponent implements OnInit {
  sale: Sale;
  contractAddress: string = '';
  isSuccess = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    private snackBar: MatSnackBar,
    private backendService: BackendService,
    private dialogRef: MatDialogRef<ContractConfigComponent>
  ) {}

  ngOnInit(): void {
    this.sale = this.passedData.sale;
  }

  onSetActive(){
    if(this.contractAddress.length == 42){
      this.isSuccess = true;
      this.backendService.onSetActiveSale(this.sale.id, this.contractAddress);
      this.closeDialog(this.isSuccess);
    }
    else{
      this.isSuccess = false;
      this.closeDialog(this.isSuccess);
      this.snackBar.open('Transaction Failed, Contract Address should be valid', 'close', {
        duration: 3000,
        panelClass: ['red-snackbar'],
      });
    }
  }

  closeDialog(status: boolean) {
    this.dialogRef.close(status);
  }
}
