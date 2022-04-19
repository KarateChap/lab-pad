import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
})
export class ApplicationComponent implements OnInit {
  applicationForm: FormGroup;
  today: Date = new Date();
  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
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
    });
  }

  onSubmit() {
    this.backendService.addTokenSale({
      email: this.applicationForm.value.email,
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
    });
  }
}
