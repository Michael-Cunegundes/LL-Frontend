// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { QuizListComponent }   from './components/quiz-list/quiz-list';
import { QuizResultComponent } from './components/quiz-result/quiz-result';

export const routes: Routes = [
  { path: '',          component: QuizListComponent },
  { path: 'resultado', component: QuizResultComponent },
  { path: '**',        redirectTo: '' }
];
