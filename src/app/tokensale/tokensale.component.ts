import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Presale } from '../models/presale.model';
import { Sale } from '../models/sale.model';
import { BackendService } from '../services/backend.service';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'app-tokensale',
  templateUrl: './tokensale.component.html',
  styleUrls: ['./tokensale.component.css'],
})
export class TokensaleComponent implements OnInit, OnDestroy {
  activeTokenSaleId: string;
  activeTokenSale: Sale;
  subscription: Subscription[] = [];
  isLoading = true;
  isLoading2 = false;
  presale: Presale;
  endTime: any;
  currentDate: Date;
  currentTimeStamp: any;
  croValue: any;
  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private walletService: WalletService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date();
    this.currentTimeStamp = (this.currentDate.getTime() / 1000).toFixed(0);
    console.log(this.currentTimeStamp + ' CURRENT TIME STAMP');

    this.activeTokenSaleId = this.route.snapshot.params['id'];
    this.isLoading = true;
    this.backendService.fetchActiveTokenSale(this.activeTokenSaleId);
    this.subscription.push(
      this.backendService.activeSaleChanged.subscribe((sale) => {
        this.activeTokenSale = sale;
        this.walletService.loadPresaleContract(
          sale.tokenAddress,
          sale.crowdsaleContract
        );
      })
    );

    this.subscription.push(
      this.walletService.presaleChange.subscribe((presale) => {
        this.presale = presale;
        this.isLoading = false;
        this.endTime = new Date(
          +presale.endTime.toString() * 1000
        ).toLocaleDateString('en-US');
        console.log(this.presale.endTime + ' CONTRACT END TIME');
      })
    );

    this.subscription.push(
      this.walletService.loadingChange.subscribe((isLoading) => {
        this.isLoading2 = isLoading;
      })
    );
  }

  onClaimOrDeposit() {
    if (this.currentTimeStamp < this.presale.endTime) {
      if (this.presale.hasMaxMinAlloc) {
        if (
          this.croValue >= this.presale.minAlloc &&
          this.croValue <= this.presale.maxAlloc
        ) {
          this.walletService.depositCro(
            this.croValue,
            this.activeTokenSale.tokenAddress,
            this.activeTokenSale.crowdsaleContract
          );
        } else {
          this.openFailedSnackBar(
            'Value cannot be less than the minimum and cannot be greated than the maximum allocation',
            'Close'
          );
        }
      } else {
        if (this.croValue < 0) {
          this.openFailedSnackBar('Value cannot be less than 0', 'Close');
        } else {
          this.walletService.depositCro(
            this.croValue,
            this.activeTokenSale.tokenAddress,
            this.activeTokenSale.crowdsaleContract
          );
        }
      }
    } else {
      this.walletService.claimCro(
        this.activeTokenSale.tokenAddress,
        this.activeTokenSale.crowdsaleContract
      );
    }
  }

  openSuccessSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['green-snackbar'],
    });
  }
  openFailedSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['red-snackbar'],
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((element) => {
      element.unsubscribe();
    });
  }
}
