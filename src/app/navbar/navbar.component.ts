import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  menuClicked = false;
  menuIcon = 'menu';
  subscriptions: Subscription [] = [];
  account: string = '';

  constructor(private walletService: WalletService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.walletService.accountsChange.subscribe((account) => {
        this.account = account;
      })
    );
  }

  onMenuClicked(){

    if(this.menuClicked == false){
      this.menuClicked = !this.menuClicked;
      this.menuIcon='close';
    }
    else {
      this.menuClicked = !this.menuClicked;
      this.menuIcon='menu';
    }

  }


  onConnectWallet(){
    this.walletService.connectWallet();
  }

}
