import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Budget, ModuleType} from '../models/budget';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly client:HttpClient = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000';

  get moduleType(){
    const url = this.BASE_URL+ "/module-types";
    return this.client.get<ModuleType[]>(url);
  }

  createBudget(budget: Budget) {
    const url = `http://localhost:3000/budgets`;
    return this.client.post<Budget>(url, budget);
  }

  get budgets(): Observable<Budget[]> {
    return this.client.get<Budget[]>(`${this.BASE_URL}/budgets`);
  }

  getBudgetById(id:string): Observable<Budget> {
    return this.client.get<Budget>(`${this.BASE_URL}/budgets/${id}`);
  }
}
