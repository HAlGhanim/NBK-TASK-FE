import {
  CreateCustomerDTO,
  CustomerDTO,
  UpdateCustomerDTO,
} from './../../interfaces/Customers.interface';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersService extends BaseService {
  getCustomers(): Observable<CustomerDTO[]> {
    return this.get<CustomerDTO[]>('customers').pipe(
      catchError((error) => {
        console.error('Failed to fetch customers.', error);
        return throwError(() => error);
      })
    );
  }

  getCustomerByNumber(number: number): Observable<CustomerDTO> {
    return this.get<CustomerDTO>(`customers/${number}`).pipe(
      catchError((error) => {
        console.error(`Failed to fetch customer with number: ${number}`, error);
        return throwError(() => error);
      })
    );
  }

  AddCustomer(data: CreateCustomerDTO): Observable<CustomerDTO> {
    return this.post<CustomerDTO, CreateCustomerDTO>(`customers`, data).pipe(
      catchError((error) => {
        console.error('Failed to add customer', error);
        return throwError(() => error);
      })
    );
  }

  updateCustomer(
    number: number,
    data: UpdateCustomerDTO
  ): Observable<CustomerDTO> {
    return this.put<CustomerDTO, UpdateCustomerDTO>(
      `customers/${number}`,
      data
    ).pipe(
      catchError((error) => {
        console.error(`Failed to update customer ${number}:`, error);
        return throwError(() => error);
      })
    );
  }

  deleteCustomer(number: number): Observable<void> {
    return this.delete<void>(`customers/${number}`).pipe(
      catchError((error) => {
        console.error(`Failed to delete customer ${number}:`, error);
        return throwError(() => error);
      })
    );
  }
}
