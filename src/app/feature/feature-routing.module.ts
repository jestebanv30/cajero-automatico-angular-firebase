import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {authWithoutGuard} from "../core/guards/auth-without.guard";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import('./auth/auth.module').then(a => a.AuthModule),
  },
  {
    path: "dashboard",
    canActivate: [authWithoutGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(d => d.DashboardModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
