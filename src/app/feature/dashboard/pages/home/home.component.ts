import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {CurrencyPipe, NgIf} from "@angular/common";
import {AtmService} from "../../../../core/service/atm.service";
import {ReceiptCashComponent} from "../../components/receipt-cash/receipt-cash.component";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../../core/service/auth.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReceiptCashComponent,
    NgIf,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  public selectedAmount: number = 0;
  public dynamicCode: string = '';
  public enteredDynamicCode: string = '';
  public userName: string = '';
  public userAccountNumber: string = '';
  public userAccountType: string = '';

  @ViewChild('customAmountInput') customAmountInput!: ElementRef<HTMLInputElement>;
  @ViewChild(ReceiptCashComponent) receiptModal!: ReceiptCashComponent;

  constructor(private router: Router, private atmService: AtmService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.setIsAuthenticated(true);
    this.authService.startDynamicCodeGeneration();

    const user = this.authService.getCurrentUser();
    this.userName = user?.firstName + ' ' + user?.lastName;
    this.userAccountNumber = user?.accountNumber || '';
    this.userAccountType = user?.accountType || '';

    //Obtiene el valor inicial de la clave dinamica y se suscribe a cambios
    this.dynamicCode = this.authService.getDynamicCode();
    this.authService.getDynamicCodeObservable().subscribe(code => {
      this.dynamicCode = code;
    })

    // Suscribirse al valor del efectivo seleccionado cuando el componente se inicializa
    this.atmService.getCashSelect$.subscribe(amount => {
      this.selectedAmount = amount;
    });
  }

  public async signOut(): Promise<void> {
    this.atmService.setCashSelect(0);
    await this.authService.signOut();
  }

  public selectAmount(amount: number): void {
    const value = Number(amount);
    if (!isNaN(value) && value > 0) {
      this.atmService.setCashSelect(value);

      // Limpiar el campo de entrada de otro valor
      if (this.customAmountInput) {
        this.customAmountInput.nativeElement.value = '';
      }
    }
  }

  public onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (!isNaN(value) && value > 0) {
      this.atmService.setCashSelect(value);
    }
  }

  public async calculateAndDisplayBills(selectAmount: number): Promise<void> {
    if (this.enteredDynamicCode === this.dynamicCode) {
      if (selectAmount > 0 && selectAmount <= 1000000) {
        const result = this.atmService.calculateBills(selectAmount);
        this.receiptModal.openModal(selectAmount, result);
        this.atmService.setCashSelect(0);
      } else {
        alert('Por favor, selecciona o ingrese un monto válido');
        return;
      }
    } else {
      alert('Error en la clave dinámica.');
      await this.authService.signOut();
    }
  }

  public clearAmount(): void {
    this.selectedAmount = 0;
    this.atmService.setCashSelect(0);
    localStorage.removeItem('selectedAmount');

    // Limpiar el campo de entrada de otro valor
    if (this.customAmountInput) {
      this.customAmountInput.nativeElement.value = '';
    }
  }
}
