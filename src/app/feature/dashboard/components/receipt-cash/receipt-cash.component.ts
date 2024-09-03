import { Component } from '@angular/core';
import {CurrencyPipe, NgClass, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {AuthService} from "../../../../core/service/auth.service";

@Component({
  selector: 'app-receipt-cash',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    NgClass
  ],
  templateUrl: './receipt-cash.component.html',
  styleUrls: ['./receipt-cash.component.css']
})
export class ReceiptCashComponent {

  constructor(private router: Router, private authService: AuthService) {
  }
  modalVisible: boolean = false;
  amount: number = 0;
  result: any = null;
  withdrawalSuccess: boolean = false;

  public openModal(amount: number, result: any): void {
    this.amount = amount;
    this.result = result;
    this.withdrawalSuccess = result.exito;
    this.modalVisible = true;
  }

  public async closeModal(): Promise<void> {
    await this.authService.signOut();
    this.modalVisible = false;
  }

}
