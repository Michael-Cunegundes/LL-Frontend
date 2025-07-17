// src/app/components/quiz-list/quiz-list.ts
import { Component, OnInit }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { Router }               from '@angular/router';
import { QuizService }          from '../../services/quiz.service';
import {
  PerguntaDTO,
  RespostaQuizDTO,
  ResultadoQuizDTO
} from '../../models';

@Component({
  selector: 'quiz-list',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './quiz-list.html'
})
export class QuizListComponent implements OnInit {
  perguntas: PerguntaDTO[] = [];
  respostas: RespostaQuizDTO[] = [];

  constructor(private quiz: QuizService, private router: Router) {}

  ngOnInit() {
    this.quiz.getPerguntas().subscribe(list => {
      this.perguntas = list;
      this.respostas = list.map(p => ({
        perguntaId: p.id,
        opcaoEscolhida: null
      }));
    });
  }

get canSubmit(): boolean {
  // Só habilita quando **todas** as respostas foram marcadas
  return this.respostas.every(r => r.opcaoEscolhida != null);
}

  submit() {
    this.quiz.submitRespostas(this.respostas)
      .subscribe((res: ResultadoQuizDTO) => {
        this.router.navigate(['resultado'], { state: { resultado: res } });
      });
  }
}
