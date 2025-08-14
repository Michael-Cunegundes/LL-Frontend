// src/app/components/quiz-result/quiz-result.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResultadoQuizDTO } from '../../models';

@Component({
  selector: 'quiz-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="result-container">
      <div class="result-card">
        <div class="result-icon">
          <span *ngIf="pontuacaoPercentual >= 80">🎉</span>
          <span *ngIf="pontuacaoPercentual >= 60 && pontuacaoPercentual < 80">👍</span>
          <span *ngIf="pontuacaoPercentual < 60">📚</span>
        </div>

        <h1>Resultado do Quiz</h1>

        <div class="score-display">
          <div class="score-circle">
            <span class="score-number">{{ resultado?.pontuacao || 0 }}</span>
            <span class="score-total">/ {{ totalPerguntas }}</span>
          </div>
          <p class="score-percentage">{{ pontuacaoPercentual }}%</p>
        </div>

        <p class="result-message">{{ resultado?.mensagem || 'Resultado não disponível' }}</p>

        <div class="feedback" [ngClass]="feedbackClass">
          <p>{{ feedback }}</p>
        </div>

        <div class="action-buttons">
          <button (click)="voltarNiveis()" class="btn btn-primary">
            Escolher Outro Nível
          </button>
          <button (click)="refazerQuiz()" class="btn btn-secondary">
            Refazer Este Nível
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .result-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .result-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 100%;
    }

    .result-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    h1 {
      color: #374151;
      margin-bottom: 30px;
      font-size: 2rem;
    }

    .score-display {
      margin-bottom: 30px;
    }

    .score-circle {
      display: inline-block;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(45deg, #6B46C1, #8B5CF6);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 15px;
      box-shadow: 0 8px 20px rgba(107, 70, 193, 0.3);
    }

    .score-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: white;
      line-height: 1;
    }

    .score-total {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .score-percentage {
      font-size: 1.5rem;
      font-weight: 600;
      color: #6B46C1;
      margin: 0;
    }

    .result-message {
      font-size: 1.2rem;
      color: #6B7280;
      margin-bottom: 25px;
    }

    .feedback {
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 30px;
      font-weight: 500;
    }

    .feedback.excellent {
      background: #ECFDF5;
      color: #065F46;
      border: 1px solid #A7F3D0;
    }

    .feedback.good {
      background: #FEF3C7;
      color: #92400E;
      border: 1px solid #FCD34D;
    }

    .feedback.needs-improvement {
      background: #FEF2F2;
      color: #991B1B;
      border: 1px solid #FECACA;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 160px;
    }

    .btn-primary {
      background: #6B46C1;
      color: white;
    }

    .btn-primary:hover {
      background: #553C9A;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #F3F4F6;
      color: #374151;
      border: 1px solid #D1D5DB;
    }

    .btn-secondary:hover {
      background: #E5E7EB;
      transform: translateY(-1px);
    }

    @media (max-width: 600px) {
      .result-card {
        padding: 30px 20px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class QuizResultComponent {
  resultado: ResultadoQuizDTO | null = null;
  level: number = 1;
  totalPerguntas: number = 5;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if (state) {
      this.resultado = state['resultado'];
      this.level = state['level'] || 1;
    }
  }

  get pontuacaoPercentual(): number {
    if (!this.resultado) return 0;
    return Math.round((this.resultado.pontuacao / this.totalPerguntas) * 100);
  }

  get feedback(): string {
    const percentual = this.pontuacaoPercentual;
    if (percentual >= 80) {
      return 'Excelente! Você domina bem esse nível de LIBRAS!';
    } else if (percentual >= 60) {
      return 'Muito bem! Continue praticando para melhorar ainda mais.';
    } else {
      return 'Continue estudando! A prática leva à perfeição.';
    }
  }

  get feedbackClass(): string {
    const percentual = this.pontuacaoPercentual;
    if (percentual >= 80) return 'excellent';
    if (percentual >= 60) return 'good';
    return 'needs-improvement';
  }

  voltarNiveis(): void {
    this.router.navigate(['']);
  }

  refazerQuiz(): void {
    this.router.navigate(['/quiz'], { queryParams: { level: this.level } });
  }
}
