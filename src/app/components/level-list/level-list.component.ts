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

      <!-- Lado Direito - Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="libras-demo">
            <img src="/images/logo.png"
                 alt="Logo LibraLingo - Aprenda LIBRAS"
                 class="libras-sign"
                 (error)="onImageError($event)">
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
      min-height: 100vh;
      background: #1a202c;  /* ✅ Fundo escuro similar à imagem */
      display: flex;
      width: 100%;
      position: relative;
      overflow: hidden;
    }

    /* === LADO ESQUERDO - NÍVEIS === */
    .levels-section {
      flex: 1.4;
      padding: 40px;
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
      font-size: 7rem;
      margin-bottom: 15px;
      font-weight: 400;
      color: #FFFFFF;
      letter-spacing: -1px;
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
      background: #2d3748;
      border-radius: 10px;
      padding: 15px;
      transition: all 0.5s ease;
      min-height: 50px;
      border: 1px solid #black;
      animation: slideInLeft 0.5s ease-out;
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
      background: #3182ce;
      color: #000000;
      border: 10px;
      padding: 12px 50px;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.5s ease;
      width: 100%;
      min-height: 50px;
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

    /* === LADO DIREITO - HERO === */
    .hero-section {
      flex: 1;
      padding: 40px;
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

    .libras-sign {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      object-fit: cover;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.15);
      transition: all 0.3s ease;
    }

    .libras-sign:hover {
      border-color: rgba(255, 255, 255, 0.3);
      transform: scale(1.02);
    }

    .libras-sign.error {
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      color: white;
    }

    .hero-text h2 {
      font-size: 2.5rem;
      margin-bottom: 25px;
      font-weight: 500;
      color: #ffffff;
      letter-spacing: 0px;
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

      .levels-section {
        padding: 30px 20px;
      }

      .hero-section {
        padding: 20px;
      }

      .levels-stack {
        max-width: 100%;
      }

      .libras-sign {
        width: 180px;
        height: 180px;
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

      .libras-sign {
        width: 150px;
        height: 150px;
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
      emoji: '🌟',
      descricao: 'Sinais básicos - Alfabeto e números',
      totalPerguntas: 5,
      disponivel: true
    },
    {
      numero: 2,
      emoji: '🏠',
      descricao: 'Família e casa',
      totalPerguntas: 5,
      disponivel: false
    },
    {
      numero: 3,
      emoji: '🍎',
      descricao: 'Alimentos e bebidas',
      totalPerguntas: 5,
      disponivel: false
    },
    {
      numero: 4,
      emoji: '🚗',
      descricao: 'Transporte e lugares',
      totalPerguntas: 5,
      disponivel: false
    }
  ];

  // Método para lidar com erro de carregamento da imagem
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('error');
    img.innerHTML = '🤟'; // Emoji de mão em LIBRAS como fallback
    console.warn('Imagem do logo não pôde ser carregada. Verifique se existe em /assets/images/logo.png no backend');
  }
}
