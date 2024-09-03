import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtmService {
  private cashSelect = new BehaviorSubject<number>(0);
  public getCashSelect$ = this.cashSelect.asObservable();

  private readonly billetes = [100000, 50000, 20000, 10000];
  private readonly maxBilletes = [4, 3, 2, 1];

  constructor() {}

  public setCashSelect(amount: number): void {
    this.cashSelect.next(amount);
  }

  public calculateBills(monto: number) {
    const conteoBilletes = [0, 0, 0, 0];
    let montoRestante = monto;

    while (montoRestante > 0) {
      let suma = 0;
      const activacion = [0, 0, 0, 0];

      for (let i = this.billetes.length - 1; i >= 0; i--) {
        const cantidadMaxima = this.maxBilletes[i];
        const valorBillete = this.billetes[i];

        let cantidadBilletes = 0;
        while (
          cantidadBilletes < cantidadMaxima &&
          suma + valorBillete <= montoRestante
          ) {
          suma += valorBillete;
          cantidadBilletes++;
          activacion[i]++;
        }
      }

      if (suma > 0) {
        for (let i = 0; i < this.billetes.length; i++) {
          conteoBilletes[i] += activacion[i];
        }
        montoRestante -= suma;
      } else {
        break;
      }
    }

    if (montoRestante === 0) {
      return {
        billetes: {
          "100k": conteoBilletes[0],
          "50k": conteoBilletes[1],
          "20k": conteoBilletes[2],
          "10k": conteoBilletes[3],
        },
        exito: true,
      };
    } else {
      return {exito: false};
    }
  }

}
