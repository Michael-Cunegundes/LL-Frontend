// src/app/components/quiz-list/quiz-list.component.ts
import { Component, OnInit }      from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuizService }            from '../../services/quiz.service';
import {
  PerguntaDTO,
  RespostaQuizDTO
} from '../../models';

@Component({
  selector: 'quiz-list',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {
  allPerguntas: PerguntaDTO[] = [];
  perguntas: PerguntaDTO[] = [];
  respostas: RespostaQuizDTO[] = [];
  level = 1;
  readonly perguntasPorNivel = 5;

  constructor(
    private quiz: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // lê o ?level=X da URL e recarrega o quiz sempre que mudar
    this.route.queryParams.subscribe(params => {
      this.level = +params['level'] || 1;
      this.carregarPerguntas();
    });
  }

  private carregarPerguntas() {
    this.quiz.getPerguntas().subscribe(list => {
      this.allPerguntas = list;
      // calcula início/fim do slice
      const start = (this.level - 1) * this.perguntasPorNivel;
      this.perguntas = this.allPerguntas.slice(
        start,
        start + this.perguntasPorNivel
      );
      // prepara array de respostas
      this.respostas = this.perguntas.map(p => ({
        perguntaId: p.id,
        opcaoEscolhida: null
      }));
    });
  }

  get canSubmit(): boolean {
    return this.respostas.every(r => r.opcaoEscolhida != null);
  }

  submit() {
    this.quiz.submitRespostas(this.respostas)
      .subscribe(res => {
        this.router.navigate(
          ['/resultado'],
          { state: { resultado: res } }
        );
      });
  }
}
