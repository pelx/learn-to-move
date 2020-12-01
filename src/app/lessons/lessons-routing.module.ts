import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonsPage } from './lessons.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: LessonsPage,
    children: [ {
      path: 'amherst-toc',
      children: [
        {
          path: '',
          loadChildren: () => import('./amherst-toc/amherst-toc.module')
            .then(m => m.AmherstTocPageModule)
        },
        {
          path: ':topicId',
          loadChildren: () => import('./lesson/lesson.module')
            .then(m => m.LessonPageModule)
        }


      ]
    },
    {
      path: 'amherst-done',
      children: [
        {
          path: '',
          loadChildren: () => import('./amherst-done/amherst-done.module')
            .then(m => m.AmherstDonePageModule),
        },
        {
          path: 'new',
          loadChildren: () => import('./new-lesson/new-lesson.module')
            .then(m => m.NewLessonPageModule)
        },
        {
          path: ':lessonId',
          loadChildren: () => import('./lesson/lesson.module')
            .then(m => m.LessonPageModule)
        }

      ]
    },
    {
      path: '',
      redirectTo: '/lessons/tabs/amherst-toc',
      pathMatch: 'full'
    }
    ]
  },
  {
    path: '',
    redirectTo: '/lessons/tabs/amherst-toc',
    pathMatch: 'full'
  }
];



@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class LessonsPageRoutingModule { }
