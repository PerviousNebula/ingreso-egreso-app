import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';


const ROUTES: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: '',
        loadChildren: './ingreso-egreso/ingreso-egreso.module#IngresoEgresoModule',
        canLoad: [ AuthGuard ]
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [ 
        RouterModule.forRoot(ROUTES)
    ],
    exports: [ 
        RouterModule
    ]
})
export class AppRoutingModule {}
