import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationComponent } from './application/application.component';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css'],
})
export class TermsComponent implements OnInit {
  termsForm: FormGroup;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.termsForm = new FormGroup({
      chk1: new FormControl(false, Validators.requiredTrue),
      chk2: new FormControl(false, Validators.requiredTrue),
      chk3: new FormControl(false, Validators.requiredTrue),
      chk4: new FormControl(false, Validators.requiredTrue),
      chk5: new FormControl(false, Validators.requiredTrue),
      chk6: new FormControl(false, Validators.requiredTrue),
      chk7: new FormControl(false, Validators.requiredTrue),
      chk8: new FormControl(false, Validators.requiredTrue),
      chk9: new FormControl(false),
    });
  }

  agreeAll(event: any) {
    if (event.checked == true) {
      this.termsForm.patchValue({
        chk1: true,
        chk2: true,
        chk3: true,
        chk4: true,
        chk5: true,
        chk6: true,
        chk7: true,
        chk8: true,
      });
    } else {
      this.termsForm.patchValue({
        chk1: false,
        chk2: false,
        chk3: false,
        chk4: false,
        chk5: false,
        chk6: false,
        chk7: false,
        chk8: false,
        chk9: false,
      });
    }
  }

  checkAll(event: any) {
    if(this.termsForm.valid){
      this.termsForm.patchValue({chk9: true});
    }
    else {
      this.termsForm.patchValue({chk9: false});
    }
  }

  onSubmit() {
    this.dialog.open(ApplicationComponent)
  }
}
