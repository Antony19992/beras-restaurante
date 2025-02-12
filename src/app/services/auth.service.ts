import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // Inicializa como false por padrão
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    // Verifica o estado de autenticação ao inicializar o serviço
    this.checkAuthState();
  }

  private checkAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);

    // Se não estiver logado, redireciona para o login
    if (!isLoggedIn && !window.location.pathname.includes('/login')) {
      this.router.navigate(['/login']);
    }
  }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${environment.apiUrl}/login`, body).pipe(
        tap((response: any) => {
            sessionStorage.setItem('token', response.token); // Armazenando o token
        })
    );
  }

  createUser(nome: string, email: string, senha: string, telefone: string, endereco: string, complemento: string, numero: string = '153'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users`, {
        nome: nome,
        email,
        senha: senha,
        telefone: telefone,
        endereco: endereco,
        complemento: complemento,
        numero: numero
    });
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedInSubject.next(false);
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getLoggedInUser(): { user: string | null; id: string | null; } {
    return {
      user: sessionStorage.getItem('userName'),
      id: sessionStorage.getItem('clienteId')
    };
  }
}
