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
               [style.z-index]="niveis.length - i"
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
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%);
      display: flex;
      width: 100%;
      position: relative;
      overflow: hidden;
    }

    /* Efeito sutil de grade no fundo */
    .main-container::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><defs><pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'><path d='M 40 0 L 0 0 0 40' fill='none' stroke='%233B82F6' stroke-width='0.5' opacity='0.1'/></pattern></defs><rect width='100%' height='100%' fill='url(%23grid)' /></svg>") repeat;
      pointer-events: none;
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
      margin-bottom: 20px;
    }

    .app-header h1 {
      font-size: 7rem;
      margin-bottom: 10px;
      font-weight: 300;
      text-shadow: none;
      color: #FFFFFF;
      letter-spacing: -2px;
    }

    .subtitle {
      font-size: 1.4rem;
      opacity: 0.8;
      margin: 0;
      color: #CBD5E1;
      font-weight: 300;
    }

    .levels-stack {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 600px;
    }

    .level-item {
      background: #FFFFFF;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      position: relative;
      min-height: 100px;
      border: 1px solid #F1F5F9;
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
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(59, 130, 246, 0.15);
      border-color: #3B82F6;
    }

    .level-item.locked {
      opacity: 0.6;
      background: #F8FAFC;
      border-color: #E2E8F0;
    }

    .level-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .level-icon {
      font-size: 2.5rem;
      min-width: 60px;
      text-align: center;
    }

    .level-info {
      flex: 1;
    }

    .level-info h3 {
      color: #1E293B;
      margin: 0 0 8px 0;
      font-size: 1.4rem;
      font-weight: 600;
    }

    .level-info p {
      color: #64748B;
      margin: 0 0 12px 0;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .level-stats {
      background: #EFF6FF;
      padding: 6px 14px;
      border-radius: 12px;
      display: inline-block;
      border: 1px solid #DBEAFE;
    }

    .questions-count {
      color: #3B82F6;
      font-weight: 500;
      font-size: 0.85rem;
    }

    .level-action {
      min-width: 120px;
    }

    .start-btn {
      background: #3B82F6;
      color: #FFFFFF;
      border: none;
      padding: 14px 24px;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      min-height: 48px;
      letter-spacing: 0.3px;
    }

    .start-btn:hover:not(:disabled) {
      background: #2563EB;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .locked-btn {
      background: #F1F5F9;
      color: #94A3B8;
      border: 1px solid #E2E8F0;
      padding: 14px 24px;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: not-allowed;
      width: 100%;
      min-height: 48px;
    }

    /* === LADO DIREITO - HERO === */
    .hero-section {
      flex: 0.7;
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
      max-width: 500px;
    }

    .libras-demo {
      margin-bottom: 40px;
    }

    .libras-sign {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      object-fit: cover;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .libras-sign:hover {
      border-color: rgba(255, 255, 255, 0.4);
      transform: scale(1.02);
    }

    .libras-sign.error {
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      color: white;
    }

    .hero-text h2 {
      font-size: 2.8rem;
      margin-bottom: 24px;
      font-weight: 300;
      color: #FFFFFF;
      letter-spacing: -1px;
    }

    .intro-text {
      font-size: 1.2rem;
      line-height: 1.7;
      opacity: 0.9;
      margin-bottom: 32px;
      text-align: center;
      color: #CBD5E1;
      font-weight: 300;
    }

    .benefits {
      display: grid;
      gap: 15px;
      text-align: left;
    }

    .benefit {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .benefit:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateX(4px);
      border-color: rgba(59, 130, 246, 0.3);
    }

    .benefit-icon {
      font-size: 1.4rem;
      width: 32px;
      text-align: center;
      flex-shrink: 0;
      opacity: 0.9;
    }

    /* === DISCLAIMER === */
    .disclaimer {
      position: fixed;
      bottom: 20px;
      left: 20px;
      max-width: 300px;
      z-index: 1000;
      animation: slideInLeft 1s ease-out 2s both;
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .disclaimer-content {
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 12px;
      padding: 14px 16px;
      color: #CBD5E1;
      font-size: 0.8rem;
      line-height: 1.4;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .disclaimer-icon {
      font-size: 1.1rem;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .disclaimer-text strong {
      color: #3B82F6;
      font-weight: 600;
    }

    /* Responsividade do disclaimer */
    @media (max-width: 768px) {
      .disclaimer {
        bottom: 15px;
        left: 15px;
        right: 15px;
        max-width: none;
      }

      .disclaimer-content {
        font-size: 0.75rem;
        padding: 12px 14px;
      }
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
        width: 200px;
        height: 200px;
      }

      .hero-text h2 {
        font-size: 2.5rem;
      }

      .app-header h1 {
        font-size: 4rem;
      }
    }

    @media (max-width: 768px) {
      .app-header h1 {
        font-size: 3rem;
      }

      .hero-text h2 {
        font-size: 2rem;
      }

      .level-content {
        flex-direction: column;
        text-align: center;
        gap: 15px;
      }

      .level-action {
        min-width: auto;
        width: 100%;
      }

      .libras-sign {
        width: 180px;
        height: 180px;
      }

      .benefits {
        gap: 12px;
      }

      .benefit {
        padding: 10px 14px;
        font-size: 0.9rem;
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
