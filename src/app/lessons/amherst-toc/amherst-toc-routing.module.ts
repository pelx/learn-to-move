import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmherstTocPage } from './amherst-toc.page';

const routes: Routes = [
  {
    path: '',
    component: AmherstTocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmherstTocPageRoutingModule {}
