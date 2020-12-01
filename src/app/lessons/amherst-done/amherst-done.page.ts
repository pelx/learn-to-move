import { Component, OnDestroy, OnInit } from '@angular/core';
import { AmherstDoneService } from './amherst-done.service';
import { Lesson } from '../../interfaces/lesson.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-amherst-done',
  templateUrl: './amherst-done.page.html',
  styleUrls: [ './amherst-done.page.scss' ],
})
export class AmherstDonePage implements OnInit, OnDestroy {
  lessons: Lesson[];
  private subs: Subscription;
  isLoading = false;

  constructor(
    private amherstDoneService: AmherstDoneService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.subs = this.amherstDoneService.lessons.subscribe(lessons => {
      this.lessons = lessons;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.amherstDoneService.fetchLessons()
      .subscribe(() => {
        this.isLoading = false;
      },
        error => {
          this.alertCtrl.create({
            header: 'An error occured!',
            message: 'Error fetching Archived Lessons. Please try later.',
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

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
