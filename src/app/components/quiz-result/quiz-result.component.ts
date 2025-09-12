// src/app/components/quiz-result/quiz-result.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResultadoQuizDTO, RespostaDetalhada } from '../../models';

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
        <!-- Card de Resumo -->
        <div class="result-card">
          <div class="result-icon">
            <span *ngIf="pontuacaoPercentual >= 80">🎉</span>
            <span *ngIf="pontuacaoPercentual >= 60 && pontuacaoPercentual < 80">👍</span>
            <span *ngIf="pontuacaoPercentual < 60">📚</span>
          </div>

          <h2>{{ tituloResultado }}</h2>

          <div class="score-display">
            <div class="score-circle">
              <span class="score-number">{{ resultado?.pontuacao || 0 }}</span>
              <span class="score-total">/ {{ totalPerguntas }}</span>
            </div>
            <p class="score-percentage">{{ pontuacaoPercentual }}%</p>
          </div>

          <p class="result-message">{{ resultado?.mensagem || 'Resultado não disponível' }}</p>

          <!-- ✅ NOVO: Resumo Simples das Respostas -->
          <div class="questions-summary" *ngIf="respostasDetalhadas && respostasDetalhadas.length > 0">
            <div class="summary-header">
              <h3>📝 Resumo das Respostas</h3>
            </div>

            <!-- Mensagem personalizada -->
            <div class="summary-message">
              <p *ngIf="totalAcertos === totalPerguntas" class="perfect-score">
                🌟 Perfeito! Você acertou todas as {{ totalPerguntas }} questões!
              </p>
              <p *ngIf="totalAcertos > 0 && totalAcertos < totalPerguntas" class="partial-score">
                Você acertou {{ getQuestoesAcertadasTexto() }}
              </p>
              <p *ngIf="totalAcertos === 0" class="zero-score">
                Você não acertou nenhuma questão desta vez. Continue praticando!
              </p>
            </div>

            <!-- Grid visual das questões -->
            <div class="questions-grid">
              <div
                *ngFor="let resposta of respostasDetalhadas; let i = index"
                class="question-box"
                [class.correct]="resposta.acertou"
                [class.incorrect]="!resposta.acertou"
                [title]="getTooltip(resposta, i)">
                <span class="question-number">{{ i + 1 }}</span>
                <span class="question-status">
                  {{ resposta.acertou ? '✓' : '✗' }}
                </span>
              </div>
            </div>

            <!-- Legenda -->
            <div class="legend">
              <div class="legend-item">
                <span class="legend-box correct"></span>
                <span>Acertou</span>
              </div>
              <div class="legend-item">
                <span class="legend-box incorrect"></span>
                <span>Errou</span>
              </div>
            </div>

            <!-- Gabarito opcional -->
            <div class="gabarito-section" *ngIf="mostrarGabarito">
              <h4>Gabarito:</h4>
              <div class="gabarito-list">
                <div *ngFor="let resposta of respostasDetalhadas; let i = index" class="gabarito-item">
                  <span class="gabarito-number">{{ i + 1 }}.</span>
                  <span class="gabarito-answer">{{ getRespostaCorretaSimples(resposta) }}</span>
                </div>
              </div>
            </div>

            <!-- Botão para mostrar/ocultar gabarito -->
            <button
              class="btn-gabarito"
              (click)="mostrarGabarito = !mostrarGabarito">
              {{ mostrarGabarito ? '🙈 Ocultar' : '👀 Ver' }} Gabarito
            </button>
          </div>

          <div class="feedback" [ngClass]="feedbackClass">
            <p>{{ feedback }}</p>
          </div>
        </div>

        <!-- Estatísticas rápidas -->
        <div class="stats-cards" *ngIf="respostasDetalhadas">
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-value">{{ totalAcertos }}</div>
            <div class="stat-label">Acertos</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">❌</div>
            <div class="stat-value">{{ totalErros }}</div>
            <div class="stat-label">Erros</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-value">{{ pontuacaoPercentual }}%</div>
            <div class="stat-label">Aproveitamento</div>
          </div>
          <div class="stat-card" *ngIf="tempoTotal">
            <div class="stat-icon">⏱️</div>
            <div class="stat-value">{{ formatarTempoTotal() }}</div>
            <div class="stat-label">Tempo Total</div>
          </div>
        </div>

        <!-- Botões de ação -->
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
      transition: all 0.2s ease;
    }

    .back-btn:hover {
      background: #2c5282;
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
      padding: 40px 20px;
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
    }

    .result-card {
      background: #2d3748;
      border: 1px solid #4a5568;
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      margin-bottom: 30px;
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
      box-shadow: 0 10px 30px rgba(49, 130, 206, 0.3);
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
      color: #63b3ed;
      margin: 0;
    }

    .result-message {
      color: #a0aec0;
      font-size: 1.1rem;
      margin: 20px 0;
    }

    /* ✅ NOVO: Estilos para o resumo simplificado */
    .questions-summary {
      background: #1a202c;
      border-radius: 12px;
      padding: 25px;
      margin: 30px 0;
      border: 1px solid #4a5568;
    }

    .summary-header h3 {
      color: white;
      font-size: 1.2rem;
      margin: 0 0 20px 0;
      font-weight: 500;
    }

    .summary-message {
      margin-bottom: 25px;
    }

    .summary-message p {
      font-size: 1rem;
      line-height: 1.6;
      margin: 0;
    }

    .perfect-score {
      color: #68d391;
      font-weight: 600;
    }

    .partial-score {
      color: #63b3ed;
    }

    .zero-score {
      color: #fc8181;
    }

    .questions-grid {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .question-box {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid;
    }

    .question-box.correct {
      background: rgba(72, 187, 120, 0.1);
      border-color: #48bb78;
    }

    .question-box.incorrect {
      background: rgba(245, 101, 101, 0.1);
      border-color: #f56565;
    }

    .question-box:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .question-number {
      font-size: 0.9rem;
      color: #a0aec0;
      font-weight: 600;
    }

    .question-status {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .question-box.correct .question-status {
      color: #48bb78;
    }

    .question-box.incorrect .question-status {
      color: #f56565;
    }

    .legend {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #4a5568;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #a0aec0;
      font-size: 0.9rem;
    }

    .legend-box {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 2px solid;
    }

    .legend-box.correct {
      background: rgba(72, 187, 120, 0.1);
      border-color: #48bb78;
    }

    .legend-box.incorrect {
      background: rgba(245, 101, 101, 0.1);
      border-color: #f56565;
    }

    /* Gabarito */
    .gabarito-section {
      margin-top: 20px;
      padding: 20px;
      background: #2d3748;
      border-radius: 8px;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        max-height: 0;
      }
      to {
        opacity: 1;
        max-height: 500px;
      }
    }

    .gabarito-section h4 {
      color: #63b3ed;
      margin: 0 0 15px 0;
      font-size: 1rem;
    }

    .gabarito-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 10px;
      text-align: left;
    }

    .gabarito-item {
      display: flex;
      gap: 8px;
      color: #a0aec0;
      font-size: 0.9rem;
    }

    .gabarito-number {
      font-weight: 600;
      color: #63b3ed;
    }

    .btn-gabarito {
      background: #4a5568;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 15px;
      font-size: 0.9rem;
    }

    .btn-gabarito:hover {
      background: #718096;
    }

    /* Feedback */
    .feedback {
      padding: 20px;
      border-radius: 12px;
      margin-top: 20px;
      font-weight: 500;
      border: 1px solid;
    }

    .feedback.excellent {
      background: rgba(72, 187, 120, 0.1);
      color: #68d391;
      border-color: #48bb78;
    }

    .feedback.good {
      background: rgba(99, 179, 237, 0.1);
      color: #63b3ed;
      border-color: #4299e1;
    }

    .feedback.needs-improvement {
      background: rgba(252, 129, 129, 0.1);
      color: #fc8181;
      border-color: #f56565;
    }

    /* Cards de estatísticas */
    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: #2d3748;
      border: 1px solid #4a5568;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .stat-icon {
      font-size: 1.5rem;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: white;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #a0aec0;
    }

    /* Botões de ação */
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
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: transparent;
      color: #a0aec0;
      border: 1px solid #4a5568;
    }

    .btn-secondary:hover {
      border-color: #3182ce;
      color: white;
      background: rgba(49, 130, 206, 0.1);
    }

    /* Responsividade */
    @media (max-width: 768px) {
      .result-card {
        padding: 25px;
      }

      .questions-grid {
        gap: 8px;
      }

      .question-box {
        width: 50px;
        height: 50px;
      }

      .stats-cards {
        grid-template-columns: repeat(2, 1fr);
      }

      .legend {
        flex-direction: column;
        gap: 10px;
        align-items: center;
      }
    }
  `]
})
export class QuizResultComponent {
  resultado: ResultadoQuizDTO | null = null;
  respostasDetalhadas: RespostaDetalhada[] | null = null;
  level: number = 1;
  totalPerguntas: number = 5;
  mostrarGabarito: boolean = false;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if (state) {
      this.resultado = state['resultado'];
      this.level = state['level'] || 1;
      this.respostasDetalhadas = state['respostasDetalhadas'] || null;

      if (this.respostasDetalhadas) {
        this.totalPerguntas = this.respostasDetalhadas.length;
      }
    }
  }

  get totalAcertos(): number {
    if (!this.respostasDetalhadas) return 0;
    return this.respostasDetalhadas.filter(r => r.acertou).length;
  }

  get totalErros(): number {
    if (!this.respostasDetalhadas) return 0;
    return this.respostasDetalhadas.filter(r => !r.acertou).length;
  }

  get tempoTotal(): number {
    if (!this.respostasDetalhadas) return 0;
    return this.respostasDetalhadas.reduce((sum, r) => sum + (r.tempoResposta || 0), 0);
  }

  get pontuacaoPercentual(): number {
    if (!this.resultado) return 0;
    return Math.round((this.resultado.pontuacao / this.totalPerguntas) * 100);
  }

  get feedback(): string {
    const percentual = this.pontuacaoPercentual;
    if (percentual >= 80) {
      return 'Excelente! Você dominou este nível!';
    } else if (percentual >= 60) {
      return 'Bom trabalho! Continue praticando para melhorar.';
    } else {
      return 'Precisa de mais prática. Revise o conteúdo e tente novamente!';
    }
  }

  get tituloResultado(): string {
    const acertos = this.resultado?.pontuacao || 0;
    if (acertos >= 4) {
      return '🎉 Parabéns! Nível desbloqueado!';
    } else {
      return '💪 Continue tentando!';
    }
  }

  get feedbackClass(): string {
    const percentual = this.pontuacaoPercentual;
    if (percentual >= 80) return 'excellent';
    if (percentual >= 60) return 'good';
    return 'needs-improvement';
  }

  getQuestoesAcertadasTexto(): string {
    if (!this.respostasDetalhadas) return '';

    const questoesCorretas = this.respostasDetalhadas
      .map((r, i) => r.acertou ? i + 1 : null)
      .filter(n => n !== null);

    if (questoesCorretas.length === 0) return 'nenhuma questão';
    if (questoesCorretas.length === 1) return `a questão ${questoesCorretas[0]}`;

    // Formatar lista: "as questões 1, 3 e 5"
    const ultimaQuestao = questoesCorretas.pop();
    return `as questões ${questoesCorretas.join(', ')} e ${ultimaQuestao}`;
  }

  getTooltip(resposta: RespostaDetalhada, index: number): string {
    const numero = index + 1;
    return resposta.acertou
      ? `Questão ${numero}: Correta ✓`
      : `Questão ${numero}: Incorreta ✗`;
  }

  getRespostaCorretaSimples(resposta: RespostaDetalhada): string {
    const pergunta = resposta.pergunta;

    if (pergunta.tipo === 'IMAGEM_PARA_TEXTO') {
      return pergunta.opcoes[pergunta.indiceCorreto]?.texto || 'N/A';
    } else {
      return pergunta.prompt[0]; // Para TEXTO_PARA_IMAGEM, a resposta é o próprio prompt
    }
  }

  formatarTempoTotal(): string {
    const seconds = Math.floor(this.tempoTotal / 1000);
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  voltarNiveis(): void {
    this.router.navigate(['']);
  }

  refazerQuiz(): void {
    this.router.navigate(['/quiz'], { queryParams: { level: this.level } });
  }
}
