// Models
import { IngresoEgreso } from './ingreso-egreso.model';

// Services
import { IngresoEgresoService } from './ingreso-egreso.service';

// ngrx
import { Store } from '@ngrx/store';
import * as fromIngresoEgreso from './ingreso-egreso.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html'
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  public ingresoEgresoForm: FormGroup;
  public tipo = 'ingreso';
  public cargando: boolean;
  private ingresoEgresoSubscription: Subscription = new Subscription();

  constructor(public ingresoEgresoService: IngresoEgresoService,
              private store: Store<fromIngresoEgreso.AppState>) { }

  ngOnInit() {
    this.ingresoEgresoSubscription = this.store.select('ui')
                                               .subscribe(ui => this.cargando = ui.isLoading);
    this.ingresoEgresoForm = new FormGroup({
      descripcion: new FormControl('', Validators.required),
      monto: new FormControl(0, Validators.min(0))
    });
  }
  ngOnDestroy() {
    this.ingresoEgresoSubscription.unsubscribe();
  }

  public onSubmit(): void {
    const INGRESO_EGRESO = new IngresoEgreso({ ...this.ingresoEgresoForm.value, tipo: this.tipo });
    this.store.dispatch(new ActivarLoadingAction());
    this.ingresoEgresoService.crearIngresoEgreso(INGRESO_EGRESO)
                              .then(() => {
                                Swal.fire(`Elemento agregado!`, 'tu monto fue agregado correctamente', 'success');
                                this.ingresoEgresoForm.reset();
                                this.store.dispatch(new DesactivarLoadingAction());
                              }).catch((err: any) => {
                                Swal.fire('Error', 'Hubo un problema al agregar el monto', 'error');
                                console.error(err);
                                this.store.dispatch(new DesactivarLoadingAction());
                              });
  }

}
