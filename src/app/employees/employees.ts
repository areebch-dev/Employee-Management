import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../core/services/employee';
import { AuthService } from '../core/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class Employees  {

  employees: any[] = [];

  employee: any = { name: '', email: '', role: '', gender: '', salary: '', contact: '' };
  editRecord: any = { name: '', email: '', role: '', gender: '', salary: '', contact: '' };
  showForm = false;
  showModal = false;

  constructor(
    private empService: EmployeeService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.getEmployees();
  }

  get isLoggedIn() {
    return this.auth.isLoggedIn;
  }

  get authUser() {
    return this.auth.getUser();
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.auth.logout();
        this.router.navigate(['/login']);
        Swal.fire({
          icon: 'success',
          title: 'Logged out successfully',
          showConfirmButton: false,
          timer: 1200
        });
      }
    });
  }

  getEmployees() {
    this.empService.getAll().subscribe({
      next: (res: any) => {
        this.employees = res;
      },
      error: (err: any) => {
        console.error('Error fetching employees:', err);
        this.employees = [];
      }
    });
  }

  onSubmit(form?: any) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{11}$/;

    if (
      !this.employee.name ||
      !this.employee.email ||
      !this.employee.role ||
      !this.employee.gender ||
      !this.employee.salary ||
      !this.employee.contact
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Please fill all required fields',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    if (!emailPattern.test(this.employee.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Please enter a valid email',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    // if (!phonePattern.test(this.employee.contact)) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Please enter 11-digit contact number',
    //     showConfirmButton: false,
    //     timer: 1500
    //   });
    //   return;
    // }

    if (this.employee.salary <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Salary must be greater than 0',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    this.empService.create(this.employee).subscribe({
      next: (res: any) => {
        this.employees.push(res);
        this.employee = { name: '', email: '', role: '', gender: '', salary: '', contact: '' };
        this.showForm = false;

        Swal.fire({
          icon: 'success',
          title: 'Employee added successfully!',
          showConfirmButton: false,
          timer: 1500
        });

        if (form) form.resetForm();
      },
      error: (err: any) => {
        console.error('Error creating employee:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to add employee',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  editEmployee(emp: any) {
    this.editRecord = emp ;
    this.showModal = true;
  }

  updateEmployee() {
    if (!this.editRecord.name || !this.editRecord.email || !this.editRecord.role || !this.editRecord.gender) {
      Swal.fire({
        icon: 'error',
        title: 'Please fill all fields before updating',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    this.empService.update(this.editRecord.id, this.editRecord).subscribe({
      next: (res: any) => {
        const index = this.employees.findIndex(e => e.id === res.id);
        if (index !== -1) this.employees[index] = res;
        this.showModal = false;

        Swal.fire({
          icon: 'success',
          title: 'Employee updated successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err: any) => {
        console.error('Error updating employee:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to update employee',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  deleteEmployee(id: string) {
    Swal.fire({
      title: 'Delete Employee?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.empService.delete(id).subscribe({
          next: () => {
            this.employees = this.employees.filter(e => e.id !== id);
            Swal.fire({
              icon: 'success',
              title: 'Employee deleted successfully!',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: (err: any) => {
            console.error('Error deleting employee:', err);
            Swal.fire({
              icon: 'error',
              title: 'Failed to delete employee',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }
    });
  }

  toggleForm(show: boolean) {
    this.showForm = show;
    if (!show) {
      this.employee = { name: '', email: '', role: '', gender: '', salary: '', contact: '' };
    }
  }

  closeModal() {
    this.showModal = false;
    this.editRecord = { name: '', email: '', role: '', gender: '', salary: '', contact: '' };
  }
}
