import { Component, Input, OnInit } from '@angular/core';
import { Lesson } from '../../../interfaces/lesson.model';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: [ './card-item.component.scss' ],
})
export class CardItemComponent implements OnInit {
  @Input() lesson: Lesson;

  constructor() { }

  ngOnInit() {
  }

}
