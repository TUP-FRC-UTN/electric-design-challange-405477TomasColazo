import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Budget, Module, Zone} from '../models/budget';
import {ApiService} from '../services/api.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-budget-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-view.component.html',
  styleUrl: './budget-view.component.css',
})
export class BudgetViewComponent implements OnInit {
  protected readonly router = inject(Router)
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly apiService: ApiService = inject(ApiService);
  budget!: Budget;
  zones:Zone[] =[]
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.apiService.getBudgetById(params['id']).subscribe(budget => {
        this.budget = budget;
        for (const module of budget.module) {
          if (!this.zones.some(zone => zone.valueOf() === module.zone.valueOf())) {
            this.zones.push(module.zone);
          }
        }
      })
    })
  }

  get boxes():number |null{
    if(this.budget){
      let listBox:number[] = [0];
      for (const module of this.budget.module) {
        const slots = module.type.slots

        let placed = false;

        for (let i = 0; i < listBox.length; i++) {
          if (listBox[i]+slots <= 3){
            listBox[i] = listBox[i]+slots;
            placed = true;
            break;
          }
        }

        if (!placed){
          listBox.push(slots);
        }
      }
      return listBox.length;
    }
    return null;
  }

  getModulesByZone(zone:Zone): Module[]{
    const moduleList = [];
    for (const module of this.budget.module) {
      if (module.zone.valueOf() === zone.valueOf()){
        moduleList.push(module)
      }
    }
    return moduleList;
  }

  get total():number{
    let total:number = 0;
    if(this.budget){
      for (const module of this.budget.module) {
        total += module.type.price
      }
    }
    return total;
  }
  // ADDITIONAL DOCS: same as BudgetListComponent
}
