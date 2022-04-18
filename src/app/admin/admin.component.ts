import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Sale } from '../models/sale.model';
import { BackendService } from '../services/backend.service';
import { DetailsComponent } from './details/details.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  toggleValue = 'Pending';
  sales: Sale[] = [];
  saleSubs: Subscription;
  isLoading = false;

  constructor(private backendService: BackendService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.backendService.fetchSale(this.toggleValue.toLowerCase());
    this.saleSubs = this.backendService.saleChanged.subscribe(sale => {
      this.sales = sale;
      this.isLoading = false;
      console.log(this.sales);
    })
  }

  onToggleChanges(event: any){
    this.toggleValue = event;
    this.backendService.fetchSale(this.toggleValue.toLowerCase());
    this.isLoading = true;
  }

  onSetStatus(id: string, index: number){
    if(this.sales[index].status == 'pending'){
      this.backendService.onAcceptSale(id);
      this.toggleValue = 'Accepted';
      this.backendService.fetchSale(this.toggleValue.toLowerCase());
      this.isLoading = true;
    }
    if(this.sales[index].status == 'accepted'){
      this.backendService.onSetActiveSale(id);
      this.toggleValue = 'Active';
      this.backendService.fetchSale(this.toggleValue.toLowerCase());
      this.isLoading = true;
    }
    if(this.sales[index].status == 'active'){
      this.backendService.onSetCompletedSale(id);
      this.toggleValue = 'Completed';
      this.backendService.fetchSale(this.toggleValue.toLowerCase());
      this.isLoading = true;
    }
    if(this.sales[index].status == 'rejected'){
      this.backendService.onSetPendingSale(id);
      this.toggleValue = 'Pending';
      this.backendService.fetchSale(this.toggleValue.toLowerCase());
      this.isLoading = true;
    }
  }

  onSetRejected(id: string, index: number){
    if(this.sales[index].status != 'completed'){
      this.backendService.onRejectSale(id);
      this.toggleValue = 'Rejected';
      this.backendService.fetchSale(this.toggleValue.toLowerCase());
      this.isLoading = true;
    }
  }

  onOpenDetails(index: number){
    this.dialog.open(DetailsComponent, {data: {

      sale: this.sales[index]
    }})
  }
}
