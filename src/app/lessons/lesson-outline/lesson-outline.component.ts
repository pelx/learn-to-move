import { Component, Input, OnInit } from '@angular/core';
import { Lesson } from '../../interfaces/lesson.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lesson-outline',
  templateUrl: './lesson-outline.component.html',
  styleUrls: [ './lesson-outline.component.scss' ],
})
export class LessonOutlineComponent implements OnInit {
  @Input() selectedLesson: Lesson;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  onSave() {
    this.modalCtrl.dismiss({ message: 'Save' }, 'save');

  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }


}
