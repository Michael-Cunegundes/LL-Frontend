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
               [style.z-index]="niveis.length - i">

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

      <!-- Lado Direito - Sinal/Logo -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="libras-demo">
            <img src="https://via.placeholder.com/300x300/6B46C1/ffffff?text=APRENDER"
                 alt="Sinal de Aprender em LIBRAS"
                 class="libras-sign">
          </div>

          <div class="hero-text">
            <h2>Aprenda LIBRAS</h2>
            <p>Descubra a linguagem de sinais brasileira de forma interativa e divertida.</p>

            <div class="features">
              <div class="feature">
                <span class="feature-icon">🎯</span>
                <span>Exercícios práticos</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📊</span>
                <span>Acompanhe seu progresso</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🏆</span>
                <span>Conquiste níveis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
    }

    /* === LADO ESQUERDO - NÍVEIS === */
    .levels-section {
      flex: 1;
      padding: 40px;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      text-align: left;
      color: white;
      margin-bottom: 40px;
    }

    .app-header h1 {
      font-size: 3rem;
      margin-bottom: 10px;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0;
    }

    .levels-stack {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-width: 450px;
    }

    .level-item {
      background: white;
      border-radius: 20px;
      padding: 25px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      position: relative;
    }

    .level-item.available:hover {
      transform: translateX(10px) scale(1.02);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }

    .level-item.locked {
      opacity: 0.6;
      background: #f8f9fa;
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
      color: #374151;
      margin: 0 0 8px 0;
      font-size: 1.3rem;
    }

    .level-info p {
      color: #6B7280;
      margin: 0 0 10px 0;
      font-size: 0.9rem;
    }

    .level-stats {
      background: #F3F4F6;
      padding: 5px 12px;
      border-radius: 15px;
      display: inline-block;
    }

    .questions-count {
      color: #374151;
      font-weight: 500;
      font-size: 0.8rem;
    }

    .level-action {
      min-width: 100px;
    }

    .start-btn {
      background: #6B46C1;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
    }

    .start-btn:hover:not(:disabled) {
      background: #553C9A;
      transform: translateY(-1px);
    }

    .locked-btn {
      background: #9CA3AF;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: not-allowed;
      width: 100%;
    }

    /* === LADO DIREITO - HERO === */
    .hero-section {
      flex: 1;
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
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
      border: 6px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }

    .libras-sign:hover {
      transform: scale(1.05) rotate(5deg);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    }

    .hero-text h2 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .hero-text p {
      font-size: 1.2rem;
      line-height: 1.6;
      opacity: 0.9;
      margin-bottom: 40px;
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: flex-start;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 15px;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .feature-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
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
        font-size: 2rem;
      }

      .features {
        align-items: center;
      }
    }

    @media (max-width: 768px) {
      .app-header h1 {
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
        width: 150px;
        height: 150px;
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
}
