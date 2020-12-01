import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewLessonPageRoutingModule } from './new-lesson-routing.module';

import { NewLessonPage } from './new-lesson.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewLessonPageRoutingModule
  ],
  declarations: [ NewLessonPage ]
})
export class NewLessonPageModule { }
