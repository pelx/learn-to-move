import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmherstDonePageRoutingModule } from './amherst-done-routing.module';

import { AmherstDonePage } from './amherst-done.page';
import { CardItemComponent } from './card-item/card-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmherstDonePageRoutingModule
  ],
  declarations: [ AmherstDonePage, CardItemComponent ]
})
export class AmherstDonePageModule { }
