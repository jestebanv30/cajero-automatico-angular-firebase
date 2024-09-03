import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {ValidationService} from "./validationService";

@Injectable({
  providedIn: 'root'
})
export class FormConfig {

  constructor(private fb: FormBuilder) {}

  createLoginForm() {
    return this.fb.group({
      accountNumber: ['', [Validators.required, ValidationService.accountNumberValidator]],
      accountType: ['', Validators.required],
      password: ['', [Validators.required, ValidationService.passwordValidator]]
    });
  }

  createRegisterForm() {
    return this.fb.group({
      firstName: ['', [Validators.required, ValidationService.nameValidator]],
      lastName: ['', [Validators.required, ValidationService.nameValidator]],
      accountNumber: ['', [Validators.required, ValidationService.accountNumberValidator]],
      accountType: ['', Validators.required],
      password: ['', [Validators.required, ValidationService.passwordValidator]],
      confirmPassword: ['', [Validators.required, ValidationService.confirmPasswordValidator]]
    });
  }
}
