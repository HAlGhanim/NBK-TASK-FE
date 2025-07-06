import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { BaseService } from './base.service';
import {
  AuthRequest,
  AuthResponse,
} from '../../interfaces/Authentication.interface';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseService {
  login(data: AuthRequest): Observable<AuthResponse> {
    return this.post<AuthResponse, AuthRequest>('auth/login', data).pipe(
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  register(data: AuthRequest): Observable<AuthResponse> {
    return this.post<AuthResponse, AuthRequest>('auth/register', data).pipe(
      catchError((error) => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      })
    );
  }
}
