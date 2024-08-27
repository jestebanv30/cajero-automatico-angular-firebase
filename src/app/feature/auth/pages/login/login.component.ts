import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";

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
  private readonly validUsername: string = 'jevaldes@unicesar.edu.co';
  private readonly validPassword: string = '12345';
  public errorMessage: string = '';

  constructor(private router: Router, private fb: FormBuilder, ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  public async signIn(): Promise<void> {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (email == this.validUsername && password == this.validPassword) {
      this.errorMessage = "";
      await this.router.navigateByUrl('/dashboard/home');
    } else {
      this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
    }

  }

}
