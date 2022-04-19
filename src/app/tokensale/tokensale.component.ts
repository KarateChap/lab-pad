import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Sale } from '../models/sale.model';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-tokensale',
  templateUrl: './tokensale.component.html',
  styleUrls: ['./tokensale.component.css'],
})
export class TokensaleComponent implements OnInit, OnDestroy {
  activeTokenSaleId: string;
  activeTokenSale: Sale;
  subscription: Subscription;
  isLoading = true;
  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.activeTokenSaleId = this.route.snapshot.params['id'];
    this.isLoading = true;
    this.backendService.fetchActiveTokenSale(this.activeTokenSaleId);
    this.subscription = this.backendService.activeSaleChanged.subscribe(
      (sale) => {
        this.activeTokenSale = sale;
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
