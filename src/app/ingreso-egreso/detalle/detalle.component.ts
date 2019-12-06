// ngrx
import { Store } from '@ngrx/store';
import * as fromIngresoEgreso from '../ingreso-egreso.reducer';

// Models
import { IngresoEgreso } from '../ingreso-egreso.model';

// Services
import { IngresoEgresoService } from '../ingreso-egreso.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit, OnDestroy {
  public items: IngresoEgreso[];
  private subscription: Subscription = new Subscription();
  public cargando: boolean;

  constructor(private store: Store<fromIngresoEgreso.AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
                                  .subscribe((ingresoEgreso) => this.items = ingresoEgreso.items);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public borrarItem(uid: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás recuperar el registro',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar registro',
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.ingresoEgresoService.borrarIngresoEgreso(uid)
                                 .then(() => Swal.fire('Borrado', 'Elemento borrado satisfactoriamente', 'success'))
                                 .catch((err: any) => {
                                   Swal.fire('Error', 'No se pudo borrar el elemento', 'error');
                                   console.error(err);
                                 });
      }
    })
  }

}
