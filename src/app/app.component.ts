import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'lab-launchpad';
  canConnectToContract = false;
  account: string = '';
  subscriptions: Subscription[] = [];
  constructor(private walletService: WalletService){

  }

ngOnInit(): void {

  this.canConnectToContract = this.walletService.canConnectToContract;
  this.walletService.connectWallet();

  this.subscriptions.push(
    this.walletService.accountsChange.subscribe((account) => {
      this.account = account;
    })
  );
}

ngOnDestroy(): void {
  this.subscriptions.forEach((element) => {
    element.unsubscribe();
  });
}
}
