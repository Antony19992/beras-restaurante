import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe(
        response => {
          localStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('userName', response.nome);
          this.router.navigate(['/home']);
          this.snackBar.open('Bem-vindo à Beras Marmitaria!', 'OK', {
            duration: 3000,
          });

          // Forçar atualização da tela
          window.location.reload();
        },
        error => {
          this.snackBar.open('Erro ao fazer login. Tente novamente.', 'OK', {
            duration: 3000,
          });
        }
      );
    }
  }
}
