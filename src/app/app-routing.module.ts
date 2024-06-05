import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { TrasferenciaComponent } from './component/trasferencia/trasferencia.component';

const routes: Routes = [
  { path: 'trasferencia', component: TrasferenciaComponent } ,
  { path: '',component:HomeComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
