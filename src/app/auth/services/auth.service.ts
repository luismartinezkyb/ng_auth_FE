import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/app/environments/environments';
import { User } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { LoginResponse } from '../interfaces/login-response.interface';
import { CheckTokenResponse } from '../interfaces/check-token.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl:string = environment.baseUrl;

  private httpClient = inject(HttpClient);
  
  private setAuthentication(user: User, token:string): boolean{
    this._currentUser=user;
    this._authStatus.set(AuthStatus.authenticated)
    localStorage.setItem('token', token)
    return true;
  }
  constructor() {
    this.checkAuthStatus().subscribe();
  }

  // private _currentUser = signal<User|null>(null);
  // private _authStatus = signal<AuthStatus>();
  // public currentUser = computed(()=>this._currentUser())

  private _currentUser?:User;
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  get currentUser():User| undefined{
    if(!this._currentUser) return undefined;
    
    return structuredClone(this._currentUser);
  }
  public authStatus = computed( () => this._authStatus() );
  // get authStatus():AuthStatus| undefined{
  //   if(!this._authStatus) return undefined;
    
  //   return structuredClone(this._authStatus);
  // }

  login(email:string, password:string): Observable<boolean>{
    const url = `${this.baseUrl}/auth/login`;
    const body = {
      email,
      password
    }
    return this.httpClient.post<LoginResponse>(url, body)
    .pipe(
      map(({user, token})=>this.setAuthentication(user, token)),
      catchError(err=>throwError(()=> err.error.message))
      //TODO: ERRORES 
    )
  }

  checkAuthStatus(): Observable<boolean>{
    const url = `${this.baseUrl}/auth/check-token`;
    //Podríamos crear un get token como servicio apra poder almacenarlo de diferente manera
    const token = localStorage.getItem('token');

    if(!token){
      this.logout();
      return of(false)
    }

    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    return this.httpClient.get<CheckTokenResponse>(url, {
      headers
    })
    .pipe(
      map(({user, token})=>this.setAuthentication(user, token)),
      catchError((err)=>{
        console.log(err)
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false)
      })
    )
  }

  logout(){
    localStorage.removeItem('token');
    this._authStatus.set(AuthStatus.notAuthenticated);

  }
}
