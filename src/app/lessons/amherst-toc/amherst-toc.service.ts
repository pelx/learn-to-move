import { Injectable } from '@angular/core';
import { Topic } from '../../interfaces/topic.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { map, take, tap, switchMap } from 'rxjs/operators';

interface TopicData {
  notes: string;
  reccordDate: string;
  sessionTapeRef: string;
  title: string;
  topicId: string;
  volume: string;
}

@Injectable({
  providedIn: 'root'
})
export class AmherstTocService {
  baseUrl = environment.databaseUrl;

  private _topics = new BehaviorSubject<Topic[]>([]);
  //   [
  //   new Topic(
  //     '9 June—13 June 1980 Week 1 Year 1',
  //     '9 June 1980',
  //     'Morning Session Tape #lb',
  //     'Introduction',
  //     'note 1',
  //     1
  //   ),
  //   new Topic(
  //     '9 June—13 June 1980 Week 1 Year 1',
  //     '9 June 1980',
  //     'Morning Session Tape #lb',
  //     'Talk—Manipulation, Orientation and Timing',
  //     'note 2',
  //     2
  //   ),

  // ];

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

  get topics() {
    return this._topics.asObservable();
  }

  getTopic(topicId: string) {
    return this.http
      .get<{ [ key: string ]: TopicData }>(`${ this.baseUrl }amherst-toc.json`);

  }

  fetchTopics() {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http
          .get<{ [ key: string ]: TopicData }>
          (`${ this.baseUrl }amherst-toc.json?auth=${ token }`);

      }),
      map(resData => {
        const topics = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            topics.push(
              new Topic(
                resData[ key ].volume,
                resData[ key ].reccordDate,
                resData[ key ].sessionTapeRef,
                resData[ key ].title,
                resData[ key ].notes,
                Number(resData[ key ].topicId)
              )
            );
          }
        }
        return topics;
      }),
      tap(topics => {
        this._topics.next(topics);
      })
    );
  }

}
