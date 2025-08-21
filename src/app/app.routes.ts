// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DogBreedsAppComponent } from '../app/components/dog-breeds-app/dog-breeds-app.component';

export const routes: Routes = [
  {
    path: '',
    component: DogBreedsAppComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
