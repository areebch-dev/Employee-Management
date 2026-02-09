import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const success = this.authService.login(this.loginData.email, this.loginData.password);
    if (success) {
      // alert('Login successful!');
      Swal.fire({
  // position: "center",
  icon: "success",
  title: "Login successful",
  showConfirmButton: false,
  timer: 1000
});
      this.router.navigate(['/employees']);
    } else {
      // alert('Invalid credentials');
        Swal.fire({
  // position: "center",
  icon: "error",
  title: "Invalid credentials",
  showConfirmButton: false,
  timer: 1500
});
    }
  }
    goToRegister() {
    this.router.navigate(['/register']);
  }
}
