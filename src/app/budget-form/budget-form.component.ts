import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors,
  Validators
} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {ModuleType, Zone, Module, Budget} from '../models/budget';
import {CommonModule, NgClass} from '@angular/common';
import {Router} from '@angular/router';

interface ModuleDetail {
  id:string
  fb:FormGroup
}

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    CommonModule
  ],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly router: Router = inject(Router);

  zones = Object.values(Zone);
  moduleTypeList: ModuleType[] = [];
  moduleDetails: ModuleDetail[] =[];
  currentDate = new Date().toISOString().split('T')[0]
  ngOnInit(): void {
    this.api.moduleType.subscribe(moduleType => {
      this.moduleTypeList = moduleType;
    })
    console.log(this.zones)
  }

  formBudget: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    date: new FormControl(this.currentDate, [Validators.required]),
    modules: new FormArray([],[this.atLeastThan3Modules])
  },{updateOn:"blur"})

  atLeastThan3Modules(control: AbstractControl): ValidationErrors | null {
    const modules = control as FormArray;
    if (!modules || modules.controls.length < 3){
      return {minModules:true};
    }
    return null;
  }

  newModule(){
    this.formBudget.controls["modules"].markAsTouched();

    const formModule:FormGroup = new FormGroup({
      type: new FormControl('', [Validators.required]),
      zone: new FormControl('', [Validators.required]),
      price: new FormControl(0),
      slots: new FormControl(0),
    })



    formModule.controls["type"].valueChanges.subscribe(()=>{
      const selectedType = this.moduleTypeList.find(type =>
        formModule.controls["type"].value === type.id
      )
      formModule.patchValue({
        price: selectedType?.price,
        slots:selectedType?.slots
      })
    })



    const detailId = Date.now().toString();

    (this.formBudget.controls["modules"] as FormArray).push(formModule)
    this.moduleDetails.push({
      id: detailId,
      fb: formModule
    });
  }

  saveBudget() {
    const values = this.formBudget.value;

    Object.values(this.formBudget.controls).forEach(control => {
      control.markAsTouched();
    });
      if (this.formBudget.invalid){
        alert("Formulario invalido")
        return;
      }

      const selectedModules = this.moduleDetails.map(detail =>{
        const moduleType = this.moduleTypeList
          .find(type => type.id === detail.fb.controls["type"].value) ?? {id: 0, name: '', price: 0, slots: 0}
        const zone:Zone = detail.fb.controls["zone"].value;
        return {
          zone: zone,
          type:moduleType
        }
      })
    const budget: Budget = {
      client: values.name, date: values.date, id: Date.now().toString(), module: selectedModules
    }
    this.api.createBudget(budget).subscribe({
      next: () =>{
        alert("Formulario guardado con exito "+ budget)
        this.router.navigate(["/budget-list"])
      }, error: () =>{
        alert("Error al guardar formulario");
        }
    }
    )

  }
  get modules(){
    return this.formBudget.controls["modules"] as FormArray;
  }
  dropModule(index: number) {
    this.modules.removeAt(index);
    this.moduleDetails.splice(index, 1);
    this.formBudget.updateValueAndValidity()
  }

  getFormErrors(): string[] {
    const errors: string[] = [];

    if(this.formBudget.get("modules")?.hasError("minModules")){
      errors.push('Debe cargar como mínimo 3 módulos')
    }

    return errors;
  }
}
