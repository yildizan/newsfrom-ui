import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './pages/map/map.component';

const routes: Routes = [
  { path: '', component: MapComponent, pathMatch: 'full' },
  { path: ':id', component: MapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
