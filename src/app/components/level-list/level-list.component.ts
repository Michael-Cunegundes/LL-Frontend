// src/app/components/level-list/level-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'level-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="level-container">
      <header class="app-header">
        <h1>LibraLingo</h1>
        <p>Aprenda LIBRAS de forma interativa!</p>
      </header>

      <div class="levels-grid">
        <div *ngFor="let nivel of niveis"
             class="level-card"
             [class.available]="nivel.disponivel"
             [class.locked]="!nivel.disponivel">

          <div class="level-icon">
            <span *ngIf="nivel.disponivel">{{ nivel.emoji }}</span>
            <span *ngIf="!nivel.disponivel">🔒</span>
          </div>

          <h3>Nível {{ nivel.numero }}</h3>
          <p>{{ nivel.descricao }}</p>

          <div class="level-stats" *ngIf="nivel.disponivel">
            <span class="questions-count">{{ nivel.totalPerguntas }} perguntas</span>
          </div>

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

      <div class="app-info">
        <h2>Como funciona?</h2>
        <div class="info-steps">
          <div class="step">
            <span class="step-number">1</span>
            <p>Escolha um nível</p>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <p>Responda às perguntas</p>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <p>Veja seu resultado</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .level-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .app-header {
      text-align: center;
      color: white;
      margin-bottom: 50px;
    }

    .app-header h1 {
      font-size: 3rem;
      margin-bottom: 10px;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .app-header p {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .levels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto 60px;
    }

    .level-card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;
    }

    .level-card.available:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .level-card.locked {
      opacity: 0.6;
      background: #f8f9fa;
    }

    .level-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .level-card h3 {
      color: #374151;
      margin-bottom: 10px;
      font-size: 1.5rem;
    }

    .level-card p {
      color: #6B7280;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .level-stats {
      background: #F3F4F6;
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .questions-count {
      color: #374151;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .start-btn {
      background: #6B46C1;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      font-size: 1.1rem;
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
      padding: 12px 30px;
      border-radius: 25px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: not-allowed;
      width: 100%;
    }

    .app-info {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
      color: white;
    }

    .app-info h2 {
      font-size: 2rem;
      margin-bottom: 30px;
    }

    .info-steps {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 200px;
    }

    .step-number {
      background: white;
      color: #6B46C1;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .step p {
      margin: 0;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .app-header h1 {
        font-size: 2rem;
      }

      .levels-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .info-steps {
        flex-direction: column;
        gap: 20px;
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
      disponivel: false // Será liberado após completar o nível 1
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
