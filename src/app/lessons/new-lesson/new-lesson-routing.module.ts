import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewLessonPage } from './new-lesson.page';

const routes: Routes = [
  {
    path: '',
    component: NewLessonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewLessonPageRoutingModule {}
