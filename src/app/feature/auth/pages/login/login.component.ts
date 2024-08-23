import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private router: Router) {
  }


  public async signIn(): Promise<void> {
    await this.router.navigateByUrl('/dashboard/home');
  }

}
