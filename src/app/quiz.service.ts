import { Injectable, ɵ_sanitizeHtml } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sharedStylesheetJitUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private httpSvc: HttpClient) { }

  loadQuizzes() {

      return this.httpSvc.get('https://modern-js.azurewebsites.net/api/HttpTriggerJS1?code=8XD3vN3ehHLdZacBQJQhgUnNst9202gdd5VM3kWCytDkz2nXhia6kA==&name=Mystery%20Quiz');
  }
}
