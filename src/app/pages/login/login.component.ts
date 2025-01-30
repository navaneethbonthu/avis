import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export default class LoginComponent {

  private readonly fb = inject(FormBuilder)
  userLoginForm = this.fb.nonNullable.group({
    username: ['', Validators.required,Validators.minLength(3), Validators.maxLength(20)],
    user_password: ['', Validators.required, Validators.minLength(6), Validators.maxLength(20)],
  })

  onSubmit(){
    
  }

}
