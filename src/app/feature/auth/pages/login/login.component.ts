import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../../core/service/auth.service";
import {FormConfig} from "../../../../core/validators/formConfig";
import {ValidationService} from "../../../../core/validators/validationService";
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  public errorMessage: string = '';
  public isLocked: boolean = false;
  private attempts: number = 0;

  constructor(private formConfig: FormConfig, private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.formConfig.createLoginForm();
  }

  public async signIn(): Promise<void> {
    if (this.isLocked) return;

    this.loginForm.markAllAsTouched();
    this.loginForm.markAsDirty();

    if (this.loginForm.valid) {
      const accountNumber = this.loginForm.get('accountNumber')?.value;
      const accountType = this.loginForm.get('accountType')?.value;
      const password = this.loginForm.get('password')?.value;

      let digitFormat = accountNumber;

      if (accountType == 'nequi') {
        digitFormat = '0' + accountNumber;
      } else {
        digitFormat = '1' + accountNumber;
      }
      const sucess = await this.authService.signIn(digitFormat, password);
      if (sucess) {
        this.attempts = 0;
      } else {
        this.attempts++;
        if (this.attempts >= 3) {
          this.locksInputs();
        }
        this.errorMessage = `Credenciales incorrectas, Intentos restantes: ${3 - this.attempts}`;
      }
    }
  }

  private locksInputs(): void {
    Swal.fire({
      icon: "error",
      title: "Sistema Bloqueado",
      text: "Demasiados intentos fallidos. Intenta nuevamente en 2 minutos.",
    });
    this.loginForm.get('accountNumber')?.disable();
    this.loginForm.get('accountType')?.disable();
    this.loginForm.get('password')?.disable();

    this.isLocked = true; //deshabilitar boton

    setTimeout(() => {
      this.isLocked = false;
      this.errorMessage = '';
      this.attempts = 0;

      this.loginForm.get('accountNumber')?.enable();
      this.loginForm.get('accountType')?.enable();
      this.loginForm.get('password')?.enable();

      this.loginForm.reset();
    }, 2 * 60 * 1000);
  }

  public getErrorsForm(field: string): string {
    const control = this.loginForm.get(field);
    return control ? ValidationService.getErrorMessage(control) : '';
  }

}
