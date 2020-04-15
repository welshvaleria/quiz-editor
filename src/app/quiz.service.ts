import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private httpSvc: HttpClient) { }

  loadQuizzes() {
    const quizzesFromWeb = [
      "Quiz 1"
      , "Quiz 2"
      , "Quiz 3"
    ];

    return quizzesFromWeb;
  }
}
