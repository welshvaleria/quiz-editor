import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private httpSvc: HttpClient) { }

  loadQuizzes() {

    return this.httpSvc.get('https://modern-js.azurewebsites.net/api/HttpTriggerJS1?code=8XD3vN3ehHLdZacBQJQhgUnNst9202gdd5VM3kWCytDkz2nXhia6kA==&name=Mystery%20Quiz');

  }

  getMagicNumberPromise(callerWantsMeToSucceed: boolean): Promise<number> {
      return new Promise<number>(
        (resolve, reject) => {
          // 
          // Do some long running activity here...
          //
          // So caller can continue and you will resolve when finished...
          //

          // Resolve or reject appropriately when finished.
          callerWantsMeToSucceed ? resolve(42) : reject("No magic number for you : - (")

        }
      ); 
  }

}


