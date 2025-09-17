// src/app/components/level-list/level-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SessionService } from '../../services/session.service';

interface NivelInfo {
  numero: number;
  nome: string;
  emoji: string;
  descricao: string;
  totalPerguntas: number;
  disponivel: boolean;
  completado: boolean;
  pontuacao?: number;
  emBreve?: boolean;
}

@Component({
  selector: 'level-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="main-container">
      <div class="content-wrapper">
        <!-- Lado Esquerdo - Níveis -->
        <div class="levels-section">
          <header class="app-header">
            <h1>LibraLingo</h1>
            <p class="subtitle">Escolha seu nível:</p>

          </header>

          <div class="levels-stack">
            <div *ngFor="let nivel of niveis; let i = index"
                 class="level-item"
                 [class.available]="nivel.disponivel && !nivel.emBreve"
                 [class.locked]="!nivel.disponivel || nivel.emBreve"
                 [class.completed]="nivel.completado"
                 [class.em-breve]="nivel.emBreve"
                 [style.animation-delay]="(i * 0.1) + 's'">

              <div class="level-content">
                <!-- Ícone do nível -->
                <div class="level-icon">
                  <span *ngIf="nivel.disponivel && !nivel.emBreve">{{ nivel.emoji }}</span>
                  <span *ngIf="!nivel.disponivel && !nivel.emBreve">🔒</span>
                  <span *ngIf="nivel.emBreve">⏳</span>
                </div>

                <!-- Informações do nível -->
                <div class="level-info">
                  <h3>{{ nivel.nome }}</h3>
                  <p>{{ nivel.descricao }}</p>

                  <!-- Status do nível -->
                  <div class="level-status">
                    <div *ngIf="nivel.completado && nivel.pontuacao !== undefined" class="completion-info">
                      <span class="score">{{ nivel.pontuacao }}/{{ nivel.totalPerguntas }}</span>
                      <span class="percentage">({{ getPercentual(nivel.pontuacao!, nivel.totalPerguntas) }}%)</span>
                      <span class="status-icon" [innerHTML]="getStatusIcon(nivel.pontuacao!, nivel.totalPerguntas)"></span>
                    </div>

                    <div *ngIf="!nivel.completado && nivel.disponivel && !nivel.emBreve" class="level-stats">
                      <span class="questions-count">{{ nivel.totalPerguntas }} perguntas</span>
                    </div>

                    <div *ngIf="!nivel.disponivel && !nivel.emBreve" class="locked-message">
                      <span>Complete o nível anterior com 4+ acertos</span>
                    </div>

                    <div *ngIf="nivel.emBreve" class="coming-soon-message">
                      <span>Em desenvolvimento</span>
                    </div>
                  </div>
                </div>

                <!-- Ação do nível -->
                <div class="level-action">
                  <button
                    *ngIf="nivel.disponivel && !nivel.emBreve"
                    class="start-btn"
                    [class.replay]="nivel.completado"
                    [routerLink]="['/quiz']"
                    [queryParams]="{level: nivel.numero}">
                    {{ nivel.completado ? 'Jogar novamente' : 'Começar' }}
                  </button>

                  <button
                    *ngIf="!nivel.disponivel && !nivel.emBreve"
                    class="locked-btn"
                    disabled>
                    Bloqueado
                  </button>

                  <button
                    *ngIf="nivel.emBreve"
                    class="coming-soon-btn"
                    disabled>
                    Em breve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lado Direito - Hero Section -->
        <div class="hero-section">
          <div class="hero-content">
            <!-- Estatísticas (se houver progresso) -->
            <div class="progress-stats" *ngIf="estatisticas">
              <h2>Seu Progresso Atual</h2>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-number">{{ estatisticas.niveisCompletados }}</span>
                  <span class="stat-label">Níveis feitos</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ estatisticas.totalAcertos }}</span>
                  <span class="stat-label">Total de acertos</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ estatisticas.mediaPercentual }}%</span>
                  <span class="stat-label">Média</span>
                </div>
              </div>
            </div>

            <!-- Logo -->
            <div class="libras-demo">
              <div class="logo-container">
                <div class="logo-circle">
                  <span class="logo-hands">🤟</span>
                </div>
                <div class="logo-text">LibraLingo</div>

              </div>
            </div>

