// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { QuizListComponent } from './components/quiz-list/quiz-list.component';
import { QuizResultComponent } from './components/quiz-result/quiz-result.component';
import { LevelListComponent } from './components/level-list/level-list.component';

export const routes: Routes = [
  { path: '', component: LevelListComponent },
  { path: 'quiz', component: QuizListComponent },
  { path: 'resultado', component: QuizResultComponent },
  { path: '**', redirectTo: '' }
];
