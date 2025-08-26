// src/app/components/quiz-list/quiz-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestaoDTO, TipoPergunta, OptionDTO, RespostaQuizDTO, ResultadoQuizDTO } from '../../models';

@Component({
  selector: 'quiz-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {
  perguntas: QuestaoDTO[] = [];
  respostas: RespostaQuizDTO[] = [];
  currentQuestionIndex = 0;
  selectedOption: number | null = null;
  level = 1;
  loading = false;
  erro = '';
  isAnswered = false;

  private questoesLocais = {
    1: [
      {
        id: 1,
        tipo: 'IMAGEM_PARA_TEXTO' as TipoPergunta,
        prompt: ['/images/oipart1.png', '/images/oipart2.png'],
        opcoes: [
          { texto: 'Bom dia', imagemUrl: undefined },
          { texto: 'Boa tarde', imagemUrl: undefined },
          { texto: 'Oi', imagemUrl: undefined },
          { texto: 'Tchau', imagemUrl: undefined }
        ] as OptionDTO[],
        indiceCorreto: 2
      },
      {
        id: 2,
        tipo: 'IMAGEM_PARA_TEXTO' as TipoPergunta,
        prompt: ['/images/desculpa.png'],
        opcoes: [
          { texto: 'Tchau', imagemUrl: undefined },
          { texto: 'Oi', imagemUrl: undefined },
          { texto: 'Obrigado', imagemUrl: undefined },
          { texto: 'Desculpa', imagemUrl: undefined }
        ] as OptionDTO[],
        indiceCorreto: 3
      },
      {
        id: 3,
        tipo: 'IMAGEM_PARA_TEXTO' as TipoPergunta,
        prompt: ['/images/tchau1.png'],
        opcoes: [
          { texto: 'Oi', imagemUrl: undefined },
          { texto: 'Bom dia', imagemUrl: undefined },
          { texto: 'Tchau', imagemUrl: undefined },
          { texto: 'Obrigado', imagemUrl: undefined }
        ] as OptionDTO[],
        indiceCorreto: 2
      },
      {
        id: 4,
        tipo: 'TEXTO_PARA_IMAGEM' as TipoPergunta,
        prompt: ['Obrigado'],
        opcoes: [
          { texto: undefined, imagemUrl: '/images/desculpa2.png' },
          { texto: undefined, imagemUrl: '/images/idade.png' },
          { texto: undefined, imagemUrl: '/images/tchau.png' },
          { texto: undefined, imagemUrl: '/images/bomdia.png' }
        ] as OptionDTO[],
        indiceCorreto: 0
      },
      {
        id: 5,
        tipo: 'TEXTO_PARA_IMAGEM' as TipoPergunta,
        prompt: ['Eu'],
        opcoes: [
          { texto: undefined, imagemUrl: '/images/eu.png' },
          { texto: undefined, imagemUrl: '/images/mim.png' },
          { texto: undefined, imagemUrl: '/images/obrigado.png' },
          { texto: undefined, imagemUrl: '/images/sol.png' }
        ] as OptionDTO[],
        indiceCorreto: 0
      }
    ] as QuestaoDTO[],
    2: [
      {
        id: 6,
        tipo: 'IMAGEM_PARA_TEXTO' as TipoPergunta,
        prompt: ['/images/sol.png'],
        opcoes: [
          { texto: 'Sol', imagemUrl: undefined },
          { texto: 'Lua', imagemUrl: undefined },
          { texto: 'Estrela', imagemUrl: undefined },
          { texto: 'Nuvem', imagemUrl: undefined }
        ] as OptionDTO[],
        indiceCorreto: 0
      }
    ] as QuestaoDTO[]
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.level = +params['level'] || 1;
      this.carregarPerguntas();
    });
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  carregarPerguntas() {
    this.loading = true;
    this.erro = '';

    setTimeout(() => {
      try {
        const questoesDoNivel = this.questoesLocais[this.level as keyof typeof this.questoesLocais];

        if (!questoesDoNivel || questoesDoNivel.length === 0) {
          this.erro = `Nível ${this.level} ainda não disponível. Tente o Nível 1.`;
          this.loading = false;
          return;
        }

        this.perguntas = questoesDoNivel;
        this.respostas = this.perguntas.map(p => ({
          perguntaId: p.id,
          opcaoEscolhida: null
        }));

        console.log(`✅ Carregadas ${this.perguntas.length} perguntas do Nível ${this.level}`);
        this.loading = false;

      } catch (error) {
        console.error('Erro ao carregar perguntas:', error);
        this.erro = 'Erro ao carregar perguntas. Tente novamente.';
        this.loading = false;
      }
    }, 500);
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
    this.selectedOption = optionIndex;
    this.isAnswered = true;
    this.respostas[this.currentQuestionIndex].opcaoEscolhida = optionIndex;
  }

  nextQuestion() {
    if (!this.isAnswered) return;

    if (this.isLastQuestion) {
      this.submitQuiz();
    } else {
      this.currentQuestionIndex++;
      this.selectedOption = null;
      this.isAnswered = false;

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

  submitQuiz() {
    this.loading = true;

    setTimeout(() => {
      let acertos = 0;

      this.respostas.forEach((resposta, index) => {
        const pergunta = this.perguntas[index];
        if (resposta.opcaoEscolhida === pergunta.indiceCorreto) {
          acertos++;
        }
      });

      const total = this.perguntas.length;
      const percentual = Math.round((acertos / total) * 100);

      let mensagem = '';
      if (percentual >= 80) {
        mensagem = `Excelente! Você acertou ${acertos} de ${total} perguntas (${percentual}%)`;
      } else if (percentual >= 60) {
        mensagem = `Muito bem! Você acertou ${acertos} de ${total} perguntas (${percentual}%)`;
      } else {
        mensagem = `Continue praticando! Você acertou ${acertos} de ${total} perguntas (${percentual}%)`;
      }

      const resultado: ResultadoQuizDTO = {
        pontuacao: acertos,
        mensagem: mensagem
      };

      console.log(`🎯 Resultado: ${acertos}/${total} (${percentual}%)`);

      this.router.navigate(['/resultado'], {
        state: {
          resultado,
          level: this.level
        }
      });
    }, 1000);
  }

  voltarNiveis(): void {
    this.router.navigate(['']);
  }

  adicionarPergunta(nivel: number, pergunta: QuestaoDTO) {
    if (!this.questoesLocais[nivel as keyof typeof this.questoesLocais]) {
      this.questoesLocais[nivel as keyof typeof this.questoesLocais] = [];
    }
    this.questoesLocais[nivel as keyof typeof this.questoesLocais].push(pergunta);
  }
}
