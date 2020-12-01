import { Component, OnInit, OnDestroy } from '@angular/core';
import { AmherstTocService } from './amherst-toc.service';
import { Topic } from '../../interfaces/topic.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-amherst-toc',
  templateUrl: './amherst-toc.page.html',
  styleUrls: [ './amherst-toc.page.scss' ],
})
export class AmherstTocPage implements OnInit, OnDestroy {
  topics: Topic[];
  allTopics: Topic[];
  private subs: Subscription;
  isLoading = false;

  constructor(
    private tocService: AmherstTocService,
    private alertCtrl: AlertController,
    private router: Router) { }

  ngOnInit() {
    this.subs = this.tocService.topics.subscribe(topics => {
      this.allTopics = topics;
      this.topics = topics;
    });
    this.topics = this.allTopics.filter(topic => topic.recordDate.includes('1980'));
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.tocService.fetchTopics()
      .subscribe(topics => {
        this.allTopics = topics;
        this.topics = topics;
        this.isLoading = false;
      },
        error => {
          this.alertCtrl.create({
            header: 'An error occured!',
            message: 'Error fetching Amherst Toc. Please try later.',
            buttons: [ {
              text: 'Okay',
              handler: () => {
                this.router.navigateByUrl('/lessons/tabs/amherst-toc');
              }
            } ]
          }).then(alertEl => {
            alertEl.present();
          });
        }
      );
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === '1980') {
      this.topics = this.allTopics.filter(topic => topic.recordDate.includes('1980'));
      console.log(event.detail);
    } else {
      this.topics = this.allTopics.filter(topic => topic.recordDate.includes('1981'));
    }
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }


}
