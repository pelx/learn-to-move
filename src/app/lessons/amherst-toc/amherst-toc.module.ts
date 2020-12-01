import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmherstTocPageRoutingModule } from './amherst-toc-routing.module';

import { AmherstTocPage } from './amherst-toc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmherstTocPageRoutingModule
  ],
  declarations: [AmherstTocPage]
})
export class AmherstTocPageModule {}
