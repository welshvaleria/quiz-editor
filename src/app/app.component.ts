import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

interface QuizDisplay {
  name: string;
  questionCount: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'quiz-editor';
  bg = Math.random() > 0.5 ? 'green' : 'yellow';
  borderRadius = Math.random() > 0.5 ? '30px' : '0px';
  toolTip = `This is ${this.bg} and has a border radius of ${this.borderRadius}`;

  // Need a ctor for DI of the QuizService.
  constructor(private quizSvc: QuizService) { }

  quizzes: QuizDisplay[] = [];
  selectedQuiz: QuizDisplay = undefined;
  wasErrorLoadingQuizzes = false;

  ngOnInit() {
    
    this.quizSvc.loadQuizzes().subscribe(
      data => {
        console.log(data);
        this.quizzes = (data as any).map(x => ({
          name: x.name
          , questionCount: x.questions.length
      }));
  }
      , error => this.wasErrorLoadingQuizzes = true
  );

    // this.quizzes = this.quizSvc.loadQuizzes().map(x => ({
    //   name: x
    //   , questionCount: 0
    // }));
  }

  selectQuiz(quizToSelect) {
    this.selectedQuiz = quizToSelect;
  }

  addNewQuiz() {
    const newQuiz = {
      name: "Untitled Quiz"
      , questionCount: 1
    };

    this.quizzes = [
      ...this.quizzes
      , newQuiz
    ];

    this.selectQuiz(newQuiz);
  }
}
