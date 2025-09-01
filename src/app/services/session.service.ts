// src/app/services/session.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NivelProgresso {
  nivel: number;
  pontuacao?: number;
  totalPerguntas: number;
  completado: boolean;
  desbloqueado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // Estado do progresso em memória
  private progressoSubject = new BehaviorSubject<Map<number, NivelProgresso>>(new Map());
  public progresso$ = this.progressoSubject.asObservable();

  // Configuração dos níveis do MVP
  private readonly NIVEIS_CONFIG = [
    { numero: 1, nome: 'Cumprimentos', emoji: '👋', descricao: 'Cumprimentos básicos em LIBRAS', totalPerguntas: 5 },
    { numero: 2, nome: 'Conversas Cotidianas', emoji: '🗣️', descricao: 'Palavras mais usadas em libras', totalPerguntas: 5 },
    { numero: 3, nome: 'Família', emoji: '👨‍👩‍👧‍👦', descricao: 'Sinais da família (Em breve)', totalPerguntas: 5 },
    { numero: 4, nome: 'Alimentos', emoji: '🍎', descricao: 'Comidas e bebidas (Em breve)', totalPerguntas: 5 },
    { numero: 5, nome: 'Lugares', emoji: '🏠', descricao: 'Lugares importantes (Em breve)', totalPerguntas: 5 }
  ];

  constructor() {
    this.inicializarProgresso();
  }

  private inicializarProgresso(): void {
    const progressoInicial = new Map<number, NivelProgresso>();

    // Inicializar todos os níveis
    this.NIVEIS_CONFIG.forEach(config => {
      progressoInicial.set(config.numero, {
        nivel: config.numero,
        totalPerguntas: config.totalPerguntas,
        completado: false,
        desbloqueado: config.numero === 1 // Apenas nível 1 desbloqueado inicialmente
      });
    });

    this.progressoSubject.next(progressoInicial);
  }

  // Registrar resultado de um quiz
  public registrarResultado(nivel: number, pontuacao: number, totalPerguntas: number): void {
    const progressoAtual = this.progressoSubject.getValue();
    const nivelAtual = progressoAtual.get(nivel);

    if (nivelAtual) {
      // Atualizar nível atual
      nivelAtual.pontuacao = pontuacao;
      nivelAtual.completado = true;

      // ✅ REGRA DE DESBLOQUEIO: 4 acertos de 5 perguntas
      const passou = pontuacao >= 4;

      if (passou && nivel < 5) {
        // Desbloquear próximo nível
        const proximoNivel = progressoAtual.get(nivel + 1);
        if (proximoNivel) {
          proximoNivel.desbloqueado = true;
        }
      }

      // Atualizar estado
      progressoAtual.set(nivel, nivelAtual);
      this.progressoSubject.next(new Map(progressoAtual));

      console.log(`✅ Nível ${nivel} completado: ${pontuacao}/${totalPerguntas}`);
      if (passou && nivel < 5) {
        console.log(`🔓 Nível ${nivel + 1} desbloqueado!`);
      }
    }
  }

  // Verificar se nível está desbloqueado
  public isNivelDesbloqueado(nivel: number): boolean {
    const progresso = this.progressoSubject.getValue();
    const nivelData = progresso.get(nivel);
    return nivelData?.desbloqueado || false;
  }

  // Verificar se nível foi completado
  public isNivelCompletado(nivel: number): boolean {
    const progresso = this.progressoSubject.getValue();
    const nivelData = progresso.get(nivel);
    return nivelData?.completado || false;
  }

  // Obter pontuação de um nível
  public getPontuacaoNivel(nivel: number): number | undefined {
    const progresso = this.progressoSubject.getValue();
    return progresso.get(nivel)?.pontuacao;
  }

  // Obter lista de níveis com status
  public getNiveisComStatus() {
    const progresso = this.progressoSubject.getValue();

    return this.NIVEIS_CONFIG.map(config => {
      const progressoNivel = progresso.get(config.numero);
      return {
        ...config,
        disponivel: progressoNivel?.desbloqueado || false,
        completado: progressoNivel?.completado || false,
        pontuacao: progressoNivel?.pontuacao,
        // Marcar níveis não implementados ainda
        emBreve: config.numero > 2
      };
    });
  }

  // Obter estatísticas gerais
  public getEstatisticas() {
    const progresso = this.progressoSubject.getValue();
    const niveisCompletados = Array.from(progresso.values()).filter(n => n.completado);

    if (niveisCompletados.length === 0) {
      return null;
    }

    const totalAcertos = niveisCompletados.reduce((sum, n) => sum + (n.pontuacao || 0), 0);
    const totalPerguntas = niveisCompletados.reduce((sum, n) => sum + n.totalPerguntas, 0);

    return {
      niveisCompletados: niveisCompletados.length,
      totalAcertos,
      totalPerguntas,
      mediaPercentual: Math.round((totalAcertos / totalPerguntas) * 100)
    };
  }

  // Resetar progresso (para desenvolvimento/teste)
  public resetarProgresso(): void {
    this.inicializarProgresso();
    console.log('🔄 Progresso resetado');
  }
}
