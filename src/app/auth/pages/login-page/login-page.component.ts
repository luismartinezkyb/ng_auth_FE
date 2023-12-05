import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  constructor(
    //private fb: FormBuilder
    private authService: AuthService,
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
      ).subscribe({
        next: ()=> this.router.navigateByUrl('/dashboard'),
        error: (message)=>{
          Swal.fire('Error', message, 'error')
          console.error({LoginError: message})
        }
      })
  }
}
