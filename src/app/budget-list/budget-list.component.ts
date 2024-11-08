import {Component, inject, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Budget} from '../models/budget';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css',
})
export class BudgetListComponent implements OnInit{
  private readonly api = inject(ApiService)
  private readonly router = inject(Router)

  budgets: Budget[] = [];

  ngOnInit(): void {
    this.api.budgets.subscribe(budget => {this.budgets = budget;})
  }

  infoBudget(budget: string | undefined) {
    if(budget == undefined){return;}
    this.router.navigate([`/budget-view/${budget}`]);
  }
}
