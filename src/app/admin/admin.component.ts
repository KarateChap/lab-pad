import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sale } from '../models/sale.model';
import { BackendService } from '../services/backend.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  toggleValue = 'Pending';
  sales: Sale[] = [];
  saleSubs: Subscription;
  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.fetchSale(this.toggleValue.toLowerCase());
    this.saleSubs = this.backendService.saleChanged.subscribe(sale => {
      this.sales = sale;
      console.log(this.sales);
    })
  }

  onToggleChanges(event: any){
    this.toggleValue = event;
    this.backendService.fetchSale(this.toggleValue.toLowerCase());
  }

  onSetStatus(id: string, index: number){
    if(this.sales[index].status == 'pending'){
      this.backendService.onAcceptSale(id);
    }
    if(this.sales[index].status == 'accepted'){
      this.backendService.onSetActiveSale(id);
    }
    if(this.sales[index].status == 'active'){
      this.backendService.onSetCompletedSale(id);
    }
    if(this.sales[index].status == 'rejected'){
      this.backendService.onSetPendingSale(id);
    }
  }

  onSetRejected(id: string, index: number){
    if(this.sales[index].status != 'pending' && this.sales[index].status != 'completed'){
      this.backendService.onRejectSale(id);
    }
  }
}
