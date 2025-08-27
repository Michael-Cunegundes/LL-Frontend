// Apenas cole ESTA PARTE no arquivo quiz-result.component.ts

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
      <!-- Header consistente -->
      <header class="result-header">
        <div class="header-content">
          <button class="back-btn" (click)="voltarNiveis()">
            <span>←</span> Voltar aos Níveis
          </button>
          <div class="header-info">
            <h1>Resultado do Quiz - Nível {{ level }}</h1>
          </div>
        </div>
      </header>

      <!-- Conteúdo principal -->
      <div class="result-content">
        <div class="result-card">
          <div class="result-icon">
            <span *ngIf="pontuacaoPercentual >= 80">🎉</span>
            <span *ngIf="pontuacaoPercentual >= 60 && pontuacaoPercentual < 80">👍</span>
            <span *ngIf="pontuacaoPercentual < 60">📚</span>
          </div>

          <h2>Quase!</h2>

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
    </div>
  `,
  styles: [`
    .result-container {
      min-height: 100vh;
      background: #1a202c;
      display: flex;
      flex-direction: column;
    }

    .result-header {
      padding: 25px;
      background: #2d3748;
      border-bottom: 1px solid #4a5568;
    }

    .header-content {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .back-btn {
      background: #3182ce;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .back-btn:hover {
      background: #2c5282;
    }

    .back-btn span {
      font-size: 1.2rem;
    }

    .header-info {
      flex: 1;
      text-align: center;
      color: white;
    }

    .header-info h1 {
      font-size: 1.5rem;
      margin: 0;
      font-weight: 500;
    }

    .result-content {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
    }

    .result-card {
      background: #2d3748;
      border: 1px solid #4a5568;
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    .result-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    h2 {
      color: white;
      font-size: 2rem;
      font-weight: 500;
      margin-bottom: 30px;
    }

    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(45deg, #3182ce, #667eea);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .score-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: white;
    }

    .score-total {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .score-percentage {
      font-size: 1.5rem;
      font-weight: 600;
      color: #3182ce;
      margin: 0;
    }

    .result-message {
      color: #a0aec0;
      font-size: 1.1rem;
      margin: 20px 0;
    }

    .feedback {
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 30px;
      font-weight: 500;
      border: 1px solid;
    }

    .feedback.excellent {
      background: #1a365d;
      color: #63b3ed;
      border-color: #3182ce;
    }

    .feedback.good {
      background: #2d3748;
      color: #fbb6ce;
      border-color: #ed64a6;
    }

    .feedback.needs-improvement {
      background: #2d3748;
      color: #fc8181;
      border-color: #e53e3e;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 160px;
    }

    .btn-primary {
      background: #3182ce;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #2c5282;
    }

    .btn-secondary {
      background: transparent;
      color: #a0aec0;
      border: 1px solid #4a5568;
    }

    .btn-secondary:hover {
      border-color: #3182ce;
      color: white;
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
      return 'Boa! Você passou por este nível de LIBRAS!';
    } else if (percentual >= 60) {
      return 'Você precisa acerta pelo menos 4 para desbloquear o proximo nivel.';
    } else {
      return 'Você precisa acerta pelo menos 4 para desbloquear o proximo nivel.';
    }
  }

get tituloResultado(): string {
  const acertos = this.resultado?.pontuacao || 0;

  if (acertos >= 4) {
    return 'Parabéns!';
  } else {
    return 'Continue tentando!';
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
