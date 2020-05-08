import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

interface QuizDisplay {
  name: string;
  //questionCount: number;
  questions: QuestionDisplay[];
  markedForDelete: boolean;
  newlyAdded: boolean;
  naiveQuizChecksum: string;
}

interface QuestionDisplay {
  name: string;
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
    this.loadAllQuizzes();
  }

  private loadAllQuizzes() {
    this.quizSvc.loadQuizzes().subscribe(data => {
      
      console.log(data);
      
      this.quizzes = (data as QuizDisplay[]).map(x => ({
        name: x.name
        , questions: x.questions
        , markedForDelete: false
        , newlyAdded: false
        , naiveQuizChecksum: this.generateNaiveChecksum(x)
      }));
      
      console.log(this.quizzes);

    }, error => this.wasErrorLoadingQuizzes = true);
  }

  generateNaiveChecksum(q: QuizDisplay) {
    const foo = q.name + q.questions.map(x => '~' + x.name).join('');
    //console.log(foo);
    return foo;
  }

  cancelAllChanges() {
    this.loadAllQuizzes();
    this.selectedQuiz = undefined;
  }

  selectQuiz(quizToSelect) {
    this.selectedQuiz = quizToSelect;
  }

  addNewQuiz() {
    const newQuiz = {
      name: "Untitled Quiz"
      //, questionCount: 1
      , questions: []
      , markedForDelete: false
      , newlyAdded: true
      , naiveQuizChecksum: ""
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
    console.log(x); // ? ? ?

    x.then(x => {
      console.log(x)

      const y = this.quizSvc.getMagicNumberPromise(false);
      console.log(y); // ? ? ?

      y.then(z => console.log(z)).catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }

  async jsPromisesTwo() {
    try {
      const x = await this.quizSvc.getMagicNumberPromise(true);
      console.log(x); // ? ? ?

      const y = await this.quizSvc.getMagicNumberPromise(false);
      console.log(y); // ? ? ? 
    }
    catch(err) {
      console.error(err);
    }
  }

  async jsPromisesThree() {
    try {
      const x = this.quizSvc.getMagicNumberPromise(true);
      console.log(x); // ? ? ?

      const y = this.quizSvc.getMagicNumberPromise(true);
      console.log(y); // ? ? ? 

      const results = await Promise.all([x, y]);
      //const results = await Promise.race([x, y]);
      console.log(results); // ? ? ?
    }
    catch(err) {
      console.error(err);
    }
  }

  get numberOfDeletedQuizzes() {
    return this.quizzes.filter(x => x.markedForDelete).length;
  }

  get numberOfAddedQuizzes() {
    return this.quizzes.filter(x => 
      x.newlyAdded 
      && !x.markedForDelete
    ).length;
  }

  get numberOfEditedQuizzes() {
    return this.quizzes.filter(x => this.isEditedQuiz(x)).length;
  }

  private isEditedQuiz(q: QuizDisplay): boolean {
    return this.generateNaiveChecksum(q) != q.naiveQuizChecksum 
      && !q.markedForDelete
      && !q.newlyAdded;
  }

  private isAddedQuiz(q: QuizDisplay): boolean {
    return q.newlyAdded && !q.markedForDelete;
  }

  saveBatchEdits() {

    const changedQuizzes = this.quizzes.filter(x => this.isEditedQuiz(x));

    const newQuizzes = this.quizzes.filter(x => this.isAddedQuiz(x))
            .map(x=> ({
                "quizName" : x.name,
                "quizQuestions" : x.questions.map(question => question.name)
            })
            );

    this.quizSvc.saveQuizzes(
      changedQuizzes
      , newQuizzes
    ).subscribe(
      data => console.log(`Web service saved ${data} edited quizzes`)
      , err => console.error(err)
    );
  }
}
