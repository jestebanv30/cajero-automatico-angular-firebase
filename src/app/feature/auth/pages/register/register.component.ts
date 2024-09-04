import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {AuthService} from "../../../../core/service/auth.service";
import {User} from "../../../../core/models/user.interface";
import {FormConfig} from "../../../../core/validators/formConfig";
import {ValidationService} from "../../../../core/validators/validationService";
import Swal from "sweetalert2";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  public errorMessage: string = '';

  constructor(private formConfig: FormConfig, private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = this.formConfig.createRegisterForm();
  }

  public async register(): Promise<void> {
    const firstName = this.registerForm.controls['firstName'].value;
    const lastName = this.registerForm.controls['lastName'].value;
    const accountNumber = this.registerForm.get('accountNumber')?.value;
    const accountType = this.registerForm.get('accountType')?.value;
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    let digitFormat = accountNumber;

    if (accountType === 'nequi') {
      digitFormat = '0' + accountNumber;
    } else if (accountType === 'AA') {
      digitFormat = '1' + accountNumber;
    }

    const user: User = {
      firstName,
      lastName,
      accountNumber: digitFormat,
      accountType,
      password
    };

    try {
      if (this.registerForm.valid){
        Swal.fire({
          icon: "success",
          title: "Completado",
          text: "Registro Exitoso. Ya puedes iniciar sesión.",
        });
        await this.authService.register(user);
      } else {
        this.errorMessage = 'Hay errores en el formulario.';
      }

    } catch (error) {
      console.error('Error al registrar cuenta:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrió un error en registrar la cuenta. Intenta nuevamente.",
      });
    }
  }

  public getErrorsForm(field: string): string {
    const control = this.registerForm.get(field);
    return control ? ValidationService.getErrorMessage(control) : '';
  }
}
