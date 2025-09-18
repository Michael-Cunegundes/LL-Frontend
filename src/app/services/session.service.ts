// src/app/services/session.service.ts - VERSÃO COM PERSISTÊNCIA
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NivelProgresso {
  nivel: number;
  pontuacao?: number;
  totalPerguntas: number;
  completado: boolean;
  desbloqueado: boolean;
  dataCompletado?: string;
  tentativas?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly STORAGE_KEY = 'libralingo_progress';
  private readonly STORAGE_VERSION = '1.0';

  private progressoSubject = new BehaviorSubject<Map<number, NivelProgresso>>(new Map());
  public progresso$ = this.progressoSubject.asObservable();

private readonly NIVEIS_CONFIG = [
  { numero: 1, nome: 'Cumprimentos Básicos', emoji: '👋', descricao: 'Cumprimentos básicos em LIBRAS', totalPerguntas: 5 },
  { numero: 2, nome: 'Conversas Cotidianas', emoji: '🗣️', descricao: 'Palavras mais usadas em libras', totalPerguntas: 5 },
  { numero: 3, nome: 'Família', emoji: '👨‍👩‍👧‍👦', descricao: 'Sinais da família', totalPerguntas: 5 },
  { numero: 4, nome: 'Alimentos', emoji: '🍎', descricao: 'Comidas e bebidas', totalPerguntas: 5 },
  { numero: 5, nome: 'Lugares', emoji: '🏠', descricao: 'Lugares importantes', totalPerguntas: 5 }
];

  constructor() {
    this.carregarProgresso();
  }

  private carregarProgresso(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);

      if (saved) {
        const data = JSON.parse(saved);

        // Verificar versão para evitar problemas com mudanças futuras
        if (data.version === this.STORAGE_VERSION) {
          const progressoMap = new Map<number, NivelProgresso>();

          // Reconstruir o Map a partir do objeto salvo
          Object.keys(data.progresso).forEach(key => {
            const nivel = parseInt(key);
            progressoMap.set(nivel, data.progresso[key]);
          });

          this.progressoSubject.next(progressoMap);
          console.log('✅ Progresso carregado do localStorage');
          return;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }

    // Se não há dados salvos ou houve erro, inicializar novo
    this.inicializarProgresso();
  }

  private inicializarProgresso(): void {
    const progressoInicial = new Map<number, NivelProgresso>();

    this.NIVEIS_CONFIG.forEach(config => {
      progressoInicial.set(config.numero, {
        nivel: config.numero,
        totalPerguntas: config.totalPerguntas,
        completado: false,
        desbloqueado: config.numero === 1,
        tentativas: 0
      });
    });

    this.progressoSubject.next(progressoInicial);
    this.salvarProgresso();
  }

  private salvarProgresso(): void {
    try {
      const progressoMap = this.progressoSubject.getValue();

      // Converter Map para objeto para salvar no localStorage
      const progressoObj: any = {};
      progressoMap.forEach((value, key) => {
        progressoObj[key] = value;
      });

      const dataToSave = {
        version: this.STORAGE_VERSION,
        progresso: progressoObj,
        ultimaAtualizacao: new Date().toISOString()
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('💾 Progresso salvo no localStorage');
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  }

  public registrarResultado(nivel: number, pontuacao: number, totalPerguntas: number): void {
    const progressoAtual = this.progressoSubject.getValue();
    const nivelAtual = progressoAtual.get(nivel);

    if (nivelAtual) {
      // Incrementar tentativas
      nivelAtual.tentativas = (nivelAtual.tentativas || 0) + 1;

      // Atualizar melhor pontuação
      if (!nivelAtual.pontuacao || pontuacao > nivelAtual.pontuacao) {
        nivelAtual.pontuacao = pontuacao;
      }

      // Marcar como completado se ainda não estava
      if (!nivelAtual.completado) {
        nivelAtual.completado = true;
        nivelAtual.dataCompletado = new Date().toISOString();
      }

      // Regra de desbloqueio: 4 acertos de 5 perguntas
      const passou = pontuacao >= 4;

      if (passou && nivel < 5) {
        const proximoNivel = progressoAtual.get(nivel + 1);
        if (proximoNivel && !proximoNivel.desbloqueado) {
          proximoNivel.desbloqueado = true;
          console.log(`🔓 Nível ${nivel + 1} desbloqueado!`);
        }
      }

      progressoAtual.set(nivel, nivelAtual);
      this.progressoSubject.next(new Map(progressoAtual));

      // Salvar após cada mudança
      this.salvarProgresso();

      console.log(`✅ Nível ${nivel} completado: ${pontuacao}/${totalPerguntas} (Tentativa #${nivelAtual.tentativas})`);
    }
  }

  public isNivelDesbloqueado(nivel: number): boolean {
    const progresso = this.progressoSubject.getValue();
    const nivelData = progresso.get(nivel);
    return nivelData?.desbloqueado || false;
  }

  public isNivelCompletado(nivel: number): boolean {
    const progresso = this.progressoSubject.getValue();
    const nivelData = progresso.get(nivel);
    return nivelData?.completado || false;
  }

  public getPontuacaoNivel(nivel: number): number | undefined {
    const progresso = this.progressoSubject.getValue();
    return progresso.get(nivel)?.pontuacao;
  }

public getNiveisComStatus() {
  const progresso = this.progressoSubject.getValue();

  return this.NIVEIS_CONFIG.map(config => {
    const progressoNivel = progresso.get(config.numero);
    return {
      ...config,
      disponivel: progressoNivel?.desbloqueado || false,
      completado: progressoNivel?.completado || false,
      pontuacao: progressoNivel?.pontuacao,
      tentativas: progressoNivel?.tentativas || 0,
      dataCompletado: progressoNivel?.dataCompletado,


    };
  });
}

  public getEstatisticas() {
    const progresso = this.progressoSubject.getValue();
    const niveisCompletados = Array.from(progresso.values()).filter(n => n.completado);

    if (niveisCompletados.length === 0) {
      return null;
    }

    const totalAcertos = niveisCompletados.reduce((sum, n) => sum + (n.pontuacao || 0), 0);
    const totalPerguntas = niveisCompletados.reduce((sum, n) => sum + n.totalPerguntas, 0);
    const totalTentativas = Array.from(progresso.values()).reduce((sum, n) => sum + (n.tentativas || 0), 0);

    return {
      niveisCompletados: niveisCompletados.length,
      totalAcertos,
      totalPerguntas,
      totalTentativas,
      mediaPercentual: Math.round((totalAcertos / totalPerguntas) * 100),
      niveisDesbloqueados: Array.from(progresso.values()).filter(n => n.desbloqueado).length
    };
  }

  public resetarProgresso(): void {
    if (confirm('Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.inicializarProgresso();
      console.log('🔄 Progresso resetado');
    }
  }

  // Novo método para exportar progresso
  public exportarProgresso(): string {
    const progressoMap = this.progressoSubject.getValue();
    const progressoObj: any = {};

    progressoMap.forEach((value, key) => {
      progressoObj[key] = value;
    });

    return JSON.stringify({
      version: this.STORAGE_VERSION,
      progresso: progressoObj,
      exportadoEm: new Date().toISOString()
    }, null, 2);
  }

  // Novo método para importar progresso
  public importarProgresso(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);

      if (data.version !== this.STORAGE_VERSION) {
        alert('Versão incompatível do arquivo de progresso');
        return false;
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      this.carregarProgresso();
      return true;
    } catch (error) {
      console.error('Erro ao importar progresso:', error);
      return false;
    }
  }
}
