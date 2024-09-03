import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  static accountNumberValidator(control: AbstractControl): ValidationErrors | null {
    const pattern = /^\d{10}$/;
    if (!pattern.test(control.value)) {
      return { pattern: 'El número de cuenta debe tener 10 dígitos' };
    }
    return null;
  }

  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const pattern = /^\d{4}$/;
    if (!pattern.test(control.value)) {
      return { pattern: 'La contraseña debe ser de 4 dígitos' };
    }
    return null;
  }

  static confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const form = control.parent;
    if (form) {
      const password = form.get('password')?.value;
      if (password !== control.value) {
        return { mismatch: 'Las contraseñas no coinciden' };
      }
    }
    return null;
  }

  static nameValidator(control: AbstractControl): ValidationErrors | null {
    const pattern = /^[a-zA-Z\s]+$/;
    if (!pattern.test(control.value)) {
      return { pattern: 'El nombre solo debe contener letras.'};
    }
    return null;
  }

  static getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    } else if (control.hasError('pattern')) {
      return control.getError('pattern');
    } else if (control.hasError('mismatch')) {
      return control.getError('mismatch');
    }
    return '';
  }
}
