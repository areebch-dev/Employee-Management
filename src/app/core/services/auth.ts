import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private STORAGE_KEY = 'users';
  private LOGGED_KEY = 'loggedInUser';

  register(user: any): boolean {
    if (!user || !user.email || !user.password) {
      return false;
    }

    const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');

    const exists = users.some((u: any) => u.email === user.email);
    if (exists) return false;

    users.push(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    return true;
  }

  login(email: string, password: string) {
    if (!email || !password) { return false };

    const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      localStorage.setItem(this.LOGGED_KEY, JSON.stringify(found));
      return true;
    }
    return false;
  }

  get isLoggedIn() {
    return !!localStorage.getItem(this.LOGGED_KEY);
  }

  getUser(): any {
    const u = localStorage.getItem(this.LOGGED_KEY);
    return u ? JSON.parse(u) : null;
  }

  logout() {
    localStorage.removeItem(this.LOGGED_KEY);
  }
}
