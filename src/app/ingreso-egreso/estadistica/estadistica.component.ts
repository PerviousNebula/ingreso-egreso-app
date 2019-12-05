import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html'
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  public totalIngresos: number;
  public totalEgresos: number;
  public cuantosIngresos: number;
  public cuantosEgresos: number;
  private subscription: Subscription = new Subscription();
  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: number[] = [];

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso').subscribe(ingresoEgreso => {
      this.contarIngresoEgreso(ingresoEgreso.items);
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public contarIngresoEgreso(items: IngresoEgreso[]) {
    this.totalIngresos = 0;
    this.totalEgresos = 0;
    this.cuantosIngresos = 0;
    this.cuantosEgresos = 0;
    items.forEach(item => {
      if (item.tipo === 'ingreso') {
        this.cuantosIngresos++;
        this.totalIngresos += item.monto;
      } else {
        this.cuantosEgresos++;
        this.totalEgresos += item.monto;
      }
    });
    this.doughnutChartData = [this.totalIngresos, this.totalEgresos];
  }

}
