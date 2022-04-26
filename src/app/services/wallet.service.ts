import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { LoadContractService } from './utils/loadcontract.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Presale } from '../models/presale.model';

declare const window: any;

@Injectable({ providedIn: 'root' })
export class WalletService {
  constructor(
    private lcService: LoadContractService,
    private snackBar: MatSnackBar
  ) {}

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
  labFeeChanged = new Subject<number>();
  isApproved = false;
  approvedChange = new Subject<boolean>();
  onSubmitChange = new Subject<void>();
  isLoading = false;
  loadingChange = new Subject<boolean>();

  //PRESALE

  presale: Presale;
  presaleChange = new Subject<Presale>();

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
    this.ierc20Contract = await this.lcService.loadIERC20Contract(
      this.provider
    );
    this.ticketContract = await this.lcService.loadTicketContract(
      this.provider
    );

    this.web3Api = {
      provider: this.web3Api.provider,
      web3: this.web3Api.web3,
      contract: this.ierc20Contract,
    };
    this.Web3Change.next(this.web3Api);

    await this.ticketContract.labFee().then((result: any) => {
      this.labFee = result.toString();
      this.labFeeChanged.next(
        this.web3Api.web3.utils.fromWei(this.labFee, 'ether')
      );
    });
    this.checkIfApproved();
  }

  async checkIfApproved() {
    await this.web3Api.contract
      .allowance(this.account, this.ticketContract.address)
      .then((result: any) => {
        const allowance = result.toString();
        if (+allowance < +this.labFee) {
          this.isApproved = false;
          this.approvedChange.next(this.isApproved);
        } else {
          this.isApproved = true;
          this.approvedChange.next(this.isApproved);
        }
      });
  }

  //IERC20 Contract Interactions

  async onApproveTransaction() {
    this.isLoading = true;
    this.loadingChange.next(this.isLoading);
    try {
      await this.web3Api.contract.approve(
        this.ticketContract.address,
        this.labFee,
        {
          from: this.account,
        }
      );
      this.openSuccessSnackBar('Transaction Completed', 'close');
      this.checkIfApproved();
      this.isLoading = false;
      this.loadingChange.next(this.isLoading);
    } catch (error: any){
      this.openFailedSnackBar(
        error.message,
        'close'
      );
      this.isLoading = false;
      this.loadingChange.next(this.isLoading);
    }
  }

  async onSendLabTokens() {
    this.isLoading = true;
    this.loadingChange.next(this.isLoading);
    try {
      await this.ticketContract.transferLabFee({ from: this.account });
      this.openSuccessSnackBar('Transaction Completed', 'close');
      this.checkIfApproved();
      this.onSubmitChange.next();
      this.isLoading = false;
      this.loadingChange.next(this.isLoading);
    } catch(error: any){
      this.openFailedSnackBar(
        error.message,
        'close'
      );
      this.isLoading = false;
      this.loadingChange.next(this.isLoading);
    }
  }

  // LOAD PRESALE CONTRACTS

  // async loadAllCrowdsale(){
  //   this.loadEtherPresaleContract();
  // }

  async loadPresaleContract(tokenAddress: string, crowdsaleAddress: string) {
    let ierc20Contract = await this.lcService.loadPresaleTokenContract(
      this.provider,
      tokenAddress
    );
    let crowdsaleContract = await this.lcService.loadCrowdSaleContract(
      this.provider,
      crowdsaleAddress
    );

    this.web3Api = {
      provider: this.web3Api.provider,
      web3: this.web3Api.web3,
      contract: crowdsaleContract,
    };
    this.Web3Change.next(this.web3Api);

    let _isPresaleStop;
    let _croHardcap;
    let _croRaised;
    let _startTime;
    let _endTime;
    let _hasMaxMinAlloc;
    let _maxAlloc;
    let _minAlloc;
    let _presaleParticipation;
    let _soldTokens;
    let _tokenHardcap;

    let presale: Presale;

    await this.web3Api.contract.isPresaleStop().then((result: any) => {
      _isPresaleStop = result;
      presale = { ...presale, isPresaleStop: _isPresaleStop };
    });
    await this.web3Api.contract.croHardcap().then((result: any) => {
      _croHardcap = this.web3Api.web3.utils.fromWei(result.toString(), 'ether');
      presale = { ...presale, croHardcap: _croHardcap };
    });
    await this.web3Api.contract.croRaised().then((result: any) => {
      _croRaised = this.web3Api.web3.utils.fromWei(result.toString(), 'ether');
      presale = { ...presale, croRaised: _croRaised };
    });
    await this.web3Api.contract.startTime().then((result: any) => {
      _startTime = result.toString();
      presale = { ...presale, startTime: _startTime };
    });
    await this.web3Api.contract.endTime().then((result: any) => {
      _endTime = result.toString();
      presale = { ...presale, endTime: _endTime };
    });
    await this.web3Api.contract.hasMaxMinAlloc().then((result: any) => {
      _hasMaxMinAlloc = result;
      presale = { ...presale, hasMaxMinAlloc: _hasMaxMinAlloc };
    });
    await this.web3Api.contract.maxAlloc().then((result: any) => {
      _maxAlloc = this.web3Api.web3.utils.fromWei(result.toString(), 'ether');
      presale = { ...presale, maxAlloc: _maxAlloc };
    });
    await this.web3Api.contract.minAlloc().then((result: any) => {
      _minAlloc = this.web3Api.web3.utils.fromWei(result.toString(), 'ether');
      presale = { ...presale, minAlloc: _minAlloc };
    });
    await this.web3Api.contract
      .presaleParticipation(this.account)
      .then((result: any) => {
        _presaleParticipation = this.web3Api.web3.utils.fromWei(
          result.toString(),
          'ether'
        );
        presale = { ...presale, presaleParticipation: _presaleParticipation };
      });
    await this.web3Api.contract.soldTokens().then((result: any) => {
      _soldTokens = this.web3Api.web3.utils.fromWei(result.toString(), 'ether');
      presale = { ...presale, soldTokens: _soldTokens };
    });
    await this.web3Api.contract.tokenHardcap().then((result: any) => {
      _tokenHardcap = this.web3Api.web3.utils.fromWei(
        result.toString(),
        'ether'
      );
      presale = { ...presale, tokenHardcap: _tokenHardcap };
      this.presale = presale;
      this.presaleChange.next(this.presale);
    });
  }

  async depositCro(value: string, tokenAddress: string, crowdsaleAddress: string) {
    this.isLoading = true;
    this.loadingChange.next(this.isLoading);
    try{
      await this.web3Api.contract.presaleBuy({
        from: this.account,
        value: this.web3Api.web3.utils.toWei(value, 'ether'),
      });
      await this.loadPresaleContract(tokenAddress, crowdsaleAddress);
      this.isLoading = false;
      this.loadingChange.next(this.isLoading);
      this.openSuccessSnackBar(
        'Transaction Completed, CRO deposited successfully','close'
      );
    }
    catch(error: any){
      this.openFailedSnackBar(
        error.message,'close'
      );
      this.isLoading = false;
      this.loadingChange.next(this.isLoading);
    }
  }

  async claimCro(tokenAddress: string, crowdsaleAddress: string) {
    this.isLoading = true;
    this.loadingChange.next(this.isLoading);
    try{
      await this.web3Api.contract.claimPresale({from: this.account});
      await this.loadPresaleContract(tokenAddress, crowdsaleAddress);
      this.isLoading = false;
      this.loadingChange.next(this.isLoading);
      this.openSuccessSnackBar(
        'Transaction Completed, Tokens claimed successfully','close'
      );
    }
    catch(error: any){
      this.openFailedSnackBar(
        error.message,'close'
      );
      this.isLoading = false;
      this.loadingChange.next(this.isLoading);
    }

  }
}
