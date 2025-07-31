// zoo-frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ListeAnimauxComponent } from './pages/liste-animaux/liste-animaux.component';
import { ListeEnclosComponent } from './pages/liste-enclos/liste-enclos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/liste', pathMatch: 'full' },
  { path: 'liste', component: ListeAnimauxComponent },
  { path: 'enclos', component: ListeEnclosComponent },
];
