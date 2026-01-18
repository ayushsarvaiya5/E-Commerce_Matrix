import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  
  currentUser = computed(() => this.currentUserSignal());
  isLoggedIn = computed(() => this.currentUserSignal() !== null);
  userRole = computed(() => this.currentUserSignal()?.role ?? null);

  // Mock user database
  private mockUsers: User[] = [
    { id: 1, email: 'admin@ecommerce.com', name: 'Admin User', role: 'admin' },
    { id: 2, email: 'user@ecommerce.com', name: 'Regular User', role: 'user' },
  ];

  private nextUserId = 3;

  constructor() {}

  login(email: string, password: string): boolean {
    // Mock authentication - in real app, this would call an API
    const user = this.mockUsers.find((u) => u.email === email);
    
    if (user && password === 'password123') {
      this.currentUserSignal.set(user);
      this.saveUserToStorage(user);
      return true;
    }
    
    return false;
  }

  register(email: string, name: string, password: string, confirmPassword: string, role: 'user' | 'admin'): boolean {
    // Validate inputs
    if (!email || !name || !password || password !== confirmPassword) {
      return false;
    }

    // Check if user already exists
    if (this.mockUsers.find((u) => u.email === email)) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: this.nextUserId++,
      email,
      name,
      role,
    };

    this.mockUsers.push(newUser);
    this.currentUserSignal.set(newUser);
    this.saveUserToStorage(newUser);
    return true;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }
}
