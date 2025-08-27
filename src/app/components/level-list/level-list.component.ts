// src/app/components/level-list/level-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'level-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="main-container">
      <!-- Lado Esquerdo - Níveis -->
      <div class="levels-section">
        <header class="app-header">
          <h1>LibraLingo</h1>
          <p class="subtitle">Escolha seu nível:</p>
        </header>

        <div class="levels-stack">
          <div *ngFor="let nivel of niveis; let i = index"
               class="level-item"
               [class.available]="nivel.disponivel"
               [class.locked]="!nivel.disponivel"
               [style.animation-delay]="(i * 0.1) + 's'">

            <div class="level-content">
              <div class="level-icon">
                <span *ngIf="nivel.disponivel">{{ nivel.emoji }}</span>
                <span *ngIf="!nivel.disponivel">🔒</span>
              </div>

              <div class="level-info">
                <h3>Nível {{ nivel.numero }}</h3>
                <p>{{ nivel.descricao }}</p>

                <div class="level-stats" *ngIf="nivel.disponivel">
                  <span class="questions-count">{{ nivel.totalPerguntas }} perguntas</span>
                </div>
              </div>

              <div class="level-action">
                <button
                  class="start-btn"
                  [disabled]="!nivel.disponivel"
                  [routerLink]="['/quiz']"
                  [queryParams]="{level: nivel.numero}"
                  *ngIf="nivel.disponivel">
                  Começar
                </button>

                <button
                  class="locked-btn"
                  disabled
                  *ngIf="!nivel.disponivel">
                  Bloqueado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção Central - Por que aprender LIBRAS? -->
      <div class="central-section">
        <div class="central-content">
          <div class="section-header">
            <h2>Por que aprender LIBRAS?</h2>
            <p>Descubra a importância da Língua Brasileira de Sinais</p>
          </div>

          <div class="info-cards">
            <div class="info-card"
                 *ngFor="let info of informacoes; let i = index"
                 [style.animation-delay]="(i * 0.2) + 's'">
              <div class="info-icon">
                <span>{{ info.icone }}</span>
              </div>
              <div class="info-content">
                <h3>{{ info.titulo }}</h3>
                <p>{{ info.descricao }}</p>
                <div class="info-stat" *ngIf="info.estatistica">
                  <span class="stat-number">{{ info.estatistica.numero }}</span>
                  <span class="stat-label">{{ info.estatistica.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="quick-facts">
            <h3>Você sabia?</h3>
            <div class="facts-grid">
              <div class="fact-item" *ngFor="let fato of fatos; let i = index">
                <span class="fact-icon">{{ fato.icone }}</span>
                <span class="fact-text">{{ fato.texto }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lado Direito - Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="libras-demo">
            <div class="logo-container">
              <div class="logo-circle">
                <span class="logo-hands">🤟</span>
              </div>
              <div class="logo-text">LibraLingo</div>
            </div>
          </div>

          <div class="hero-text">
            <h2>Aprenda Libras</h2>
            <p class="intro-text">
              Aprender Libras é essencial para promover inclusão e acessibilidade
              na nossa sociedade.
            </p>

            <div class="benefits">
              <div class="benefit">
                <span class="benefit-icon">🤝</span>
                <span>Comunicação mais justa e inclusiva</span>
              </div>
              <div class="benefit">
                <span class="benefit-icon">🧠</span>
                <span>Desenvolvimento cognitivo e empatia</span>
              </div>
              <div class="benefit">
                <span class="benefit-icon">💼</span>
                <span>Oportunidades no mercado de trabalho</span>
              </div>
              <div class="benefit">
                <span class="benefit-icon">⚖️</span>
                <span>Sociedade mais justa e humana</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="disclaimer">
        <div class="disclaimer-content">
          <div class="disclaimer-text">
            <strong></strong> Projeto educacional desenvolvido por não fluente em LIBRAS.
            Para aprendizado profissional, consulte instrutores certificados.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      height: 100vh;
      background: #1a202c;
      display: flex;
      width: 100%;
      position: relative;
      overflow: hidden;
    }

    /* === LADO ESQUERDO - NÍVEIS === */
    .levels-section {
      flex: 1;
      padding: 20px 40px;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
    }

    .app-header {
      text-align: left;
      color: white;
      margin-bottom: 40px;
    }

    .app-header h1 {
      font-size: 4rem;
      margin-bottom: 10px;
      font-weight: 300;
      text-shadow: none;
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

    .levels-stack {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 500px;
    }

    .level-item {
      background: #2d3748;  /* ✅ Cards com fundo escuro */
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
      position: relative;
      min-height: 80px;
      border: 1px solid #4a5568;  /* ✅ Borda sutil */
      animation: slideInLeft 0.6s ease-out;
      animation-fill-mode: both;
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .level-item.available:hover {
      transform: translateY(-2px);
      background: #4a5568;  /* ✅ Hover mais claro */
      border-color: #3182ce;
    }

    .level-item.locked {
      opacity: 0.5;
      background: #2d3748;
      border-color: #4a5568;
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
      color: #FFFFFF;  /* ✅ Texto branco */
      margin: 0 0 4px 0;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .level-info p {
      color: #A0AEC0;  /* ✅ Texto cinza claro */
      margin: 0 0 8px 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .level-stats {
      background: #4a5568;  /* ✅ Background mais escuro */
      padding: 4px 10px;
      border-radius: 8px;
      display: inline-block;
      border: 1px solid #718096;
    }

    .questions-count {
      color: #63B3ED;  /* ✅ Azul claro */
      font-weight: 400;
      font-size: 0.8rem;
    }

    .level-action {
      min-width: 100px;
    }

    .start-btn {
      background: #3182ce;  /* ✅ Azul similar à imagem */
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

    .start-btn:hover:not(:disabled) {
      background: #2c5282;
      transform: translateY(-1px);
    }

    .locked-btn {
      background: #4a5568;
      color: #A0AEC0;
      border: 1px solid #718096;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 400;
      cursor: not-allowed;
      width: 100%;
      min-height: 40px;
    }

    /* === SEÇÃO CENTRAL - POR QUE APRENDER LIBRAS === */
    .central-section {
      flex: 1.2;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    .central-content {
      max-width: 500px;
      margin: 0 auto;
      color: white;
    }

    .section-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .section-header h2 {
      font-size: 2rem;
      font-weight: 300;
      margin-bottom: 8px;
      color: #FFFFFF;
    }

    .section-header p {
      font-size: 1rem;
      color: #A0AEC0;
      opacity: 0.8;
    }

    .info-cards {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 30px;
    }

    .info-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      transition: all 0.3s ease;
      animation: fadeInUp 0.6s ease-out;
      animation-fill-mode: both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .info-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(99, 179, 237, 0.3);
      transform: translateY(-2px);
    }

    .info-icon {
      font-size: 2rem;
      min-width: 50px;
      text-align: center;
      opacity: 0.9;
    }

    .info-content h3 {
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0 0 8px 0;
      color: #FFFFFF;
    }

    .info-content p {
      font-size: 0.9rem;
      color: #CBD5E1;
      line-height: 1.5;
      margin: 0 0 10px 0;
    }

    .info-stat {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .stat-number {
      font-size: 1.4rem;
      font-weight: 600;
      color: #63B3ED;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #A0AEC0;
      opacity: 0.8;
    }

    .quick-facts {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 20px;
    }

    .quick-facts h3 {
      font-size: 1.2rem;
      font-weight: 500;
      color: #FFFFFF;
      margin: 0 0 16px 0;
      text-align: center;
    }

    .facts-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .fact-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .fact-item:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .fact-icon {
      font-size: 1.1rem;
      min-width: 20px;
      text-align: center;
    }

    .fact-text {
      font-size: 0.85rem;
      color: #CBD5E1;
      line-height: 1.4;
    }

    /* === LADO DIREITO - HERO === */
    .hero-section {
      flex: 1;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    .hero-content {
      text-align: center;
      color: white;
      max-width: 450px;
    }

    .libras-demo {
      margin-bottom: 30px;
    }

    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
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

    /* === DISCLAIMER === */
    .disclaimer {
      position: fixed;
      bottom: 20px;
      left: 20px;
      max-width: 280px;
      z-index: 1000;
      animation: slideInLeft 1s ease-out 2s both;
    }

    .disclaimer-content {
      background: rgba(45, 55, 72, 0.95);  /* ✅ Fundo escuro */
      backdrop-filter: blur(10px);
      border: 1px solid rgba(74, 85, 104, 0.6);
      border-radius: 8px;
      padding: 12px 14px;
      color: #CBD5E1;
      font-size: 0.75rem;
      line-height: 1.3;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .disclaimer-text strong {
      color: #63B3ED;  /* ✅ Azul claro */
      font-weight: 500;
    }

    /* === RESPONSIVIDADE === */
    @media (max-width: 1024px) {
      .main-container {
        flex-direction: column;
      }

      .levels-section,
      .central-section,
      .hero-section {
        flex: none;
        padding: 30px 20px;
      }

      .levels-stack {
        max-width: 100%;
      }

      .central-content {
        max-width: 100%;
      }

      .logo-circle {
        width: 180px;
        height: 180px;
      }

      .logo-hands {
        font-size: 3.5rem;
      }

      .logo-text {
        font-size: 1.6rem;
      }

      .hero-text h2 {
        font-size: 2.2rem;
      }

      .app-header h1 {
        font-size: 3rem;
      }
    }

    @media (max-width: 768px) {
      .app-header h1 {
        font-size: 2.5rem;
      }

      .hero-text h2 {
        font-size: 1.8rem;
      }

      .level-content {
        gap: 12px;
      }

      .level-info h3 {
        font-size: 1.1rem;
      }

      .level-info p {
        font-size: 0.85rem;
      }

      .logo-circle {
        width: 150px;
        height: 150px;
      }

      .logo-hands {
        font-size: 3rem;
      }

      .logo-text {
        font-size: 1.4rem;
      }

      .benefits {
        gap: 10px;
      }

      .benefit {
        padding: 10px 12px;
        font-size: 0.9rem;
      }
    }

    @media (max-width: 768px) {
      .disclaimer {
        bottom: 15px;
        left: 15px;
        right: 15px;
        max-width: none;
      }

      .disclaimer-content {
        font-size: 0.7rem;
        padding: 10px 12px;
      }
    }
  `]
})
export class LevelListComponent {
  niveis = [
    {
      numero: 1,
      emoji: '👋',
      descricao: 'Cumprimentos essenciais',
      totalPerguntas: 5,
      disponivel: true
    },
    {
      numero: 2,
      emoji: '👋',
      descricao: 'Numeros',
      totalPerguntas: 5,
      disponivel: false
    },
    {
      numero: 3,
      emoji: '👨‍👩‍👧‍👦',
      descricao: 'Família',
      totalPerguntas: 5,
      disponivel: false
    },
    {
      numero: 4,
      emoji: '🍎',
      descricao: 'Alimentos básicos',
      totalPerguntas: 5,
      disponivel: false
    },
    {
      numero: 5,
      emoji: '🏠',
      descricao: 'Lugares importantes',
      totalPerguntas: 5,
      disponivel: false
    }
  ];

  informacoes = [
    {
      icone: '🤲',
      titulo: 'Inclusão Social',
      descricao: 'LIBRAS é a 2ª língua oficial do Brasil, essencial para incluir a comunidade surda.',
      estatistica: {
        numero: '10,7M',
        label: 'pessoas com deficiência auditiva no Brasil'
      }
    },
    {
      icone: '🧠',
      titulo: 'Desenvolvimento Cognitivo',
      descricao: 'Aprender uma língua visual-espacial desenvolve novas áreas do cérebro.',
      estatistica: {
        numero: '2002',
        label: 'ano de reconhecimento oficial'
      }
    },
    {
      icone: '💼',
      titulo: 'Oportunidades Profissionais',
      descricao: 'Mercado em crescimento para intérpretes e profissionais capacitados.',
      estatistica: {
        numero: '+50%',
        label: 'crescimento na demanda'
      }
    }
  ];

  fatos = [
    {
      icone: '✋',
      texto: 'LIBRAS possui gramática própria e estrutura linguística completa'
    },
    {
      icone: '🏫',
      texto: 'Disciplina obrigatória nos cursos de licenciatura desde 2005'
    },
    {
      icone: '🌍',
      texto: 'Cada país tem sua própria língua de sinais'
    },
    {
      icone: '👥',
      texto: 'Comunidade surda tem cultura e identidade próprias'
    }
  ];

  // Método para lidar com erro de carregamento da imagem (mantido para compatibilidade)
  onImageError(event: Event) {
    console.warn('Logo agora é CSS - método mantido para compatibilidade');
  }
}
