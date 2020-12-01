import { Lesson } from './../../interfaces/lesson.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { AmherstDoneService } from '../amherst-done/amherst-done.service';
import { LessonOutlineComponent } from '../lesson-outline/lesson-outline.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.page.html',
  styleUrls: [ './lesson.page.scss' ],
})
export class LessonPage implements OnInit, OnDestroy {
  lesson: Lesson;
  form: FormGroup;
  sub: Subscription;
  isLoading = false;
  lessonId: string;

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private lessonsService: AmherstDoneService,
    private modalCtrl: ModalController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('lessonId')) {
        this.navCtrl.navigateBack('/lessons/tabs/amherst-done');
        return;
      }

      this.lessonId = paramMap.get('lessonId');
      this.isLoading = true;

      this.sub = this.lessonsService.getLesson(paramMap.get('lessonId'))
        .subscribe(lesson => {
          this.lesson = lesson;
          this.form = new FormGroup({
            source: new FormControl(this.lesson.source, {
              updateOn: 'blur',
              validators: [ Validators.required, Validators.maxLength(150) ]
            }),
            title: new FormControl(this.lesson.title, {
              updateOn: 'blur',
              validators: [ Validators.required, Validators.maxLength(250) ]
            }),
            notes: new FormControl(this.lesson.notes, {
              updateOn: 'blur',
              validators: [ Validators.required ]
            }),
            recordDate: new FormControl(this.lesson.recordDate, {
              updateOn: 'blur',
              validators: [ Validators.required ]
            })
          });
          this.isLoading = false;
        });
    },
      error => {
        this.alertCtrl.create({
          header: 'An error occured!',
          message: 'Error fetching the lesson. Please try later.',
          buttons: [ {
            text: 'Okay',
            handler: () => {
              this.router.navigateByUrl('/lessons/tabs/amherst-done');
            }
          } ]
        }).then(alertEl => {
          alertEl.present();
        });
      }
    );
  }

  onUpdate() {
    if (this.form.invalid) {
      return;
    }

    this.loadingCtrl.create({
      message: 'Updating...'
    }).then(loadingEl => {
      loadingEl.present();
      this.lessonsService.updateLesson(
        new Lesson(
          this.form.value.source,
          this.form.value.title,
          this.form.value.notes,
          this.lesson.lessonId,
          this.form.value.recordDate,
          this.lesson.recordUrl,
          this.lesson.userId))
        .subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigateByUrl('/lessons/tabs/amherst-done');
        });
    });
  }

  onDelete() {
    this.lessonsService.deleteLesson(this.lessonId);
    this.router.navigateByUrl('/lessons/tabs/amherst-done');
  }
  onClick() {
    // this.navCtrl.navigateBack('lessons/tabs/amherst-done');
    this.modalCtrl.create({
      component: LessonOutlineComponent,
      componentProps: { selectedLesson: this.lesson }
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(res => {
        console.log('data:', res.data, 'role:', res.role);
      });
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
