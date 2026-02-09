import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignUp {
  registerData = { name: '', email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.registerData.name || !this.registerData.email || !this.registerData.password) {
      alert('All fields are required');
      return;
    }
    const success = this.authService.register(this.registerData);
    if (success) {
      // alert('Registered successfully! You can now log in.');
          Swal.fire({
        // position: "center",
        icon: "success",
        title: "Registered successfully! You can now log in.",
        showConfirmButton: false,
        timer: 1500
      });
      this.router.navigate(['/login']);
    } else {
      // alert('Email already registered.');
        Swal.fire({
        // position: "center",
        icon: "warning",
        title: "Email already registered.",
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

  goToLogin(){
    this.router.navigate(['/login'])
  }
}
