import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonPageRoutingModule } from './lesson-routing.module';

import { LessonPage } from './lesson.page';
import { LessonOutlineComponent } from '../lesson-outline/lesson-outline.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    LessonPageRoutingModule
  ],
  declarations: [ LessonPage, LessonOutlineComponent ]
})
export class LessonPageModule { }
