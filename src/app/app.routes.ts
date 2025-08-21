// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DogBreedsAppComponent } from './page/dog-breeds-app.component';

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
