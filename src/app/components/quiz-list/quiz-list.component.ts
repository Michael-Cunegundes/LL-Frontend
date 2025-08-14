// src/app/components/quiz-list/quiz-list.component.ts
import { Component, OnInit }      from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuizService }            from '../../services/quiz.service';
import {
  QuestaoDTO,
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
  perguntas: QuestaoDTO[] = [];
  respostas: RespostaQuizDTO[] = [];
  level = 1;
  loading = false;
  erro = '';

  constructor(
    private quiz: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // ✅ Lê o nível da URL
    this.route.queryParams.subscribe(params => {
      this.level = +params['level'] || 1;
      this.carregarPerguntas();
    });
  }

  carregarPerguntas() {
    this.loading = true;
    this.erro = '';

    // ✅ Usar o endpoint correto por nível
    this.quiz.getQuestoesPorNivel(this.level).subscribe({
      next: (questoes) => {
        this.perguntas = questoes;
        // ✅ Prepara array de respostas
        this.respostas = this.perguntas.map(p => ({
          perguntaId: p.id,
          opcaoEscolhida: null
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar perguntas:', err);
        this.erro = 'Erro ao carregar perguntas. Tente novamente.';
        this.loading = false;
      }
    });
  }

  get canSubmit(): boolean {
    return this.respostas.every(r => r.opcaoEscolhida !== null);
  }

  submit() {
    if (!this.canSubmit) return;

    this.loading = true;
    this.quiz.submitRespostas(this.respostas).subscribe({
      next: (resultado) => {
        this.router.navigate(
          ['/resultado'],
          {
            state: {
              resultado,
              level: this.level
            }
          }
        );
      },
      error: (err) => {
        console.error('Erro ao enviar respostas:', err);
        this.erro = 'Erro ao enviar respostas. Tente novamente.';
        this.loading = false;
      }
    });
  }

  // ✅ Métodos públicos para o template
  getRespostasPreenchidas(): number {
    return this.respostas.filter(r => r.opcaoEscolhida !== null).length;
  }

  voltarNiveis(): void {
    this.router.navigate(['']);
  }
}
