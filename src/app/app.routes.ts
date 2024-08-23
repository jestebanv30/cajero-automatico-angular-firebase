import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "auth/login",
    pathMatch: "full"
  },
  {
    path: "",
    loadChildren: () => import("./feature/feature.module").then(f => f.FeatureModule)
  }
];
