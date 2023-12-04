import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { environment } from 'src/app/environments/environments';
import { User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { LoginResponse } from '../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl:string = environment.baseUrl;

  private httpClient = inject(HttpClient);
  // constructor(private httpClient: HttpClient) { }

  // private _currentUser = signal<User|null>(null);
  // private _authStatus = signal<AuthStatus>();
  // public currentUser = computed(()=>this._currentUser())

  private _currentUser?:User;
  private _authStatus?:AuthStatus=AuthStatus.checking;

  get currentUser():User| undefined{
    if(!this._currentUser) return undefined;
    
    return structuredClone(this._currentUser);
  }
  get authStatus():AuthStatus| undefined{
    if(!this._authStatus) return undefined;
    
    return structuredClone(this._authStatus);
  }

  login(email:string, password:string): Observable<boolean>{
    const url = `${this.baseUrl}/auth/login`;
    const body = {
      email,
      password
    }
    console.log('hola')
    return this.httpClient.post<LoginResponse>(url, body)
    .pipe(
      tap(({user, token})=>{
        console.log({user, token})

        this._currentUser=user;
        this._authStatus = AuthStatus.authenticated
        localStorage.setItem('token', token)
      }),
      map(res=>true)

      //TODO: ERRORES 
    )
  }
}