<div class="hero-text">
  <h2>Aprenda LIBRAS</h2>
  <p class="intro-text">
    Descubra a Língua Brasileira de Sinais de forma interativa.
    Complete cada nível com 4+ acertos para desbloquear o próximo!
  </p>

  <!-- Cards Informativos Expansíveis -->
  <div class="info-cards">
    <div class="info-card" [class.expanded]="expandedCard === 0" (click)="toggleCard(0)">
      <div class="card-header">
        <span class="card-icon">⚖️</span>
        <span class="card-title">Legislação Brasileira</span>
        <span class="card-arrow">{{ expandedCard === 0 ? '▼' : '▶' }}</span>
      </div>
      <div class="card-content">
        A Lei nº 10.436/2002 reconhece a Libras como meio legal de comunicação e expressão.
        O Decreto nº 5.626/2005 regulamenta esta lei, tornando obrigatório o ensino de Libras
        em cursos de formação de professores e fonoaudiologia.
      </div>
    </div>

    <div class="info-card" [class.expanded]="expandedCard === 1" (click)="toggleCard(1)">
      <div class="card-header">
        <span class="card-icon">🌍</span>
        <span class="card-title">Libras no Mundo</span>
        <span class="card-arrow">{{ expandedCard === 1 ? '▼' : '▶' }}</span>
      </div>
      <div class="card-content">
        A língua de sinais não é universal. Cada país possui sua própria língua de sinais
        com gramática, vocabulário e expressões culturais únicas. A Libras é específica
        do Brasil e é diferente da ASL (americana) ou LSF (francesa).
      </div>
    </div>

    <div class="info-card" [class.expanded]="expandedCard === 2" (click)="toggleCard(2)">
      <div class="card-header">
        <span class="card-icon">💬</span>
        <span class="card-title">Importância Social</span>
        <span class="card-arrow">{{ expandedCard === 2 ? '▼' : '▶' }}</span>
      </div>
      <div class="card-content">
        Aprender Libras quebra barreiras de comunicação e promove a inclusão real
        da comunidade surda. Permite acesso igualitário a serviços de saúde, educação
        e participação plena na sociedade.
      </div>
    </div>

    <div class="info-card" [class.expanded]="expandedCard === 3" (click)="toggleCard(3)">
      <div class="card-header">
        <span class="card-icon">📚</span>
        <span class="card-title">Como Funciona o LibraLingo</span>
        <span class="card-arrow">{{ expandedCard === 3 ? '▼' : '▶' }}</span>
      </div>
      <div class="card-content">
        Oferecemos 25 exercícios práticos divididos em 5 níveis progressivos.
        Use imagens ilustrativas para aprender sinais, receba feedback instantâneo
        e acompanhe seu progresso. Complete cada nível com 80% de acertos para avançar!
      </div>
    </div>
  </div>
