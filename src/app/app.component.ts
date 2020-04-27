import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

interface QuizDisplay {
  name: string;
  //questionCount: number;
  questions: QuestionDisplay[];
  markForDelete: boolean;
}

interface QuestionDisplay {
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

//@Component({
//selector: 'ngbd-popover-basic',
//templateUrl: './popover-basic.html'
//})
//export class NgbdPopoverBasic {
//}

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
        this.quizzes = (data as QuizDisplay[]).map(x => ({
          name: x.name
          //, questionCount: x.questions.length
          , questions: x.questions
          , markForDelete: false
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
      //, questionCount: 1
      , questions: []
      , markForDelete: false
    };

    this.quizzes = [
      ...this.quizzes
      , newQuiz
    ];

    this.selectQuiz(newQuiz);
  }

  addNewQuestion() {
    this.selectedQuiz.questions = [
      ...this.selectedQuiz.questions
      , {
        name: "New Untitled Question"
      }
    ];
  }

  removeQuestion(question: QuestionDisplay) {
    this.selectedQuiz.questions = this.selectedQuiz.questions.filter(x => x != question);
  }

  jsPromisesOne() {
      const x = this.quizSvc.getMagicNumberPromise(true);
      console.log(x); // ???  

      x.then(x => {
        console.log(x)

        const y = this.quizSvc.getMagicNumberPromise(false);
        console.log(y);

        y.then(z => console.log(z)).catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  async jsPromisesTwo() {
    try {
      const x = await this.quizSvc.getMagicNumberPromise(true);
      console.log(x); // 42 appears instantly due to the await

      const y = await this.quizSvc.getMagicNumberPromise(false);
      console.log(y); // no magic number for you message
    }
    catch(err) {
      console.error(err);
    }
  }

  async jsPromisesThree() {
    try {
      const x = this.quizSvc.getMagicNumberPromise(true);
      console.log(x); // 42 appears instantly due to the await

      const y = this.quizSvc.getMagicNumberPromise(true);
      console.log(y); // no magic number for you message

      const results = await Promise.all([x, y]);
      
      
      //const results = await Promise.race([x, y]);
      //method returns a promise that fulfills or rejects as soon as one of the promises 
      //in an iterable fulfills or rejects, with the value or reason from that promise.

      console.log(results); // we get an array of 42 results
    }
    catch(err) {
      console.error(err);
    }
  }

}
