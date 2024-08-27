import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {CurrencyPipe, NgIf} from "@angular/common";
import {AtmService} from "../../../../core/service/atm.service";
import {ReceiptCashComponent} from "../../components/receipt-cash/receipt-cash.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReceiptCashComponent,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  public selectedAmount: number = 0;
  // Referencia al campo de entrada de otro valor
  @ViewChild('customAmountInput') customAmountInput!: ElementRef<HTMLInputElement>;
  @ViewChild(ReceiptCashComponent) receiptModal!: ReceiptCashComponent;

  constructor(private router: Router, private atmService: AtmService) {}

  ngOnInit(): void {
    // Suscribirse al valor del efectivo seleccionado cuando el componente se inicializa
    this.atmService.getCashSelect$.subscribe(amount => {
      this.selectedAmount = amount;
    });

    // Cargar el valor inicial desde localStorage si existe
    this.atmService.loadCashSelect();
  }

  public async signOut(): Promise<void> {
    await this.router.navigateByUrl('/auth/login');
  }

  public selectAmount(amount: number): void {
    const value = Number(amount);
    if (!isNaN(value) && value > 0) {
      this.atmService.setCashSelect(value);
    }
  }

  public onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (!isNaN(value) && value > 0) {
      this.atmService.setCashSelect(value);
    }
  }

  public calculateAndDisplayBills(selectAmount: number): void {
    const result = this.atmService.calculateBills(selectAmount);
    if (selectAmount > 0) {
      this.receiptModal.openModal(selectAmount, result);
    } else {
      alert('Por favor, selecciona o ingrese un monto válido');
    }
  }

  /*public calculateAndDisplayBills(selectAmount: number): void {
    const result = this.atmService.calculateBills(selectAmount);
    if (result.exito) {
      console.log(`Retirar ${selectAmount}`);
      console.log(result);
    } else {
      console.log(`No es posible retirar ${selectAmount}`);
    }
  }*/

  public clearAmount(): void {
    this.selectedAmount = 0;
    this.atmService.setCashSelect(0);
    localStorage.removeItem('selectedAmount'); // Eliminar del localStorage si es necesario

    // Limpiar el campo de entrada de otro valor
    if (this.customAmountInput) {
      this.customAmountInput.nativeElement.value = '';
    }
  }
}
