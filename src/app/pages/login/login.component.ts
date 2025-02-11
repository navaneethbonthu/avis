import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../shared/data-access/auth.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html'
})
export default class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
 
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  errorMessage: string | null = null;

  loginForm = this.fb.nonNullable.group({
    username: ['emilys', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    password: ['emilyspass', [Validators.required, Validators.minLength(6)]],
    // user_email: ['', [Validators.required, Validators.email]],
  })


  onSubmit(): void {
    console.log(this.loginForm)
    const { username, password } = this.loginForm.value;
    
    this.authService.login(username, password);
    // if (username && password) {
    // } else {
    //   this.errorMessage = 'Username and password are required';
    // }
    
  }

}
