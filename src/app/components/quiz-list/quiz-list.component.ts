// src/app/components/quiz-list/quiz-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import {
  QuestaoDTO,
  RespostaQuizDTO
} from '../../models';

@Component({
  selector: 'quiz-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {
  perguntas: QuestaoDTO[] = [];
  respostas: RespostaQuizDTO[] = [];
  currentQuestionIndex = 0;
  selectedOption: number | null = null;
  level = 1;
  loading = false;
  erro = '';
  isAnswered = false;

  constructor(
    private quiz: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.level = +params['level'] || 1;
      this.carregarPerguntas();
    });
  }

  // ✅ MÉTODO ADICIONADO para resolver o erro String.fromCharCode
  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D...
  }

  carregarPerguntas() {
    this.loading = true;
    this.erro = '';

    this.quiz.getQuestoesPorNivel(this.level).subscribe({
      next: (questoes) => {
        this.perguntas = questoes;
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

  get currentQuestion(): QuestaoDTO | null {
    return this.perguntas[this.currentQuestionIndex] || null;
  }

  get progress(): number {
    return Math.round(((this.currentQuestionIndex + 1) / this.perguntas.length) * 100);
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.perguntas.length - 1;
  }

  selectOption(optionIndex: number) {
    this.selectedOption = optionIndex;
    this.isAnswered = true;

    // Salva a resposta
    this.respostas[this.currentQuestionIndex].opcaoEscolhida = optionIndex;
  }

  nextQuestion() {
    if (!this.isAnswered) return;

    if (this.isLastQuestion) {
      this.submitQuiz();
    } else {
      this.currentQuestionIndex++;
      this.selectedOption = null;
      this.isAnswered = false;

      // Se já havia uma resposta salva, carrega ela
      const savedAnswer = this.respostas[this.currentQuestionIndex].opcaoEscolhida;
      if (savedAnswer !== null) {
        this.selectedOption = savedAnswer;
        this.isAnswered = true;
      }
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;

      // Carrega a resposta salva
      const savedAnswer = this.respostas[this.currentQuestionIndex].opcaoEscolhida;
      this.selectedOption = savedAnswer;
      this.isAnswered = savedAnswer !== null;
    }
  }

  submitQuiz() {
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

  voltarNiveis(): void {
    this.router.navigate(['']);
  }
}
