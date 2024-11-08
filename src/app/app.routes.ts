import {Routes} from '@angular/router';
import {BudgetListComponent} from './budget-list/budget-list.component';
import {BudgetFormComponent} from './budget-form/budget-form.component';
import {BudgetViewComponent} from './budget-view/budget-view.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'budget-list',
    pathMatch: 'full',
  },
  {
    path: 'budget-list',
    loadComponent: () => import('./budget-list/budget-list.component')
      .then(m => m.BudgetListComponent)
  },
  {
    path: 'budget-form',
    loadComponent: () => import('./budget-form/budget-form.component')
      .then(m => m.BudgetFormComponent)
  },
  {
    path: 'budget-view/:id',
    loadComponent: () => import('./budget-view/budget-view.component')
      .then(m => m.BudgetViewComponent)
  },
];
