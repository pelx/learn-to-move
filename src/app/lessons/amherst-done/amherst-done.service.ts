import { Injectable } from '@angular/core';
import { Lesson } from '../../interfaces/lesson.model';
import { AuthService } from '../../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

interface LessonData {
  notes: string;
  recordDate: string;
  recordUrl: string;
  source: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AmherstDoneService {
  baseUrl = environment.databaseUrl;

  private _lessons = new BehaviorSubject<Lesson[]>([]);
  //   ([
  //   new Lesson(
  //     '9—13 June 1980 Week 1 Year 1',
  //     'Introduction',
  //     'note: Morning Session Tape #lb',
  //     '1',
  //     '9 June 1980',
  //     '',
  //     'abc'
  //   ),
  //   new Lesson(
  //     '9—13 June 1980 Week 1 Year 1',
  //     'Talk—Manipulation, Orientation and Timing',
  //     'note: Morning Session Tape #lb',
  //     '2',
  //     '9 June 1980',
  //     '',
  //     'abc'
  //   ),

  // ]
  // );

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

  get lessons() {
    return this._lessons.asObservable();
  }

  fetchLessons() {
    return this.authService.user.pipe(
      take(1),
      map(user => {
        if (!user) {
          throw new Error('User not found!');
        }
        return this.http
          .get<{ [ key: string ]: LessonData }>
          (`${ this.baseUrl }recorded-lessons.json?orderBy="userId"
                             &equalTo="${ user.userId }"?auth=${ user.token }`)
          .pipe(
            take(1),
            map(resData => {
              console.log('DATA', resData);

              const lessons = [];
              for (const key in resData) {
                if (resData.hasOwnProperty(key)) {
                  lessons.push(
                    new Lesson(
                      resData[ key ].source,
                      resData[ key ].title,
                      resData[ key ].notes,
                      key,
                      resData[ key ].recordDate,
                      resData[ key ].recordUrl,
                      user.userId,
                    )
                  );
                }
              }
              return lessons;
            }),
            tap(lessons => {
              this._lessons.next(lessons);
            })
          );
      })
    );
  }

  getLesson(id: string) {
    return this.authService.user
      .pipe(
        take(1),
        switchMap(user => {
          if (!user) {
            throw new Error('No user id found!');
          }
          return this.http.get<LessonData>(`${ this.baseUrl }recorded-lessons/${ id }.json?auth=${ user.token }`)
            .pipe(
              take(1),
              map(res => {
                return new Lesson(
                  res.source,
                  res.title,
                  res.notes,
                  id,
                  res.recordDate,
                  res.recordUrl,
                  user.token);
              })
            );
        }));
  }

  addLesson(lesson: Lesson) {
    let firebaseId: string;
    let newLesson: Lesson;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        newLesson = new Lesson(
          lesson.source,
          lesson.title,
          lesson.notes,
          Math.random().toString(),
          lesson.recordDate,
          lesson.recordUrl,
          userId);
        console.log(newLesson);
        return this.http
          .post<{ name: string }>(`${ this.baseUrl }recorded-lessons.json`, { ...newLesson, lessonId: null }
          );
      }),
      switchMap(resData => {
        firebaseId = resData.name;
        return this.lessons;
      }),
      take(1),
      tap((lessons) => {
        newLesson.lessonId = firebaseId;
        this._lessons.next(lessons.concat(newLesson));
      })
    );
  }

  updateLesson(lesson: Lesson) {
    let updLessons: Lesson[];
    return this.lessons.pipe(
      take(1),
      switchMap(lessons => {
        if (!lessons || lessons.length <= 0) {
          this.fetchLessons();
        } else {
          return of(lessons);
        }
      }),
      switchMap(lessons => {
        const updLessonIdx = lessons.findIndex(l => l.lessonId === lesson.lessonId);
        updLessons = [ ...lessons ];
        updLessons[ updLessonIdx ] = lesson;
        console.log(updLessons[ updLessonIdx ]);
        return this.http.put(`${ this.baseUrl }recorded-lessons/${ lesson.lessonId }.json`,
          { ...updLessons[ updLessonIdx ], lessonId: null });
      }),
      tap((resData) => {
        this._lessons.next(updLessons);
      }));
  }

  deleteLesson(lessonId: string) {
    return this.http.delete(`${ this.baseUrl }recorded-lessons/${ lessonId }.json`)
      .pipe(
        switchMap((res) => {
          console.log(res);
          return this.lessons;
        }),
        take(1),
        tap(lessons => {
          this._lessons.next(lessons.filter(l => l.lessonId !== lessonId));
        }));
  }
}

