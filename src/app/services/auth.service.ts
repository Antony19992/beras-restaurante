import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

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
  private currentUser: User | null = null;

  constructor(private router: Router) {
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

  login(username: string, password: string): boolean {
    // Valores de teste
    const testUser = 'teste@email.com';
    const testPassword = '123456';

    if (username === testUser && password === testPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      this.isLoggedInSubject.next(true);
      this.currentUser = {
        id: 1,
        name: 'João Silva',
        email: username
      };
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedInSubject.next(false);
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getLoggedInUser(): User | null {
    return this.currentUser;
  }
}
