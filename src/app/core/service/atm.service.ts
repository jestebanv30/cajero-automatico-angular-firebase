import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtmService {
  private cashSelect = new BehaviorSubject<number>(0);
  public getCashSelect$ = this.cashSelect.asObservable();

  constructor() {}

  public setCashSelect(amount: number): void {
    this.cashSelect.next(amount);
  }

  public calculateBills(monto: number) {
    const billetes = [10000, 20000, 50000, 100000];
    let suma = 0;
    const entregarBilletes = new Map<number, number>();

    if (monto % 10000 !== 0) {
      return { exito: false, mensaje: "El monto solicitado debe ser un múltiplo de 10k" };
    }

    // Inicializa el mapa con el conteo de billetes en 0
    billetes.forEach(billete => {
      entregarBilletes.set(billete, 0);
    });

    while (monto !== suma) {
      let progreso = false;

      for (let i = 0; i < billetes.length; i++) {
        if (suma + billetes[i] <= monto) {
          suma += billetes[i];
          entregarBilletes.set(billetes[i], entregarBilletes.get(billetes[i])! + 1);
          progreso = true;

          // Intentar también con billetes posteriores en la misma ronda
          for (let j = i + 1; j < billetes.length; j++) {
            if (suma + billetes[j] <= monto) {
              suma += billetes[j];
              entregarBilletes.set(billetes[j], entregarBilletes.get(billetes[j])! + 1);
              progreso = true;
            }
          }
        }
      }

      // Si no se pudo avanzar, reiniciar el proceso
      if (!progreso) {
        // Reiniciar el proceso de conteo
        suma = 0;
        entregarBilletes.forEach((_, billete) => {
          entregarBilletes.set(billete, 0);
        });

        // Comprobar si se ha hecho algún progreso en la ronda actual
        const sumaActual = Array.from(entregarBilletes.entries())
          .reduce((acc, [billete, cantidad]) => acc + billete * cantidad, 0);
        if (sumaActual >= monto) {
          break;
        }
      }
    }

    if (suma === monto) {
      return {
        billetes: {
          "10k": entregarBilletes.get(10000) || 0,
          "20k": entregarBilletes.get(20000) || 0,
          "50k": entregarBilletes.get(50000) || 0,
          "100k": entregarBilletes.get(100000) || 0,
        },
        exito: true,
      };
    } else {
      return { exito: false, mensaje: "No es posible retirar el monto solicitado" };
    }
  }

}
