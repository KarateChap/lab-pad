import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

declare const window: any;

@Injectable({ providedIn: 'root' })
export class WalletService {
  constructor() {}

  web3Api: any = { provider: null, web3: null, contract: null };
  Web3Change = new Subject<any>();
  account: string = '';
  accountsChange = new Subject<any>();
  shouldReload = false;
  reloadChange = new Subject<boolean>();

  canConnectToContract = this.account && this.web3Api.contract;

  reload() {
    this.shouldReload = !this.shouldReload;
  }

  setAccountListener(provider: any) {
    provider.on('accountsChanged', (accounts: any) => {
      window.location.reload();
    });
    provider.on('chainChanged', (accounts: any) => {
      window.location.reload();
    });
  }

  async connectWallet() {
    let provider: any = await detectEthereumProvider();

    if (provider) {
      this.setAccountListener(provider);
      provider.request({ method: 'eth_requestAccounts' });
      this.web3Api = { web3: new Web3(provider), provider};
      this.Web3Change.next(this.web3Api);
      this.canConnectToContract = this.account && this.web3Api.contract;
      this.getAccount();
    } else {
      console.error('Please install Metamask.');
    }
  }

  async getAccount() {
    const accounts = await this.web3Api.web3.eth.getAccounts();
    this.account = accounts[0];
    this.accountsChange.next(this.account);
  }

}
