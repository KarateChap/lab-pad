import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Sale } from '../models/sale.model';
import { BackendService } from '../services/backend.service';
import { DetailsComponent2 } from './details/details.component';
import { TermsComponent } from './terms/terms.component';

@Component({
  selector: 'app-launchpad',
  templateUrl: './launchpad.component.html',
  styleUrls: ['./launchpad.component.css']
})
export class LaunchpadComponent implements OnInit, OnDestroy{

  ela: number [] = [1,2,3,4]
  allSales: Sale[] = [];
  activeSales: Sale[] = [];
  upcomingSales: Sale[] = [];
  completedSales: Sale[] = [];

  subscription: Subscription[] = [];
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.fetchAllSale();
    this.subscription.push(this.backendService.allSaleChanged.subscribe(sales => {
      this.allSales = sales;
      this.activeSales = this.allSales.filter(function (el){
        return el.status == 'active'
      })

      this.upcomingSales = this.allSales.filter(function (el){
        return el.status == 'accepted'
      })

      this.completedSales = this.allSales.filter(function (el){
        return el.status == 'completed'
      })
    }))
  }

  onApplyNow(){
    this.dialog.open(TermsComponent, {
      panelClass: 'custom-terms'
    });
  }

  onShowCompletedDetails(i: number){
    this.dialog.open(DetailsComponent2, {data: {

      sale: this.completedSales[i]
    }})
  }

  onShowActiveDetails(i: number){
    this.dialog.open(DetailsComponent2, {data: {

      sale: this.activeSales[i]
    }})
  }

  onShowUpcomingDetails(i: number){
    this.dialog.open(DetailsComponent2, {data: {
      sale: this.upcomingSales[i]
    }})
  }

  ngOnDestroy(): void {
      this.subscription.forEach(element => {
        element.unsubscribe();
      });
  }
}
