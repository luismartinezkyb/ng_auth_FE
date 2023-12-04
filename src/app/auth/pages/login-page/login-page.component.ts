import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  constructor(
    //private fb: FormBuilder
    private authService: AuthService
  ){}
  public myForm: FormGroup = this.fb.group({
    email:['',[Validators.required, Validators.email]],
    password:['',[Validators.required, Validators.minLength(6)]],
  });

  login(): void{
    if(this.myForm.invalid) return;

    this.authService.login(
      this.myForm.get('email')!.value, 
      this.myForm.get('password')!.value,
      ).subscribe(success=>console.log(success))
      
  }
}
