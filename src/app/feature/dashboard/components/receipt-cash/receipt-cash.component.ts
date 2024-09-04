import { Component } from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {AuthService} from "../../../../core/service/auth.service";

@Component({
  selector: 'app-receipt-cash',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    NgClass,
    DatePipe
  ],
  templateUrl: './receipt-cash.component.html',
  styleUrls: ['./receipt-cash.component.css']
})
export class ReceiptCashComponent {
  public modalVisible: boolean = false;
  public amount: number = 0;
  public result: any = null;
  public withdrawalSuccess: boolean = false;

  public accountType: string = '';
  public userAccountNumber: string = '';
  public userName: string = '';
  public currentDate: Date = new Date();

  constructor(private router: Router, private authService: AuthService) {
  }

  public openModal(amount: number, result: any): void {
    const user = this.authService.getCurrentUser();
    this.userName = user?.firstName + ' ' + user?.lastName;
    this.userAccountNumber = user?.accountNumber || '';
    this.accountType = user?.accountType || '';

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
