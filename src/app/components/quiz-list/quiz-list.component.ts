// src/app/components/quiz-list/quiz-list.component.ts - CORRIGIDO
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { QuestaoDTO, RespostaQuizDTO, ResultadoQuizDTO, RespostaDetalhada } from '../../models';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'quiz-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  perguntas: QuestaoDTO[] = [];
  respostas: RespostaQuizDTO[] = [];
  respostasDetalhadas: RespostaDetalhada[] = [];
  tempoInicioPergunta: number = 0;
  currentQuestionIndex = 0;
  selectedOption: number | null = null;
  level = 1;
  loading = false;
  erro = '';
  isAnswered = false;

  private readonly API_BASE = 'http://localhost:8080/api/quiz';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.level = +params['level'] || 1;

        if (!this.sessionService.isNivelDesbloqueado(this.level)) {
          this.erro = `Nível ${this.level} está bloqueado. Complete o nível anterior com pelo menos 4 acertos.`;
          this.loading = false;
          return;
        }

        this.carregarPerguntas();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  carregarPerguntas() {
    this.loading = true;
    this.erro = '';

    const url = `${this.API_BASE}/levels/${this.level}/questions`;

    this.http.get<QuestaoDTO[]>(url).subscribe({
      next: (questoes) => {
        if (!questoes || questoes.length === 0) {
          this.erro = `Nível ${this.level} não possui perguntas disponíveis.`;
          this.loading = false;
          return;
        }

        this.perguntas = questoes;
        this.respostas = this.perguntas.map(p => ({
          perguntaId: p.id,
          opcaoEscolhida: null
        }));

        this.respostasDetalhadas = [];
        this.tempoInicioPergunta = Date.now();

        console.log(`Carregadas ${this.perguntas.length} perguntas do Nível ${this.level}`);
        this.loading = false;
      },

      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar perguntas:', error);

        if (error.status === 0) {
          this.erro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 8080.';
        } else if (error.status === 404) {
          this.erro = `Nível ${this.level} não encontrado no servidor.`;
        } else {
          this.erro = 'Erro ao carregar perguntas. Tente novamente.';
        }

        this.loading = false;
      }
    });
  }

  get currentQuestion(): QuestaoDTO | null {
    return this.perguntas[this.currentQuestionIndex] || null;
  }

  get progress(): number {
    return Math.round(((this.currentQuestionIndex + 1) / this.perguntas.length) * 100);
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.perguntas.length - 1;
  }

  selectOption(optionIndex: number) {
    if (optionIndex < 0 || !this.currentQuestion) return;

    this.selectedOption = optionIndex;
    this.isAnswered = true;
    this.respostas[this.currentQuestionIndex].opcaoEscolhida = optionIndex;
    this.salvarRespostaDetalhada(optionIndex);
  }

  private salvarRespostaDetalhada(opcaoEscolhida: number) {
    const perguntaAtual = this.currentQuestion;
    if (!perguntaAtual) return;

    const tempoResposta = Date.now() - this.tempoInicioPergunta;
    const acertou = opcaoEscolhida === perguntaAtual.indiceCorreto;

    const indexExistente = this.respostasDetalhadas.findIndex(
      r => r.pergunta.id === perguntaAtual.id
    );

    const respostaDetalhada: RespostaDetalhada = {
      pergunta: perguntaAtual,
      opcaoEscolhida,
      acertou,
      tempoResposta
    };

    if (indexExistente >= 0) {
      this.respostasDetalhadas[indexExistente] = respostaDetalhada;
    } else {
      this.respostasDetalhadas.push(respostaDetalhada);
    }
  }

  nextQuestion() {
    if (!this.isAnswered) return;

    if (this.isLastQuestion) {
      this.submitQuiz();
    } else {
      this.currentQuestionIndex++;
      this.selectedOption = null;
      this.isAnswered = false;
      this.tempoInicioPergunta = Date.now();

      const savedAnswer = this.respostas[this.currentQuestionIndex].opcaoEscolhida;
      if (savedAnswer !== null) {
        this.selectedOption = savedAnswer;
        this.isAnswered = true;
      }
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;

      const savedAnswer = this.respostas[this.currentQuestionIndex].opcaoEscolhida;
      this.selectedOption = savedAnswer;
      this.isAnswered = savedAnswer !== null;
    }
  }

  getQuestionText(): string {
    if (!this.currentQuestion) return '';

    if (this.currentQuestion.prompt.length > 1) {
      return 'Qual o significado dessa sequência de sinais?';
    } else {
      return 'Qual o significado deste sinal?';
    }
  }

  submitQuiz() {
    this.loading = true;

    this.http.post<ResultadoQuizDTO>(`${this.API_BASE}/respostas`, this.respostas).subscribe({
      next: (resultado) => {
        console.log(`Resultado recebido:`, resultado);

        this.sessionService.registrarResultado(
          this.level,
          resultado.pontuacao,
          this.perguntas.length
        );

        this.router.navigate(['/resultado'], {
          state: {
            resultado,
            level: this.level,
            respostasDetalhadas: this.respostasDetalhadas,
            desbloqueouProximo: resultado.pontuacao >= 4 && this.level < 5
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao enviar respostas:', error);
        this.erro = 'Erro ao calcular resultado. Tente novamente.';
        this.loading = false;
      }
    });
  }

  onImageError(event: Event, imagemUrl: string): void {
    console.error('Erro ao carregar imagem:', imagemUrl);
    const img = event.target as HTMLImageElement;

    img.style.background = '#f0f0f0';
    img.style.display = 'flex';
    img.style.alignItems = 'center';
    img.style.justifyContent = 'center';
    img.style.color = '#666';
    img.style.fontSize = '0.9rem';
    img.alt = `Imagem não encontrada: ${imagemUrl}`;
    img.title = `Erro: ${imagemUrl}`;
  }

  voltarNiveis(): void {
    this.router.navigate(['']);
  }
}
