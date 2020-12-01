import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Lesson } from 'src/app/interfaces/lesson.model';
import { AmherstDoneService } from '../amherst-done/amherst-done.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-lesson',
  templateUrl: './new-lesson.page.html',
  styleUrls: [ './new-lesson.page.scss' ],
})
export class NewLessonPage implements OnInit {
  form: FormGroup;
  recDate: Date;
  maxDate: Date;

  constructor(
    private doneService: AmherstDoneService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.recDate = new Date();
    this.maxDate = new Date(this.recDate.setDate(this.recDate.getDate() + 3));
    this.form = new FormGroup({
      source: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required, Validators.maxLength(150) ]
      }),
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required, Validators.maxLength(250) ]
      }),
      notes: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required ]
      }),
      recordDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [ Validators.required ]
      })

    });
  }

  onCreateLesson() {
    if (this.form.invalid) {
      return;
    }

    this.loadingCtrl.create({
      message: 'Please wait...'
    })
      .then(loadingEl => {
        loadingEl.present();
        const newLesson = new Lesson(
          this.form.value.source,
          this.form.value.title,
          this.form.value.notes,
          '0',
          this.form.value.recordDate,
          '',
          ''
        );
        this.doneService.addLesson(newLesson)
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigateByUrl('/lessons/tabs/amherst-done');
          });
      });
  }
}
