import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmherstDonePage } from './amherst-done.page';

const routes: Routes = [
  {
    path: '',
    component: AmherstDonePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmherstDonePageRoutingModule {}
