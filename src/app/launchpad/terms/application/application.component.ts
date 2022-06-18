import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, take} from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { WalletService } from 'src/app/services/wallet.service';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
})
export class ApplicationComponent implements OnInit, OnDestroy {
  applicationForm: FormGroup;
  today: Date = new Date();
  isApproved = false;
  subscription: Subscription[] = [];
  labFee: number;
  isLoading = false;
  account: string = '';
  hasWhitelist = false;
  csvFileName = '';
  addresses: string [] = [];
  constructor(
    private backendService: BackendService,
    private walletService: WalletService,
    private dialogRef: MatDialogRef<ApplicationComponent>,
    private ngxCsvParser: NgxCsvParser,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.walletService.connectWallet();
    this.subscription.push(
      this.walletService.accountsChange.subscribe((account) => {
        this.account = account;
      })
    );
    this.walletService.changeContractToIERC();
    this.subscription.push(
      this.walletService.approvedChange.subscribe((isApproved) => {
        this.isApproved = isApproved;
      })
    );
    this.subscription.push(
      this.walletService.labFeeChanged.pipe(take(1)).subscribe((labFee) => {
        this.labFee = +labFee;
      })
    );

    this.subscription.push(
      this.walletService.loadingChange.subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    )

    this.today = new Date(this.today.setDate(this.today.getDate() + 7));
    this.applicationForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      projectName: new FormControl('', Validators.required),
      websiteLink: new FormControl('', Validators.required),
      projectDescription: new FormControl('', Validators.required),
      logoUrl: new FormControl('', Validators.required),
      tokenName: new FormControl('', Validators.required),
      tokenSymbol: new FormControl('', Validators.required),
      tokenAddress: new FormControl('', Validators.required),
      tokenSupply: new FormControl('', {
        validators: [Validators.required, Validators.pattern(/^[0-9]*$/)],
      }),
      salePrice: new FormControl('', {
        validators: [Validators.required, Validators.pattern(/^[0-9]*$/)],
      }),
      startDate: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      duration: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
          Validators.maxLength(1),
        ],
      }),
      hasMaxMin: new FormControl(false),
      hasWhitelist: new FormControl(false),
    });

    this.subscription.push(this.walletService.onSubmitChange.subscribe(() => {
      this.onSubmit();
    }))
  }

  onMaxMinChange(event: any){
    if(this.applicationForm.value.hasMaxMin == true){
      this.applicationForm.addControl('maxAlloc', new FormControl('', {validators: [Validators.required, Validators.pattern(/^[0-9]*$/)]}));
      this.applicationForm.addControl('minAlloc', new FormControl('', {validators: [Validators.required, Validators.pattern(/^[0-9]*$/)]}));
    }else {
      this.applicationForm.removeControl('maxAlloc');
      this.applicationForm.removeControl('minAlloc');
    }
  }

  onHasWhitelist(event: any){
    this.hasWhitelist = event.checked;
    if(this.hasWhitelist == false){
      this.csvFileName = '';
    }
    else {
      this.snackBar.open('Upload a CSV file with no header that contains only 1 tab with all the Whitelisted Addresses', 'close', {
        panelClass: ['green-snackbar'],
      });
    }
  }

  fileChangeListener(event: any){
    const files = event.srcElement.files;

    this.ngxCsvParser
    .parse(files[0], { header: false, delimiter: ',' })
    .pipe()
    .subscribe((result: any) => {

      this.addresses = [];
      result.forEach((element: any) => {
        this.addresses.push(element[0]);
      });
      this.csvFileName = event.target.files[0].name;
    }),(error: NgxCSVParserError) => {
      console.log('Error', error);
    }
  }

  onConnectWallet(){
    this.walletService.connectWallet();
  }

  onApproveTransaction() {
    if (this.isApproved) {
      this.walletService.onSendLabTokens();
    } else {
      this.walletService.onApproveTransaction();
    }
  }

  onSubmit() {
    if(this.applicationForm.value.hasMaxMin == false){
      this.backendService.addTokenSale({
        email: this.applicationForm.value.email.toLowerCase(),
        projectName: this.applicationForm.value.projectName,
        websiteLink: this.applicationForm.value.websiteLink,
        projectDescription: this.applicationForm.value.projectDescription,
        logoUrl: this.applicationForm.value.logoUrl,
        tokenName: this.applicationForm.value.tokenName,
        tokenSymbol: this.applicationForm.value.tokenSymbol,
        tokenAddress: this.applicationForm.value.tokenAddress,
        tokenSupply: this.applicationForm.value.tokenSupply,
        salePrice: this.applicationForm.value.salePrice,
        startDate: this.applicationForm.value.startDate,
        startTime: this.applicationForm.value.startTime,
        duration: this.applicationForm.value.duration,
        status: 'pending',
        hasMaxMin: this.applicationForm.value.hasMaxMin,
        hasWhitelist: this.hasWhitelist,
        addresses: this.addresses,
        crowdsaleContract: ''
      });
    }
    else {
      this.backendService.addTokenSale({
        email: this.applicationForm.value.email.toLowerCase(),
        projectName: this.applicationForm.value.projectName,
        websiteLink: this.applicationForm.value.websiteLink,
        projectDescription: this.applicationForm.value.projectDescription,
        logoUrl: this.applicationForm.value.logoUrl,
        tokenName: this.applicationForm.value.tokenName,
        tokenSymbol: this.applicationForm.value.tokenSymbol,
        tokenAddress: this.applicationForm.value.tokenAddress,
        tokenSupply: this.applicationForm.value.tokenSupply,
        salePrice: this.applicationForm.value.salePrice,
        startDate: this.applicationForm.value.startDate,
        startTime: this.applicationForm.value.startTime,
        duration: this.applicationForm.value.duration,
        status: 'pending',
        hasMaxMin: this.applicationForm.value.hasMaxMin,
        maxAlloc: this.applicationForm.value.maxAlloc,
        minAlloc: this.applicationForm.value.minAlloc,
        hasWhitelist: this.hasWhitelist,
        addresses: this.addresses,
        crowdsaleContract: ''
      });
    }

    this.applicationForm.reset();
    this.dialogRef.close()
  }

  ngOnDestroy(): void {
    this.subscription.forEach(element => {
      element.unsubscribe();
    });
  }
}