</div>

  `,
  styles: [`
    /* Estilos base mantidos do componente anterior */
    .main-container {
      min-height: 100vh;
      background: #1a202c;
      display: flex;
      flex-direction: column;
    }

    .content-wrapper {
      display: flex;
      min-height: 100vh;
    }

    /* Header com info MVP */
    .levels-section {
      flex: 1;
      padding: 20px 40px;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      color: white;
      margin-bottom: 40px;
    }

    .app-header h1 {
      font-size: 4rem;
      margin-bottom: 10px;
      font-weight: 300;
      color: #FFFFFF;
      letter-spacing: -2px;
    }

    .subtitle {
      font-size: 1.2rem;
      opacity: 0.7;
      margin: 0;
      color: #A0AEC0;
      font-weight: 300;
    }

    .reset-btn {
      background: #3182ce;
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s ease;
    }

    .reset-btn:hover {
      background: #2c5282;
    }

    /* Níveis */
    .levels-stack {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 500px;
    }

    .level-item {
      background: #2d3748;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
      position: relative;
      min-height: 80px;
      border: 1px solid #4a5568;
      animation: slideInLeft 0.6s ease-out;
      animation-fill-mode: both;
    }

    .level-item.available:hover {
      transform: translateY(-2px);
      background: #4a5568;
      border-color: #3182ce;
    }

    .level-item.locked {
      opacity: 0.5;
    }

    .level-item.completed {
      border-color: #48bb78;
      background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    }

    .level-item.completed::after {
      content: '✓';
      position: absolute;
      top: 10px;
      right: 15px;
      color: #48bb78;
      font-size: 1.2rem;
      font-weight: bold;
    }

    /* ✅ Estilo para níveis "em breve" */
    .level-item.em-breve {
      opacity: 0.6;
      background: #1a202c;
      border-style: dashed;
      border-color: #4a5568;
    }

    @keyframes slideInLeft {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .level-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .level-icon {
      font-size: 2rem;
      min-width: 50px;
      text-align: center;
    }

    .level-info {
      flex: 1;
    }

    .level-info h3 {
      color: #FFFFFF;
      margin: 0 0 4px 0;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .level-info p {
      color: #A0AEC0;
      margin: 0 0 8px 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    /* Status dos níveis */
    .level-status {
      font-size: 0.85rem;
    }

    .completion-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #63B3ED;
      font-weight: 500;
    }

    .score {
      background: #4a5568;
      padding: 2px 6px;
      border-radius: 4px;
      color: white;
    }

    .percentage { color: #A0AEC0; }
    .status-icon { font-size: 1rem; }

    .level-stats {
      background: #4a5568;
      padding: 4px 10px;
      border-radius: 8px;
      display: inline-block;
      border: 1px solid #718096;
    }

    .questions-count {
      color: #63B3ED;
      font-weight: 400;
      font-size: 0.8rem;
    }

    .locked-message, .coming-soon-message {
      color: #fc8181;
      font-style: italic;
    }

    .coming-soon-message {
      color: #fbb6ce;
    }

    /* Botões de ação */
    .level-action {
      min-width: 120px;
    }

    .start-btn {
      background: #3182ce;
      color: #FFFFFF;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      min-height: 40px;
    }

    .start-btn:hover { background: #2c5282; transform: translateY(-1px); }
    .start-btn.replay { background: #48bb78; }
    .start-btn.replay:hover { background: #38a169; }

    .locked-btn {
      background: #4a5568;
      color: #A0AEC0;
      border: 1px solid #718096;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: not-allowed;
      width: 100%;
      min-height: 40px;
    }

    .coming-soon-btn {
      background: #553c9a;
      color: #E9D8FD;
      border: 1px solid #805ad5;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: not-allowed;
      width: 100%;
      min-height: 40px;
    }

    /* Hero section */
    .hero-section {
      flex: 1;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-content {
      text-align: center;
      color: white;
      max-width: 450px;
    }

    /* Estatísticas */
    .progress-stats {
      margin-bottom: 30px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
    }

    .progress-stats h2 {
      font-size: 1.5rem;
      margin-bottom: 15px;
      color: #FFFFFF;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #63B3ED;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #A0AEC0;
      opacity: 0.8;
    }

    /* Logo */
    .libras-demo {
      margin-bottom: 30px;
    }

    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      position: relative;
    }

    .logo-circle {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .logo-circle:hover {
      transform: scale(1.05);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }

    .logo-hands {
      font-size: 4rem;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
    }

    .logo-text {
      font-size: 1.8rem;
      font-weight: 600;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      letter-spacing: 1px;
    }


    .hero-text h2 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      font-weight: 300;
      color: #FFFFFF;
      letter-spacing: -1px;
    }

    .intro-text {
      font-size: 1.1rem;
      line-height: 1.6;
      opacity: 0.8;
      margin-bottom: 25px;
      text-align: center;
      color: #CBD5E1;
      font-weight: 300;
    }

    .benefits {
      display: grid;
      gap: 12px;
      text-align: left;
      margin-bottom: 25px;
    }

    .benefit {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.95rem;
    }

    .benefit:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateX(2px);
      border-color: rgba(49, 130, 206, 0.3);
    }

    .benefit-icon {
      font-size: 1.2rem;
      width: 28px;
      text-align: center;
      flex-shrink: 0;
      opacity: 0.9;
    }

    /* Responsividade */
    @media (max-width: 1024px) {
      .content-wrapper {
        flex-direction: column;
      }

      .levels-section, .hero-section {
        flex: none;
        padding: 30px 20px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .app-header h1 {
        font-size: 2.5rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stat-number {
        font-size: 1.5rem;
      }

      .level-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

    /* Cards Informativos Expansíveis */
    .info-cards {
      display: grid;
      gap: 10px;
      margin-top: 25px;
    }

    .info-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .info-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(49, 130, 206, 0.3);
      transform: translateY(-1px);
    }

    .info-card.expanded {
      background: rgba(49, 130, 206, 0.1);
      border-color: rgba(49, 130, 206, 0.4);
    }

    .card-header {
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      user-select: none;
    }

    .card-icon {
      font-size: 1.3rem;
      min-width: 28px;
      text-align: center;
    }

    .card-title {
      flex: 1;
      font-weight: 500;
      color: #E2E8F0;
      font-size: 0.95rem;
    }

    .card-arrow {
      color: #63B3ED;
      font-size: 0.8rem;
      transition: transform 0.3s ease;
    }

    .card-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
      padding: 0 18px;
      color: #A0AEC0;
      font-size: 0.85rem;
      line-height: 1.6;
    }

    .info-card.expanded .card-content {
      max-height: 200px;
      padding: 0 18px 16px 46px;
    }

    /* Animação suave para o arrow */
    .info-card.expanded .card-arrow {
      color: #63B3ED;
    }

    /* Responsividade para os cards */
    @media (max-width: 768px) {
      .info-cards {
        gap: 8px;
      }



      .card-header {
        padding: 12px 14px;
      }

      .card-content {
        font-size: 0.82rem;
      }
    }
    }
  `]
})
export class LevelListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  niveis: NivelInfo[] = [];
  estatisticas: any = null;

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    // Carregar níveis e escutar mudanças
    this.sessionService.progresso$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.atualizarDados();
      });

    this.atualizarDados();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }






  public toggleCard(index: number): void {
    if (this.expandedCard === index) {
      this.expandedCard = null; // Fecha se já estiver aberto
    } else {
      this.expandedCard = index; // Abre o card clicado
    }
  }



  private atualizarDados(): void {
    this.niveis = this.sessionService.getNiveisComStatus();
    this.estatisticas = this.sessionService.getEstatisticas();
  }

  public getPercentual(acertos: number, total: number): number {
    return Math.round((acertos / total) * 100);
  }

  public getStatusIcon(acertos: number, total: number): string {
    const percentual = this.getPercentual(acertos, total);
    if (percentual >= 80) return '🌟';
    if (percentual >= 60) return '👍';
    return '📚';
  }

  public resetarProgresso(): void {
    if (confirm('Resetar o progresso atual? (Útil para testar o MVP)')) {
      this.sessionService.resetarProgresso();
    }
  }
}
