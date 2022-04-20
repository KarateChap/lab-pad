import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { LoadContractService } from './utils/loadcontract.service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare const window: any;

@Injectable({ providedIn: 'root' })
export class WalletService {
  constructor(private lcService: LoadContractService, private snackBar: MatSnackBar) {}

  web3Api: any = { provider: null, web3: null, contract: null };
  Web3Change = new Subject<any>();
  account: string = '';
  accountsChange = new Subject<any>();
  shouldReload = false;
  reloadChange = new Subject<boolean>();
  provider: any;
  canConnectToContract = this.account && this.web3Api.contract;


  // Lab Token Sale Application
  ierc20Contract: any;
  ticketContract: any;
  labFee: any;
  labFeeChanged = new Subject<boolean>();
  isApproved = false;
  approvedChange = new Subject<boolean>();
  onSubmitChange = new Subject<void>();

  openSuccessSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['green-snackbar'],
    });
  }
  openFailedSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['green-snackbar'],
    });
  }

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
    this.provider = await detectEthereumProvider();

    if (this.provider) {
      this.setAccountListener(this.provider);
      this.provider.request({ method: 'eth_requestAccounts' });
      this.web3Api = { web3: new Web3(this.provider), provider: this.provider };
      this.Web3Change.next(this.web3Api);
      this.canConnectToContract = this.account && this.web3Api.contract;
      this.getAccount();
      console.log(this.web3Api);
    } else {
      console.error('Please install Metamask.');
    }
  }

  async getAccount() {
    const accounts = await this.web3Api.web3.eth.getAccounts();
    this.account = accounts[0];
    this.accountsChange.next(this.account);
  }

  async changeContractToIERC() {
    this.ierc20Contract = await this.lcService.loadIERC20Contract(this.provider);
    this.ticketContract = await this.lcService.loadTicketContract(this.provider);

    this.web3Api = {
      provider: this.web3Api.provider,
      web3: this.web3Api.web3,
      contract: this.ierc20Contract,
    };
    this.Web3Change.next(this.web3Api);

    await this.ticketContract.labFee().then((result: any) => {
      this.labFee = result.toString();
      this.labFeeChanged.next(this.web3Api.web3.utils.fromWei(this.labFee, 'ether'));
    });

    this.checkIfApproved();

  }

  async checkIfApproved(){
    await this.web3Api.contract.allowance(this.account, this.ticketContract.address).then((result: any) => {
      const allowance = result.toString();
      if(+allowance < +this.labFee){
        this.isApproved = false;
        this.approvedChange.next(this.isApproved);
      }
      else {
        this.isApproved = true;
        this.approvedChange.next(this.isApproved);
      }
    })
  }

  //IERC20 Contract Interactions

  async onApproveTransaction() {
    try{
      await this.web3Api.contract.approve(this.ticketContract.address, this.labFee, {
        from: this.account,
      });
      this.openSuccessSnackBar("Transaction Completed", "close");
      this.checkIfApproved();
    }
    catch{
      this.openFailedSnackBar("Transaction Failed, You need to approve the transaction to submit your application", "close");
    }
  }

  async onSendLabTokens(){
    try{
      await this.ticketContract.transferLabFee({from: this.account});
      this.openSuccessSnackBar("Transaction Completed", "close");
      this.checkIfApproved();
      this.onSubmitChange.next();
      console.log("OCCURENCE")
    }
    catch{
      this.openFailedSnackBar("Transaction Failed, You will need to have atleast " + this.web3Api.web3.utils.fromWei(this.labFee, 'ether') + " LAB tokens to submit your application", "close");
    }
  }




}
